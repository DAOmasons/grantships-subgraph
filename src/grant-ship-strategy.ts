import { dataSource } from '@graphprotocol/graph-ts';
import { Initialized as InitializedEvent } from '../generated/templates/GrantShipStrategyContract/GrantShipStrategy';
import { GrantShip, Log } from '../generated/schema';
import { addTransaction } from './utils/addTransaction';
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

export function handleInitializeEvent(event: InitializedEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let log1 = new Log('Test Anchor/Ship Address Join');

  log1.message =
    'Anchor Address: ' +
    anchorAddress.toHex() +
    ' Ship Address: ' +
    event.address.toHex();
  log1.type = 'Debug';
  log1.save();

  let grantShip = new GrantShip(anchorAddress);

  let log2 = new Log('Test Use Anchor to Access GrantShip Entity');

  log2.message =
    'GrantShip Name: ' +
    grantShip.name +
    ' GrantShip Status: ' +
    grantShip.status.toString();
  log2.type = 'Debug';

  log2.save();

  addTransaction(event.block, event.transaction);
}

export function handlePoolFundedEvent(event: PoolFundedEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let log1 = new Log(`test-anchor${event.address.toHex()}`);

  log1.message = `GrantShip Anchor Address: ${anchorAddress.toHex()} GrantShip Contract Address: ${event.address.toHex()}`;
  log1.type = 'Debug';
  log1.save();
}

export function handleRecipientStatusChangedEvent(
  event: RecipientStatusChangedEvent
): void {}

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

export function handleRegisteredEvent(event: RegisteredEvent): void {}

export function handleAllocatedEvent(event: AllocatedEvent): void {}

export function handleDistributedEvent(event: DistributedEvent): void {}
