import { BigInt, dataSource } from '@graphprotocol/graph-ts';
import { Initialized as InitializedEvent } from '../generated/templates/GrantShipStrategyContract/GrantShipStrategy';
import { Grant, GrantShip, Log, Project } from '../generated/schema';
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
} from '../generated/templates/GrantShipStrategyContract/GrantShipStrategy';
import { AlloStatus } from './utils/constants';
import { addTransaction } from './utils/addTransaction';
import { addFeedItem } from './utils/feed';

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
  grant.grantStatus = AlloStatus.Pending;
  grant.milestoneReviewStatus = AlloStatus.Pending;

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

export function handleUpdatePostedEvent(event: UpdatePostedEvent): void {}

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
