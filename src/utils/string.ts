import { Address, Bytes } from '@graphprotocol/graph-ts';

function splitString(str: string, delimiter: string): string[] {
  let parts: string[] = [];
  let currentIndex: i32 = 0;
  let nextIndex: i32 = str.indexOf(delimiter, currentIndex);

  while (nextIndex != -1) {
    parts.push(str.substring(currentIndex, nextIndex));
    currentIndex = nextIndex + 1; // Skip the delimiter
    nextIndex = str.indexOf(delimiter, currentIndex);
  }

  // Add the last part after the final delimiter if it's not at the end of the string
  if (currentIndex < str.length) {
    parts.push(str.substring(currentIndex));
  }

  return parts;
}

class GrantID {
  shipId: Bytes;
  projectId: Bytes;
}

export function createGrantId(params: GrantID): string {
  let projectId = params.projectId;
  let shipId = params.shipId;
  return `${projectId.toHex()}-${shipId.toHex()}`;
}
