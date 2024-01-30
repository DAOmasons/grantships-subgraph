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
} from "../generated/Registry/Registry";
import { Project, ShipProfile } from "../generated/schema";
import { ProjectMetadata, ShipProfileMetadata } from "../generated/templates";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleProfileCreated(event: ProfileCreatedEvent): void {
  if (event.params.metadata.protocol == BigInt.fromString("103115010001000")) {
    let project = new Project(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );

    project.profileId = event.params.profileId;
    project.nonce = event.params.nonce;
    project.name = event.params.name;
    project.metadata_protocol = event.params.metadata.protocol;
    project.metadata_pointer = event.params.metadata.pointer;
    project.metadata = event.params.metadata.pointer;
    project.owner = event.params.owner;
    project.anchor = event.params.anchor;

    project.blockNumber = event.block.number;
    project.blockTimestamp = event.block.timestamp;
    project.transactionHash = event.transaction.hash;

    ProjectMetadata.create(event.params.metadata.pointer);

    project.save();
  } else if (
    event.params.metadata.protocol == BigInt.fromString("103115010001002")
  ) {
    let shipProfile = new ShipProfile(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    shipProfile.profileId = event.params.profileId;
    shipProfile.nonce = event.params.nonce;
    shipProfile.name = event.params.name;
    shipProfile.metadata_protocol = event.params.metadata.protocol;
    shipProfile.metadata_pointer = event.params.metadata.pointer;
    shipProfile.metadata = event.params.metadata.pointer;
    shipProfile.owner = event.params.owner;
    shipProfile.anchor = event.params.anchor;

    shipProfile.blockNumber = event.block.number;
    shipProfile.blockTimestamp = event.block.timestamp;
    shipProfile.transactionHash = event.transaction.hash;

    ShipProfileMetadata.create(event.params.metadata.pointer);

    shipProfile.save();
  }
}
