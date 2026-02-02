# Project Update: Emission Mask API Refactor

**Date**: 2026-02-02
**Description**: Major update to the `emission_mask` API to support bitmask responses and enhanced region analysis.

## 1. Summary of Changes

-   **Bitmask Support**: The emission mask calculation now generates a bitmask (uint8, uint16, or uint32) instead of a simple overlap count. Each bit corresponds to a specific file index in the group.
-   **Binary API Response**: The `/wfss/emission_mask/{group_id}` endpoint now returns raw binary data with new headers describing the format and frame count.
-   **Enhanced Region Analysis**: The `/wfss/emission_mask_regions/{group_id}` endpoint has been updated to correctly interpret bitmasks. A new field `max_overlap` is added to finding the region with the highest density of overlapping spectra.
-   **CORS Updates**: New headers `x-mask-format` and `x-mask-frames` are exposed to the frontend.

## 2. Source Code

### `app/dependencies.py`

#### `get_emission_mask_result`
Generates the bitmask based on the number of frames.

```python
def get_emission_mask_result(
    request: Request,
    group_boxes: groupBoxDep,
    group_id: int,
) -> dict:
    """Get emission mask from cache or compute on-demand if not cached."""
    if group_id not in group_boxes:
        raise HTTPException(status_code=404, detail=f"Group ID {group_id} is invalid.")

    emission_mask_cache = request.app.state.emission_mask_cache
    if group_id in emission_mask_cache:
        return emission_mask_cache[group_id]

    # Not cached - compute on demand
    from jwstnoobfriend.extraction import NoobCutout
    from jwstnoobfriend.extraction.detector import (
        create_emission_mask,
        filter_dilated_mask,
        subtract_continuum,
    )
    import numpy as np

    settings = request.app.state.settings
    grism_stage = settings.grism_products_stage
    group_box = group_boxes[group_id]

    ref_info = group_box[0]
    ref_cover = ref_info[grism_stage]

    ref_cutout = NoobCutout(
        target_wcs=ref_cover.wcs,
        x_bounds=(-100, ref_cover.data.shape[1] + 100),
        y_bounds=(-100, ref_cover.data.shape[0] + 100),
    )

    x_size = ref_cutout.x_bounds[1] - ref_cutout.x_bounds[0]
    y_size = ref_cutout.y_bounds[1] - ref_cutout.y_bounds[0]

    # Determine dtype based on number of frames
    num_frames = len(group_box)
    if num_frames <= 8:
        dtype = np.uint8
        dtype_str = "uint8"
    elif num_frames <= 16:
        dtype = np.uint16
        dtype_str = "uint16"
    elif num_frames <= 32:
        dtype = np.uint32
        dtype_str = "uint32"
    else:
        # Fallback for > 32 frames (limit to uint32 currently)
        dtype = np.uint32
        dtype_str = "uint32"

    mask_array = np.zeros((y_size, x_size), dtype=dtype)

    for i, grism_info in enumerate(group_box.info_list):
        if i >= 32:
            break  # Limit to 32 frames for bitmask safety

        cover = grism_info[grism_stage]
        emission_only, _ = subtract_continuum(
            cover.data, lam=1.0e4, p=0.05, pupil="GRISMR"
        )
        emission_mask = create_emission_mask(emission_only)
        mask_reprojected = ref_cutout.get_cutout(
            emission_mask, wcs=cover.wcs, extract_type="GRISM"
        )
        final_mask = filter_dilated_mask(np.nan_to_num(mask_reprojected, nan=0.0))
        
        # Add bit for this frame
        bit_val = dtype(1 << i)
        mask_array |= (final_mask > 0).astype(dtype) * bit_val

    result = {
        "mask": mask_array,
        "x_start": ref_cutout.x_bounds[0],
        "x_end": ref_cutout.x_bounds[1],
        "y_start": ref_cutout.y_bounds[0],
        "y_end": ref_cutout.y_bounds[1],
        "num_frames": num_frames,
        "dtype_str": dtype_str,
    }
    emission_mask_cache[group_id] = result
    return result
```

### `app/routers/wfss.py`

#### `emission_mask`
Returns the binary data with metadata headers.

```python
@router.get(
    "/emission_mask/{group_id}",
    responses=ArrayBufferResponses.build(
        description="Get the emission mask data as a binary array buffer."
    ),
)
async def emission_mask(
    group_id: int,
    request: Request,
    mask_result: emissionMaskDep,
    background_tasks: BackgroundTasks,
):
    mask_data = mask_result["mask"]
    mask_bytes = mask_data.tobytes()

    # Schedule background preloading for next group_ids
    preloader = request.app.state.preloader
    background_tasks.add_task(preloader.schedule_preload, group_id)

    headers = {
        "x-data-x-start": str(mask_result["x_start"]),
        "x-data-x-end": str(mask_result["x_end"]),
        "x-data-y-start": str(mask_result["y_start"]),
        "x-data-y-end": str(mask_result["y_end"]),
        "x-mask-format": mask_result["dtype_str"],
        "x-mask-frames": str(mask_result["num_frames"]),
    }
    return Response(
        content=mask_bytes, media_type="application/octet-stream", headers=headers
    )
```

#### `emission_mask_regions`
Calculates regions and their max overlap (population count).

```python
@router.get(
    "/emission_mask_regions/{group_id}",
    response_model=EmissionMaskRegionsResponse,
)
async def emission_mask_regions(
    group_id: int,
    mask_result: emissionMaskDep,
):
    """
    Analyze the emission mask and return regions with value > 0.
    For each connected region, returns the center and max value.
    """
    from scipy import ndimage

    mask_data = mask_result["mask"]
    x_start = mask_result["x_start"]
    y_start = mask_result["y_start"]

    # Create binary mask for connected component labeling
    binary_mask = mask_data > 0

    # Label connected regions
    labeled_array, num_features = ndimage.label(binary_mask)

    regions = []
    for region_id in range(1, num_features + 1):
        # Get mask for this region
        region_mask = labeled_array == region_id

        # Find value with max overlaps (population count) in this region
        region_values = mask_data[region_mask]
        
        # Find peak value by bit count
        unique_vals = np.unique(region_values)
        max_val = 0
        max_overlap = 0
        
        for val in unique_vals:
            if val == 0:
                continue
            # Python 3.10+ integer bit_count
            pop = int(val).bit_count()
            if pop > max_overlap:
                max_overlap = pop
                max_val = val
            elif pop == max_overlap:
                # Tie-break with higher integer value
                if val > max_val:
                    max_val = val

        # Find pixels with the best value (max overlap) in this region
        val_mask = (mask_data == max_val) & region_mask
        
        # Fallback safety
        if max_val == 0:
             max_val = int(np.max(region_values))
             max_overlap = int(max_val).bit_count()
             val_mask = (mask_data == max_val) & region_mask

        # Get coordinates of max value pixels and compute their center
        coords = np.where(val_mask)
        if len(coords[0]) > 0:
            center_y = float(np.mean(coords[0])) + y_start
            center_x = float(np.mean(coords[1])) + x_start
        else:
            # Fallback to region center if something went wrong
            coords = np.where(region_mask)
            center_y = float(np.mean(coords[0])) + y_start
            center_x = float(np.mean(coords[1])) + x_start

        # Get area of the region
        area = int(np.sum(region_mask))

        regions.append(
            {
                "center_x": center_x,
                "center_y": center_y,
                "max_value": int(max_val),
                "max_overlap": max_overlap,
                "area": area,
            }
        )

    # Sort by max_overlap descending, then area
    regions.sort(key=lambda r: (r["max_overlap"], r["area"]), reverse=True)

    return {
        "group_id": group_id,
        "regions": regions,
    }
```

### `app/schemas.py`

#### `EmissionMaskRegionItem`
Added `max_overlap`.

```python
class EmissionMaskRegionItem(BaseModel):
    center_x: float = Field(..., description="The x-coordinate of the region center.")
    center_y: float = Field(..., description="The y-coordinate of the region center.")
    max_value: int = Field(..., description="The maximum value in this region.")
    max_overlap: int = Field(
        ..., description="The maximum number of overlapping frames in this region."
    )
    area: int = Field(..., description="The area (pixel count) of this region.")
```

### `app/main.py`

#### CORS Configuration
Exposed new headers.

```python
    expose_headers=[
        "x-data-width",
        "x-data-height",
        "x-data-dtype",
        "x-data-x-start",
        "x-data-y-start",
        "x-data-x-end",
        "x-data-y-end",
        "x-mask-format",
        "x-mask-frames",
    ],  # expose custom headers
```
