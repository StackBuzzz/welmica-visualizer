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

interface SpecRowProps {
  label: string;
  value: string;
}

const SpecRow: FunctionComponent<SpecRowProps> = ({ label, value }) => (
  <Table.Row>
    <Table.RowHeaderCell>
      <Text size='2' weight='light'>
        {label}
      </Text>
    </Table.RowHeaderCell>
    <Table.Cell>
      <Text size='2' weight='medium'>
        {value}
      </Text>
    </Table.Cell>
  </Table.Row>
);

const Details: FunctionComponent<DetailsProps> = ({
  label,
  dimension,
  series,
  collection,
  specifications
}) => (
  <div>
    <Heading size='4' weight='medium' mb='4'>
      Specifications
    </Heading>
    <Table.Root variant='surface' size='2'>
      <Table.Body>
        <SpecRow label='Design Code' value={label} />
        {dimension && <SpecRow label='Size' value={dimension} />}
        <SpecRow label='Series' value={series.name} />
        <SpecRow label='Collection' value={collection.name} />
        {specifications?.map(({ key, value }, index) => (
          <SpecRow key={index} label={key} value={value} />
        ))}
      </Table.Body>
    </Table.Root>
  </div>
);

export default Details;
