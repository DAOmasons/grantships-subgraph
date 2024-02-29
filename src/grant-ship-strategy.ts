import { BigInt, dataSource } from '@graphprotocol/graph-ts';
import { Initialized as InitializedEvent } from '../generated/templates/GrantShipStrategyContract/GrantShipStrategy';
import {
  Grant,
  GrantShip,
  Log,
  Project,
  RawMetadata,
} from '../generated/schema';
import {
  PoolFunded as PoolFundedEvent,
  RecipientStatusChanged as RecipientStatusChangedEvent,
  MilestoneSubmitted as MilestoneSubmittedEvent,
  MilestoneStatusChanged as MilestoneStatusChangedEvent,
  MilestoneRejected as MilestoneRejectedEvent,
  MilestonesSet as MilestonesSetEvent,
  FlagIssued as FlagIssuedEvent,
  FlagResolved as FlagResolvedEvent,
  MilestonesReviewed as MilestonesReviewedEvent,
  PoolWithdraw as PoolWithdrawEvent,
  UpdatePosted as UpdatePostedEvent,
  Registered as RegisteredEvent,
  Allocated as AllocatedEvent,
  Distributed as DistributedEvent,
  GrantShipInitialized as GrantShipInitializedEvent,
} from '../generated/templates/GrantShipStrategyContract/GrantShipStrategy';
import { AlloStatus, GrantStatus } from './utils/constants';
import { addTransaction } from './utils/addTransaction';
import { addFeedItem, inWeiMarker } from './utils/feed';
import { createGrantId } from './utils/string';

export function handleGrantShipInitializedEvent(
  event: GrantShipInitializedEvent
): void {
  let entityAddress = event.params.registryAnchor;
  let grantShip = GrantShip.load(entityAddress);

  let log = new Log('Grant Ship Initialized');
  log.message = 'Grant Ship Initialized';
  log.type = 'Info';
  log.save();

  if (grantShip === null) {
    let log = new Log('Error: Grant Ship Not Found');
    log.message = 'Grant Ship Not Found';
    log.type = 'Error';
    log.save();
    return;
  }

  grantShip.poolId = event.params.poolId;
  grantShip.hatId = event.params.operatorHatId;
  grantShip.poolActive = true;

  grantShip.save();
}

export function handlePoolFundedEvent(event: PoolFundedEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantShip = GrantShip.load(anchorAddress);

  if (grantShip == null) {
    return;
  }

  grantShip.balance = grantShip.balance.plus(event.params.amount);
  grantShip.poolFunded = true;

  grantShip.save();
}
export function handleRegisteredEvent(event: RegisteredEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantShip = GrantShip.load(anchorAddress);
  let project = Project.load(event.params.recipientId);

  if (project == null || grantShip == null) {
    return;
  }

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });
  let grant = Grant.load(grantId);

  if (grant == null) {
    grant = new Grant(grantId);
  }

  grant.projectId = project.id;
  grant.shipId = grantShip.id;
  grant.lastUpdated = event.block.timestamp;
  grant.grantApplicationBytes = event.params.data;
  grant.grantStatus = GrantStatus.Applied;
  grant.save();

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `${project.name} has submitted an application to ${grantShip.name} for a grant.`,
    subjectMetadataPointer: project.metadata,
    subject: {
      id: project.id.toHex(),
      type: 'project',
      name: project.name,
    },
    object: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    embed: null,
    details: null,
    tag: 'grant-requested',
    postIndex: 0,
  });
  addTransaction(event.block, event.transaction);
}

export function handleUpdatePostedEvent(event: UpdatePostedEvent): void {
  if (event.params.tag.startsWith('TAG:SHIP_REVIEW_GRANT')) {
    //   // `TAG:SHIP_REVIEW_GRANT:${grant.id}:${isApproved ? 'APPROVED' : 'REJECTED'}`;
    const stringItems = event.params.tag.split(':');

    if (stringItems.length != 4) {
      let log = new Log('Error: Invalid Tag');
      log.message = 'Invalid Tag';
      log.type = 'Error';
      log.save();
      return;
    }

    let grantId = stringItems[2];
    let isApproved = stringItems[3] == 'APPROVED';
    let isRejected = stringItems[3] == 'REJECTED';
    let grant = Grant.load(grantId);

    if (grant == null) {
      let log = new Log('Error: Grant Not Found');
      log.message = 'Grant Not Found';
      log.type = 'Error';
      log.save();
      return;
    }

    let project = Project.load(grant.projectId);
    let grantShip = GrantShip.load(grant.shipId);

    if (project == null || grantShip == null) {
      return;
    }

    // Graph is being a piece of garbage about this.

    // let hasPermission = grantShip.hatId === event.params.role;

    // if (!hasPermission) {
    //   let log = new Log('Error: Poster does not have permission');
    //   log.message = `grantShip.hatId: ${grantShip.hatId.toString()}, does not match event.params.role: ${event.params.role.toString()}`;
    //   log.type = 'Error';
    //   log.save();
    // }

    let metadata = new RawMetadata(event.params.content.pointer);
    metadata.protocol = event.params.content.protocol;
    metadata.pointer = event.params.content.pointer;
    metadata.save();

    if (isApproved) {
      grant.grantStatus = GrantStatus.ShipApproved;
    } else if (isRejected) {
      grant.grantStatus = GrantStatus.ShipRejected;
    }

    grant.shipApprovalReason = metadata.id;
    grant.hasShipApproved = isApproved;
    grant.lastUpdated = event.block.timestamp;
    grant.save();

    addTransaction(event.block, event.transaction);
    addFeedItem({
      timestamp: event.block.timestamp,
      tx: event.transaction,
      content: `${grantShip.name} approved ${project.name}'s Grant Application.`,
      subjectMetadataPointer: grantShip.profileMetadata,
      subject: {
        id: grantShip.id.toHex(),
        type: 'ship',
        name: grantShip.name,
      },
      object: {
        id: project.id.toHexString(),
        type: 'project',
        name: project.name,
      },
      embed: {
        key: 'reason',
        pointer: event.params.content.pointer,
        protocol: event.params.content.protocol,
        content: null,
      },
      details: null,
      tag: `grant-${isApproved ? 'approved' : 'rejected'}`,
      postIndex: 0,
    });
    return;
  }

  let log = new Log('Error: Tag not recognized');
  log.message = 'Tag not recognized';
  log.type = 'Error';
  log.save();
}

export function handleAllocatedEvent(event: AllocatedEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let grant = Grant.load(grantId);

  let project = Project.load(event.params.recipientId);
  let grantShip = GrantShip.load(anchorAddress);

  if (grant == null || project == null || grantShip == null) {
    return;
  }

  grant.amtAllocated = event.params.amount;
  grant.lastUpdated = event.block.timestamp;
  grant.allocatedBy = event.params.sender;

  grant.save();

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `${grantShip.name} allocated ${inWeiMarker(
      event.params.amount
    )} for ${project.name}`,
    subjectMetadataPointer: grantShip.profileMetadata,
    subject: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    object: {
      id: project.id.toHexString(),
      type: 'project',
      name: project.name,
    },
    embed: null,
    details: null,
    tag: `allocated`,
    postIndex: 0,
  });
}

export function handleRecipientStatusChangedEvent(
  event: RecipientStatusChangedEvent
): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let grant = Grant.load(grantId);
  let project = Project.load(event.params.recipientId);
  let grantShip = GrantShip.load(anchorAddress);
  if (grant == null || project == null || grantShip == null) {
    return;
  }
  if (
    event.params.status === AlloStatus.Accepted ||
    event.params.status === AlloStatus.Rejected
  ) {
    let metadata = new RawMetadata(event.params.reason.pointer);
    let isApproved = event.params.status === AlloStatus.Accepted;

    metadata.protocol = event.params.reason.protocol;
    metadata.pointer = event.params.reason.pointer;
    metadata.save();

    grant.grantStatus = isApproved
      ? GrantStatus.FacilitatorApproved
      : GrantStatus.FacilitatorRejected;
    grant.lastUpdated = event.block.timestamp;
    grant.facilitatorReason = metadata.id;
    grant.hasFacilitatorApproved = isApproved;
    grant.save();

    addFeedItem({
      timestamp: event.block.timestamp,
      tx: event.transaction,
      content: `Facilitator Crew approved ${project.name}'s Grant Application.`,
      subjectMetadataPointer: 'facilitators',
      subject: {
        id: event.address.toHexString(),
        type: 'facilitators',
        name: 'Facilitator Crew',
      },
      object: {
        id: project.id.toHexString(),
        type: 'project',
        name: project.name,
      },
      embed: {
        key: 'reason',
        pointer: event.params.reason.pointer,
        protocol: event.params.reason.protocol,
        content: null,
      },
      details: null,
      tag: `allocation-${isApproved ? 'approved' : 'rejected'}`,
      postIndex: 0,
    });

    addTransaction(event.block, event.transaction);
  }
}

export function handleMilestonesSetEvent(event: MilestonesSetEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let project = Project.load(event.params.recipientId);
  let grantShip = GrantShip.load(anchorAddress);

  let grant = Grant.load(grantId);

  if (grant == null || project == null || grantShip == null) {
    return;
  }

  grant.milestonesAmount = event.params.milestonesLength;
  grant.grantStatus = GrantStatus.MilestonesProposed;
  grant.currentMilestoneIndex = BigInt.fromI32(0);

  grant.save();

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `${
      project.name
    } has proposed ${event.params.milestonesLength.toString()} milestones to ${
      grantShip.name
    }`,
    subjectMetadataPointer: project.metadata,
    subject: {
      id: project.id.toHex(),
      type: 'project',
      name: project.name,
    },
    object: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    embed: null,
    details: null,
    tag: `milestones-set`,
    postIndex: 0,
  });

  addTransaction(event.block, event.transaction);
}

export function handleMilestonesReviewedEvent(
  event: MilestonesReviewedEvent
): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let grant = Grant.load(grantId);
  let project = Project.load(event.params.recipientId);
  let grantShip = GrantShip.load(anchorAddress);

  if (grant == null || project == null || grantShip == null) {
    return;
  }

  let isApproved = event.params.status === AlloStatus.Accepted;

  grant.milestonesApproved = isApproved;

  if (isApproved) {
    grant.grantStatus = GrantStatus.MilestonesApproved;
  } else if (event.params.status === AlloStatus.Rejected) {
    grant.grantStatus = GrantStatus.MilestonesRejected;
  }

  let reason = new RawMetadata(event.params.reason.pointer);
  reason.protocol = event.params.reason.protocol;
  reason.pointer = event.params.reason.pointer;
  reason.save();

  grant.lastUpdated = event.block.timestamp;
  grant.milestonesApprovedReason = reason.id;

  grant.save();

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `${grantShip.name} has ${isApproved ? 'approved' : 'rejected'} ${
      project.name
    }'s milestones.`,
    subjectMetadataPointer: grantShip.profileMetadata,
    subject: {
      id: grantShip.id.toHex(),
      type: 'ship',
      name: grantShip.name,
    },
    object: {
      id: project.id.toHexString(),
      type: 'project',
      name: project.name,
    },
    embed: {
      key: 'reason',
      pointer: event.params.reason.pointer,
      protocol: event.params.reason.protocol,
      content: null,
    },
    details: null,
    tag: `milestones-${isApproved ? 'approved' : 'rejected'}`,
    postIndex: 0,
  });

  addTransaction(event.block, event.transaction);
}

export function handleMilestoneSubmittedEvent(
  event: MilestoneSubmittedEvent
): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let grant = Grant.load(grantId);

  let project = Project.load(event.params.recipientId);

  if (grant == null || project == null) {
    return;
  }

  grant.lastUpdated = event.block.timestamp;
  grant.currentMilestoneIndex = event.params.milestoneId;
  grant.grantStatus = GrantStatus.MilestoneSubmitted;

  grant.save();

  addTransaction(event.block, event.transaction);
}

export function handleMilestoneRejectedEvent(
  event: MilestoneRejectedEvent
): void {
  //  emit MilestoneRejected(_recipientId, _milestoneId, _reason);

  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let grant = Grant.load(grantId);
  let project = Project.load(event.params.recipientId);
  let grantShip = GrantShip.load(anchorAddress);

  if (grant == null || project == null || grantShip == null) {
    return;
  }

  let reason = new RawMetadata(event.params.reason.pointer);

  reason.protocol = event.params.reason.protocol;
  reason.pointer = event.params.reason.pointer;

  reason.save();

  grant.lastUpdated = event.block.timestamp;
  grant.currentMilestoneRejectedReason = reason.id;
  grant.grantStatus = GrantStatus.MilestoneRejected;

  grant.save();
}

export function handleDistributedEvent(event: DistributedEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let grantId = createGrantId({
    projectId: event.params.recipientId,
    shipId: anchorAddress,
  });

  let grant = Grant.load(grantId);

  let project = Project.load(event.params.recipientId);
  let grantShip = GrantShip.load(anchorAddress);

  if (grant == null || project == null || grantShip == null) {
    return;
  }

  if (grant.currentMilestoneIndex == null) {
    let log = new Log('Error: Current Milestone Index Not Found');
    log.message = 'Current Milestone Index Not Found';
    log.type = 'Error';
    log.save();

    grant.currentMilestoneIndex = BigInt.fromI32(0);
  }

  if (grant.milestonesAmount == null) {
    let log = new Log('Error: Milestones Amount Not Found');
    log.message = 'Milestones Amount Not Found';
    log.type = 'Error';
    log.save();

    grant.milestonesAmount = BigInt.fromI32(0);
  }

  grant.amtDistributed = event.params.amount;
  grant.lastUpdated = event.block.timestamp;
  grant.currentMilestoneIndex = grant.currentMilestoneIndex.plus(
    BigInt.fromI32(1)
  );

  grantShip.balance = grantShip.balance.minus(event.params.amount);
  grantShip.save();

  project.totalAmountReceived = project.totalAmountReceived.plus(
    event.params.amount
  );

  project.save();

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `${grantShip.name} distributed ${inWeiMarker(
      event.params.amount
    )} to ${
      project.name
    } for completing milestone ${grant.currentMilestoneIndex.plus(
      BigInt.fromI32(1)
    )}`,
    subjectMetadataPointer: grantShip.profileMetadata,
    subject: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    object: {
      id: project.id.toHexString(),
      type: 'project',
      name: project.name,
    },
    embed: null,
    details: null,
    tag: `distributed`,
    postIndex: 0,
  });

  const isGrantComplete =
    grant.currentMilestoneIndex.plus(BigInt.fromI32(1)) >=
    grant.milestonesAmount;

  if (isGrantComplete) {
    grant.grantStatus = GrantStatus.Completed;
    grant.currentMilestoneIndex = BigInt.fromI32(0);
    addFeedItem({
      timestamp: event.block.timestamp,
      tx: event.transaction,
      content: `${project.name} has completed their grant from ${grantShip.name}`,
      subjectMetadataPointer: project.metadata,
      subject: {
        id: project.id.toHexString(),
        type: 'project',
        name: project.name,
      },
      object: {
        id: grantShip.id.toHexString(),
        type: 'ship',
        name: grantShip.name,
      },
      embed: null,
      details: null,
      tag: `grant-completed`,
      postIndex: 1,
    });
  } else {
    grant.grantStatus = GrantStatus.MilestoneApproved;
  }

  grant.save();
  addTransaction(event.block, event.transaction);
}

export function handleInitializeEvent(event: InitializedEvent): void {}

export function handleMilestoneStatusChangedEvent(
  event: MilestoneStatusChangedEvent
): void {}

export function handleFlagIssuedEvent(event: FlagIssuedEvent): void {}

export function handleFlagResolvedEvent(event: FlagResolvedEvent): void {}

export function handlePoolWithdrawEvent(event: PoolWithdrawEvent): void {}
