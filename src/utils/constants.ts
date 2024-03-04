import { Bytes } from '@graphprotocol/graph-ts';

export const GAME_MANAGER_ADDRESS = Bytes.fromHexString(
  '0x06E068784e4fbc89fea8b30198A918E9adfbD5FF'
) as Bytes;

// export const GAME_MANAGER_POOL_ID = BigInt.fromI32(224);

export enum GameStatus {
  None = 0,
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Allocated = 4,
  Funded = 5,
  Active = 6,
  Completed = 7,
}

export enum AlloStatus {
  None = 0,
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Appealed = 4,
  InReview = 5,
  Canceled = 6,
}

export enum GrantStatus {
  None,
  Applied,
  ShipRejected,
  ShipApproved,
  FacilitatorRejected,
  FacilitatorApproved,
  MilestonesProposed,
  MilestonesRejected,
  MilestonesApproved,
  MilestoneSubmitted,
  MilestoneRejected,
  MilestoneApproved,
  Completed,
}
