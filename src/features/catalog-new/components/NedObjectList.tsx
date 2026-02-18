import {
  Box,
  Heading,
  HStack,
  Link,
  Stack,
  Table,
  Text,
  Spinner,
  NumberInput,
} from "@chakra-ui/react";
import { useNedSearch } from "@/hooks/query/source/useNedSearch";
import { useState } from "react";
import { ExternalLinkIcon } from "lucide-react";

interface NedObjectListProps {
  ra: number;
  dec: number;
}

export function NedObjectList({ ra, dec }: NedObjectListProps) {
  const [radius, setRadius] = useState(2); // default 2 arcsec
  const { data, isLoading, isError, error } = useNedSearch({
    ra,
    dec,
    radius,
    enabled: true,
  });

  return (
    <Stack gap={2}>
      <HStack align="center" gap={2}>
        <Heading size="sm">NED Objects</Heading>
        <HStack gap={1}>
          <Text fontSize="xs" color="fg.muted">Radius ("):</Text>
          <NumberInput.Root
            size="xs"
            maxW="80px"
            value={radius.toString()}
            onValueChange={(details) => setRadius(details.valueAsNumber)}
            min={0.1}
            max={60}
            step={0.5}
          >
            <NumberInput.Input />
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
          </NumberInput.Root>
        </HStack>
      </HStack>

      {isLoading ? (
        <Box textAlign="center" py={2}>
          <Spinner size="sm" />
        </Box>
      ) : isError ? (
        <Box color="red.500" fontSize="sm">
          Error: {(error as Error).message}
        </Box>
      ) : data && data.length > 0 ? (
        <Table.Root size="sm" variant="outline">
           <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>z</Table.ColumnHeader>
              <Table.ColumnHeader>Link</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((obj, idx) => (
              <Table.Row key={`${obj.object_name}-${idx}`}>
                <Table.Cell>{obj.object_name}</Table.Cell>
                <Table.Cell>{obj.redshift?.toFixed(4) ?? "-"}</Table.Cell>
                <Table.Cell>
                  {obj.url && (
                    <Link href={obj.url} target="_blank" colorPalette="blue">
                      NED <Box as="span" display="inline-block" ml={1}><ExternalLinkIcon size="1em" /></Box>
                    </Link>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <Box color="fg.muted" fontSize="sm" fontStyle="italic">
          No objects found within {radius}".
        </Box>
      )}
    </Stack>
  );
}
