'use client';

import {
  FieldLabel,
  FieldError,
  FieldDescription,
  useField
} from '@payloadcms/ui';
import { Badge, Box, Flex, Slider, Button } from '@radix-ui/themes';
import isNumber from 'lodash/isNumber';
import { AiOutlineClose } from 'react-icons/ai';
import type { RangeConfigs } from './types';
import type { NumberFieldClientProps } from 'payload';
import type { FunctionComponent } from 'react';

type RangeFieldProps = NumberFieldClientProps & {
  configs: RangeConfigs;
};

const RangeField: FunctionComponent<RangeFieldProps> = (props) => {
  const { configs, field, path } = props;

  const { value, setValue, showError, errorMessage, readOnly } =
    useField<number>({
      path
    });

  const isReadOnly = !!(readOnly || field.admin?.readOnly || props.readOnly);

  return (
    <Box flexGrow='1' mb='var(--spacing-field)'>
      <FieldLabel
        label={field.label}
        required={field.required}
        path={path}
        as='label'
      />
      <Flex
        direction='row'
        gap='3'
        width='100%'
        justify='between'
        align='center'
        position='relative'
      >
        <Badge size='3' color='gray'>
          {isNumber(value) ? `${value}${configs.valueSuffix || ''}` : 'N/A'}
        </Badge>
        <Slider
          size='2'
          variant='soft'
          highContrast
          radius='small'
          color='gray'
          disabled={isReadOnly}
          min={configs.min}
          max={configs.max}
          step={configs.step}
          value={[value]}
          onValueChange={([newVal]) => setValue(newVal)}
        />
        <Button
          onClick={() => setValue(null)}
          color='gray'
          size='2'
          disabled={isReadOnly || value === null}
          type='button'
          variant='soft'
        >
          Unset
          <AiOutlineClose />
        </Button>
        <FieldError showError={showError} message={errorMessage} path={path} />
      </Flex>

      <FieldDescription description={field.admin?.description} path={path} />
    </Box>
  );
};

export default RangeField;
