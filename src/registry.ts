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
import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { addTransaction } from './utils/addTransaction';
import { createRawMetadata } from './utils/rawMetadata';
import { AlloStatus, GameStatus } from './utils/constants';
import { addFeedItem } from './utils/feed';

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
    let entityId = event.params.anchor;
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
    project.metadata = createRawMetadata(
      event.params.metadata.protocol,
      event.params.metadata.pointer
    );
    project.status = AlloStatus.None;
    project.owner = event.params.owner;
    project.anchor = event.params.anchor;

    project.blockNumber = event.block.number;
    project.blockTimestamp = event.block.timestamp;
    project.transactionHash = event.transaction.hash;

    // Graph IPFS file-data-source API isn't ready for prime-time
    // ProjectMetadata.create(event.params.metadata.pointer);

    project.save();

    addTransaction(event.block, event.transaction);

    addFeedItem({
      timestamp: event.block.timestamp,
      tx: event.transaction,
      content: `Project ${project.name} has created a Grant Ships profile`,
      subjectMetadataPointer: event.params.metadata.pointer,
      subject: {
        id: project.id.toHexString(),
        type: 'project',
        name: project.name,
      },
      object: null,
      embed: {
        key: 'description',
        pointer: event.params.metadata.pointer,
        protocol: event.params.metadata.protocol,
        content: null,
      },
      details: null,
      tag: 'project-profile-created',
      postIndex: 0,
    });
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
    grantShip.profileMetadata = createRawMetadata(
      event.params.metadata.protocol,
      event.params.metadata.pointer
    );
    grantShip.owner = event.params.owner;
    grantShip.anchor = event.params.anchor;
    grantShip.status = 0;

    grantShip.blockNumber = event.block.number;
    grantShip.blockTimestamp = event.block.timestamp;
    grantShip.transactionHash = event.transaction.hash;
    grantShip.poolFunded = false;
    grantShip.balance = BigInt.fromI32(0);

    // Graph IPFS file-data-source API isn't ready for prime-time
    // ShipProfileMetadata.create(event.params.metadata.pointer);

    grantShip.save();

    addTransaction(event.block, event.transaction);

    addFeedItem({
      tx: event.transaction,
      timestamp: event.block.timestamp,
      content: `Grant Ship ${grantShip.name} has created a Grant Ships profile`,
      subjectMetadataPointer: event.params.metadata.pointer,
      subject: {
        id: grantShip.id.toHexString(),
        type: 'ship',
        name: grantShip.name,
      },
      object: null,
      embed: {
        pointer: event.params.metadata.pointer,
        key: 'mission',
        protocol: event.params.metadata.protocol,
        content: null,
      },
      details: null,
      tag: 'ship-profile-created',
      postIndex: 0,
    });
  }
}

// Check duplicate metadatas?
// add alloProfileMembers to shipProfile
// find roleRevoked event in the registry contract

// update the ships
// theres enough sample data to populate a feed - how do we want to model the feed schema
// Add the member entities

//find role revoked in those contracts
