import { BigInt } from '@graphprotocol/graph-ts';
import { RawMetadata } from '../../generated/schema';

export const createRawMetadata = (
  protocol: BigInt,
  pointer: string
): string => {
  let rawMetadata = new RawMetadata(pointer);

  rawMetadata.protocol = protocol;
  rawMetadata.pointer = pointer;

  rawMetadata.save();

  return pointer;
};
