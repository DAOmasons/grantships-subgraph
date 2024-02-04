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

import { Project, ShipProfile, ProfileMemberGroup } from '../generated/schema';
import { ProjectMetadata, ShipProfileMetadata } from '../generated/templates';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { addTransaction } from './utils/addTransaction';

export function handleRoleRevokedEvent(event: RoleRevokedEvent): void {
  let entityId = event.params.role;
  let memberGroup = ProfileMemberGroup.load(entityId);

  if (memberGroup == null) {
    return;
  }

  let tempAddresses = memberGroup.addresses;
  if (tempAddresses == null) {
    return;
  }

  let index = tempAddresses.indexOf(event.params.account);
  if (index > -1) {
    tempAddresses.splice(index, 1); // If found, remove it
  }

  memberGroup.addresses = tempAddresses;
  memberGroup.save();
  // addTransaction(event.block, event.transaction);
}

export function handleRoleGrantedEvent(event: RoleGrantedEvent): void {
  let entityId = event.params.role;
  let memberGroup = ProfileMemberGroup.load(entityId);
  if (memberGroup == null) {
    memberGroup = new ProfileMemberGroup(entityId);
    memberGroup.addresses = [];
  }
  // Use a temporary array to handle potential null values
  let tempAddresses = memberGroup.addresses;
  if (tempAddresses == null) {
    tempAddresses = [];
  }
  tempAddresses.push(event.params.account);
  memberGroup.addresses = tempAddresses;
  memberGroup.save();

  // Don't need to add transaction here, as it's already added in the handleProfileCreatedEvent
}

export function handleProfileCreatedEvent(event: ProfileCreatedEvent): void {
  let entityId = event.params.profileId;

  if (event.params.metadata.protocol == BigInt.fromString('103115010001003')) {
    let project = Project.load(entityId);

    if (project == null) {
      project = new Project(entityId);
    }

    let memberGroup = ProfileMemberGroup.load(entityId);
    if (memberGroup == null) {
      memberGroup = new ProfileMemberGroup(entityId);
      memberGroup.addresses = [];
      memberGroup.save();
    }

    project.members = entityId;

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

    //TODO: Check if this duplicates metadata
    ProjectMetadata.create(event.params.metadata.pointer);

    project.save();
    addTransaction(event.block, event.transaction);
  } else if (
    event.params.metadata.protocol == BigInt.fromString('103115010001002')
  ) {
    let shipProfile = ShipProfile.load(entityId);

    if (shipProfile == null) {
      shipProfile = new ShipProfile(entityId);
    }

    let memberGroup = ProfileMemberGroup.load(entityId);
    if (memberGroup == null) {
      memberGroup = new ProfileMemberGroup(entityId);
      memberGroup.addresses = [];
      memberGroup.save();
    }

    shipProfile.alloProfileMembers = entityId;

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
    addTransaction(event.block, event.transaction);
  }
}

// Check duplicate metadatas?
// add alloProfileMembers to shipProfile
// find roleRevoked event in the registry contract

// update the ships
// theres enough sample data to populate a feed - how do we want to model the feed schema
// Add the member entities

//find role revoked in those contracts
