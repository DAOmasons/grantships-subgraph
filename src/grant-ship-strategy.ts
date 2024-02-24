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
import { addFeedItem } from './utils/feed';

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

  let grantId = `${event.params.recipientId.toHex()}-${anchorAddress.toHex()}`;

  let grant = Grant.load(grantId);

  if (grant == null) {
    grant = new Grant(grantId);
  }

  grant.projectId = project.id;
  grant.shipId = grantShip.id;
  grant.lastUpdated = event.block.timestamp;
  grant.grantApplicationBytes = event.params.data;
  grant.grantStatus = GrantStatus.Applied;
  grant.milestoneReviewStatus = AlloStatus.None;

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

export function handleRecipientStatusChangedEvent(
  event: RecipientStatusChangedEvent
): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');
}

export function handleMilestoneSubmittedEvent(
  event: MilestoneSubmittedEvent
): void {}

export function handleMilestoneStatusChangedEvent(
  event: MilestoneStatusChangedEvent
): void {}

export function handleMilestoneRejectedEvent(
  event: MilestoneRejectedEvent
): void {}

export function handleMilestonesSetEvent(event: MilestonesSetEvent): void {}

export function handleFlagIssuedEvent(event: FlagIssuedEvent): void {}

export function handleFlagResolvedEvent(event: FlagResolvedEvent): void {}

export function handleMilestonesReviewedEvent(
  event: MilestonesReviewedEvent
): void {}

export function handlePoolWithdrawEvent(event: PoolWithdrawEvent): void {}

export function handleUpdatePostedEvent(event: UpdatePostedEvent): void {
  if (event.params.tag.startsWith('TAG:SHIP_REVIEW_GRANT')) {
    // `TAG:SHIP_REVIEW_GRANT:${grant.id}:${isApproved ? 'APPROVED' : 'REJECTED'}`;
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

    let hasPermission = grantShip.hatId == event.params.role;

    if (!hasPermission) {
      let log = new Log('Error: Poster does not have permission');
      log.message = 'Poster does not have permission';
      log.type = 'Error';
      log.save();
      return;
    }

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

export function handleAllocatedEvent(event: AllocatedEvent): void {}

export function handleDistributedEvent(event: DistributedEvent): void {}
export function handleInitializeEvent(event: InitializedEvent): void {}

//   let anchorAddress = dataSource.context().getBytes('anchorAddress');

//   // let log1 = new Log('Test Anchor/Ship Address Join');

//   // log1.message =
//   //   'Anchor Address: ' +
//   //   anchorAddress.toHex() +
//   //   ' Ship Address: ' +
//   //   event.address.toHex();
//   // log1.type = 'Debug';
//   // log1.save();

//   // let grantShip = new GrantShip(anchorAddress);

//   // let log2 = new Log('Test Use Anchor to Access GrantShip Entity');

//   // log2.message =
//   //   'GrantShip Name: ' +
//   //   grantShip.name +
//   //   ' GrantShip Status: ' +
//   //   grantShip.status.toString();
//   // log2.type = 'Debug';

//   // log2.save();

//   // addTransaction(event.block, event.transaction);
