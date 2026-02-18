import { useFitResultDetail } from "@/hooks/query/catalog/useFitResultDetail";
import {
  Box,
  Heading,
  Spinner,
  Table,
  Text,
  Badge,
  Stack,
  Card,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useMemo } from "react";

interface SummaryTabProps {
  jobId: string;
  modelName: string;
}

export function SummaryTab({ jobId, modelName }: SummaryTabProps) {
  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const { data, isLoading } = useFitResultDetail(jobId, !!jobId);

  /* -------------------------------------------------------------------------- */
  /*                               Derived Values                               */
  /* -------------------------------------------------------------------------- */
  const modelResult = useMemo(() => {
    return data?.model_results?.find((r) => r.model_name === modelName);
  }, [data, modelName]);

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (!modelResult) {
    return <Text color="fg.muted">No summary available for this model.</Text>;
  }

  return (
    <Box w="full" h="full" p={4} overflowY="auto">
      <Stack gap={6}>
        {/* Model Overview */}
        <Card.Root size="sm" variant="subtle">
          <Card.Header>
            <Heading size="sm">Model Overview</Heading>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text color="fg.muted" fontSize="sm">
                  Model Name
                </Text>
                <Text fontWeight="medium">{modelResult.model_name}</Text>
              </GridItem>
              <GridItem>
                <Text color="fg.muted" fontSize="sm">
                  Status
                </Text>
                {modelResult.is_best ? (
                  <Badge colorPalette="green">Best Model</Badge>
                ) : (
                  <Badge colorPalette="gray">Alternative</Badge>
                )}
              </GridItem>
              <GridItem>
                <Text color="fg.muted" fontSize="sm">
                  WAIC
                </Text>
                <Text>
                  {modelResult.waic?.toFixed(2) ?? "N/A"}{" "}
                  {modelResult.waic_se && (
                    <Text as="span" color="fg.muted" fontSize="sm">
                      ± {modelResult.waic_se.toFixed(2)}
                    </Text>
                  )}
                </Text>
              </GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Components Table */}
        <Box>
            <Heading size="sm" mb={3}>
              Model Components
            </Heading>
          <Table.Root size="sm" variant="outline" striped>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Component</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Amplitude</Table.ColumnHeader>
                <Table.ColumnHeader>FWHM (km/s)</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {modelResult.components.map((comp, idx) => (
                <Table.Row key={`${comp.component_name}-${idx}`}>
                  <Table.Cell fontWeight="medium">
                    {comp.physical_name || comp.component_name}
                  </Table.Cell>
                  <Table.Cell>{comp.component_type}</Table.Cell>
                  <Table.Cell>
                    {comp.amplitude !== null ? (
                      <>
                        {comp.amplitude.toExponential(2)}
                        {comp.amplitude_error !== null && (
                          <Text as="span" color="fg.muted">
                            {" "}
                            ± {comp.amplitude_error.toExponential(2)}
                          </Text>
                        )}
                      </>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {comp.fwhm_kms !== null ? (
                      <>
                        {comp.fwhm_kms.toFixed(2)}
                        {comp.fwhm_kms_error !== null && (
                          <Text as="span" color="fg.muted">
                            {" "}
                            ± {comp.fwhm_kms_error.toFixed(2)}
                          </Text>
                        )}
                      </>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    </Box>
  );
}
