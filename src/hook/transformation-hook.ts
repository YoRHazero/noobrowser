import { useGrismStore } from "@/stores/image";
import { useFitStore } from "@/stores/fit";
import { useShallow } from "zustand/react/shallow";
import { displayFactor, toDisplayWavelength, formatWavelength } from "@/utils/wavelength";


export function useWavelengthDisplay() {
    const { waveUnit, zRedshift } = useGrismStore(
        useShallow((state) => ({
            waveUnit: state.waveUnit,
            zRedshift: state.zRedshift,
        }))
    );
    const { waveFrame } = useFitStore(
        useShallow((state) => ({
            waveFrame: state.waveFrame,
        }))
    );
    
    const factor = displayFactor(waveUnit, waveFrame, zRedshift);
    const converter = (valueObsUm: number) => {
        return toDisplayWavelength(valueObsUm, waveUnit, waveFrame, zRedshift);
    };
    const formatterWithUnit = (valueObsUm: number) => {
        return formatWavelength(valueObsUm, waveUnit, waveFrame, zRedshift);
    };
    const formatter = (valueObsUm: number) => {
        const valueDisplay = toDisplayWavelength(valueObsUm, waveUnit, waveFrame, zRedshift);
        const digits = waveUnit === "µm" ? 4 : 0;
        return valueDisplay.toFixed(digits);
    };
    const label = `λ_${waveFrame==="observe"?"obs":"rest"} (${waveUnit})`;
    return {
        waveUnit,
        waveFrame,
        factor,
        converter,
        formatter,
        formatterWithUnit,
        label
    }
}