import { v4 } from 'uuid';
import type { CollectionBeforeOperationHook } from 'payload';

export const getUniqueFilename: CollectionBeforeOperationHook = ({
  req,
  operation
}) => {
  if ((operation === 'create' || operation === 'update') && req.file) {
    req.file.name = v4();
  }
};
