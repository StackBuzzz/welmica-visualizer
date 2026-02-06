import { Heading, Table, Text } from '@radix-ui/themes';
import type { Collection, Series } from '@/payload-types';
import type { FunctionComponent } from 'react';

interface DetailsProps {
  label: string;
  dimension?: string | null;
  series: Series;
  collection: Collection;
  specifications?: { key: string; value: string; id?: string | null }[] | null;
}

const Details: FunctionComponent<DetailsProps> = ({
  label,
  dimension,
  series,
  collection,
  specifications
}) => {
  return (
    <div>
      <Heading
        size='4'
        weight='bold'
        mb='4'
        style={{
          color: 'var(--gray-12)',
          letterSpacing: '-0.02em'
        }}
      >
        Specifications
      </Heading>
      <Table.Root variant='surface' size='2'>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>
              <Text size='2' weight='light'>
                Design Code
              </Text>
            </Table.RowHeaderCell>
            <Table.Cell>
              <Text size='2' weight='medium'>
                {label}
              </Text>
            </Table.Cell>
          </Table.Row>
          {dimension && (
            <Table.Row>
              <Table.RowHeaderCell>
                <Text size='2' weight='light'>
                  Size
                </Text>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Text size='2' weight='medium'>
                  {dimension}
                </Text>
              </Table.Cell>
            </Table.Row>
          )}
          <Table.Row>
            <Table.RowHeaderCell>
              <Text size='2' weight='light'>
                Series
              </Text>
            </Table.RowHeaderCell>
            <Table.Cell>
              <Text size='2' weight='medium'>
                {series.name}
              </Text>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>
              <Text size='2' weight='light'>
                Collection
              </Text>
            </Table.RowHeaderCell>
            <Table.Cell>
              <Text size='2' weight='medium'>
                {collection.name}
              </Text>
            </Table.Cell>
          </Table.Row>
          {specifications?.map(({ key, value }, index) => (
            <Table.Row key={index}>
              <Table.RowHeaderCell>
                <Text size='2' weight='light'>
                  {key}
                </Text>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Text size='2' weight='medium'>
                  {value}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default Details;
