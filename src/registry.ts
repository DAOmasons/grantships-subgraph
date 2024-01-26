import {
  Initialized as InitializedEvent,
  ProfileCreated as ProfileCreatedEvent,
  ProfileMetadataUpdated as ProfileMetadataUpdatedEvent,
  ProfileNameUpdated as ProfileNameUpdatedEvent,
  ProfileOwnerUpdated as ProfileOwnerUpdatedEvent,
  ProfilePendingOwnerUpdated as ProfilePendingOwnerUpdatedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
} from '../generated/Registry/Registry';
import { Project } from '../generated/schema';
import { ProjectMetadata } from '../generated/templates';
import { BigInt, log } from '@graphprotocol/graph-ts';

export function handleProfileCreated(event: ProfileCreatedEvent): void {
  if (event.params.metadata.protocol == BigInt.fromString('103115010001001')) {
    let entity = new Project(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );

    entity.profileId = event.params.profileId;
    entity.nonce = event.params.nonce;
    entity.name = event.params.name;
    entity.metadata_protocol = event.params.metadata.protocol;
    entity.metadata_pointer = event.params.metadata.pointer;
    entity.metadata = event.params.metadata.pointer;
    entity.owner = event.params.owner;
    entity.anchor = event.params.anchor;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    ProjectMetadata.create(event.params.metadata.pointer);

    entity.save();
  }
}
