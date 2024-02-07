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

import { Project, GrantShip, ProfileMemberGroup } from '../generated/schema';
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
  // Don't need to use addTransaction here, as we are not handling this event on app.
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

  // Don't need to use addTransaction here, as it's already added in the handleProfileCreatedEvent
}

export function handleProfileCreatedEvent(event: ProfileCreatedEvent): void {
  if (event.params.metadata.protocol == BigInt.fromString('103115010001003')) {
    let entityId = event.params.profileId;
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
    event.params.metadata.protocol == BigInt.fromString('103115010001004')
  ) {
    let entityId = event.params.anchor;
    let grantShip = GrantShip.load(entityId);

    if (grantShip == null) {
      grantShip = new GrantShip(entityId);
    }

    let memberGroup = ProfileMemberGroup.load(event.params.profileId);
    if (memberGroup == null) {
      memberGroup = new ProfileMemberGroup(event.params.profileId);
      memberGroup.addresses = [];
      memberGroup.save();
    }

    grantShip.alloProfileMembers = event.params.profileId;

    grantShip.profileId = event.params.profileId;
    grantShip.nonce = event.params.nonce;
    grantShip.name = event.params.name;
    grantShip.metadata_protocol = event.params.metadata.protocol;
    grantShip.metadata_pointer = event.params.metadata.pointer;
    grantShip.metadata = event.params.metadata.pointer;
    grantShip.owner = event.params.owner;
    grantShip.anchor = event.params.anchor;

    grantShip.blockNumber = event.block.number;
    grantShip.blockTimestamp = event.block.timestamp;
    grantShip.transactionHash = event.transaction.hash;

    ShipProfileMetadata.create(event.params.metadata.pointer);

    grantShip.save();
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
