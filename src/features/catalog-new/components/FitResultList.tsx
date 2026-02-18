import {
  Badge,
  Box,
  Card,
  Flex,
  IconButton,
  Carousel,
  Stack,
  Text,
  useSlotRecipe,
} from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { LuActivity, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { FitResultSummary } from "@/hooks/query/catalog";
import { catalogDetailRecipe } from "../recipes/catalog-detail.recipe";
import { useConnectionStore } from "@/stores/connection";

interface FitResultListProps {
  fitHistory: FitResultSummary[];
  selectedFitJobId: string | null;
  onSelect: (jobId: string) => void;
}

export function FitResultList({
  fitHistory,
  selectedFitJobId,
  onSelect,
}: FitResultListProps) {
  const recipe = useSlotRecipe({ recipe: catalogDetailRecipe });
  const styles = recipe({});
  const backendUrl = useConnectionStore((state) => state.backendUrl);

  if (fitHistory.length === 0) {
    return (
      <Box p={4} color="fg.muted" textAlign="center" css={styles.content}>
        No fit history available.
      </Box>
    );
  }

  return (
    <Box css={styles.content} w="full">
      <Carousel.Root
        slideCount={fitHistory.length}
        slidesPerPage={1}
        spacing="4"
        w="full"
      >
        <Carousel.Control mb={2}>
            <Carousel.PrevTrigger asChild>
            <IconButton size="xs" variant="ghost" aria-label="Previous slide">
                <LuChevronLeft />
            </IconButton>
            </Carousel.PrevTrigger>
            <Carousel.IndicatorGroup>
            {fitHistory.map((_, index) => (
                <Carousel.Indicator key={index} index={index} />
            ))}
            </Carousel.IndicatorGroup>
            <Carousel.NextTrigger asChild>
            <IconButton size="xs" variant="ghost" aria-label="Next slide">
                <LuChevronRight />
            </IconButton>
            </Carousel.NextTrigger>
        </Carousel.Control>

        <Carousel.ItemGroup>
          {fitHistory.map((job, index) => {
            const isSelected = job.job_id === selectedFitJobId;
            return (
              <Carousel.Item key={job.job_id} index={index} px={1}>
                <Card.Root
                  size="sm"
                  variant={isSelected ? "subtle" : "outline"}
                  cursor="pointer"
                  onClick={() => onSelect(job.job_id)}
                  borderColor={isSelected ? "cyan.500" : undefined}
                  borderWidth={isSelected ? "2px" : "1px"}
                  _hover={{ borderColor: "cyan.400" }}
                  w="full"
                >
                  <Card.Body py={3} px={4}>
                    <Flex justify="space-between" align="start" mb={2}>
                      <Stack gap={0}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {job.best_model_name || "Unknown Model"}
                        </Text>
                        <Text fontSize="xs" color="fg.muted" fontFamily="mono">
                          {new Date(job.created_at).toLocaleString()}
                        </Text>
                      </Stack>
                      <Badge colorPalette="cyan" variant="solid" size="sm">
                        {job.job_id.slice(0, 8)}
                      </Badge>
                    </Flex>

                    {Object.keys(job.trace_url_dict).length > 0 && (
                      <Flex gap={2} mt={2} wrap="wrap">
                        {Object.entries(job.trace_url_dict).map(([key, url]) => {
                          const fullUrl = `${backendUrl}${url}`;
                          return (
                            <IconButton
                              key={key}
                              size="xs"
                              variant="ghost"
                              aria-label={`Download trace ${key}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement("a");
                                link.href = fullUrl;
                                link.download = url.split("/").pop() || key;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <LuActivity />
                              <Text as="span" ml={1}>
                                {key}
                              </Text>
                              <FiExternalLink />
                            </IconButton>
                          );
                        })}
                      </Flex>
                    )}
                  </Card.Body>
                </Card.Root>
              </Carousel.Item>
            );
          })}
        </Carousel.ItemGroup>
      </Carousel.Root>
    </Box>
  );
}
