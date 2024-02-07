import { BigInt } from '@graphprotocol/graph-ts';
import {
  Registered as RegisteredEvent,
  GameManagerInitialized as GameManagerInitializedEvent,
  RoundCreated as RoundCreatedEvent,
  RecipientRejected as RecipientRejectedEvent,
  RecipientAccepted as RecipientAcceptedEvent,
  ShipLaunched as ShipLaunchedEvent,
  GameActive as GameActiveEvent,
  UpdatePosted as UpdatePostedEvent,
  Allocated as AllocatedEvent,
  Distributed as DistributedEvent,
} from '../generated/GameManager/GameManager';
import {
  GrantShip,
  GameManager,
  GameRound,
  RawMetadata,
} from '../generated/schema';
import { createRawMetadata } from './utils/rawMetadata';

export function handleGameManagerInitializedEvent(
  event: GameManagerInitializedEvent
): void {
  let gameManager = new GameManager(event.address);

  gameManager.gameFacilitatorId = event.params.gameFacilitatorId;
  gameManager.rootAccount = event.params.rootAccount;
  gameManager.tokenAddress = event.params.token;
  gameManager.currentRoundId = BigInt.fromI32(0);

  gameManager.save();
}

export function handleRegisteredEvent(event: RegisteredEvent): void {
  // anchorAddress:
  let entityId = event.params.recipientId;
  let grantShip = GrantShip.load(entityId);

  if (grantShip == null) {
    // not sure if we should actually create a new entity at this point
    return;
  }

  grantShip.shipApplicationBytesData = event.params.data;
  grantShip.hasSubmittedApplication = true;
  grantShip.status = 1;
  grantShip.save();
}

export function handleRoundCreatedEvent(event: RoundCreatedEvent): void {
  let entityId = event.params.gameIndex;

  let gameManager = GameManager.load(event.address);

  if (gameManager == null) {
    return;
  }

  let gameRound = new GameRound(entityId.toString());

  gameRound.startTime = BigInt.fromI32(0);
  gameRound.endTime = BigInt.fromI32(0);
  gameRound.totalRoundAmount = event.params.totalRoundAmount;
  gameRound.gameStatus = 1; // 1 = Pending
  gameRound.ships = [];

  gameRound.save();

  gameManager.currentRound = entityId.toString();
}

export function handleRecipientRejectedEvent(
  event: RecipientRejectedEvent
): void {
  let entityId = event.params.recipientAddress;

  let grantShip = GrantShip.load(entityId);

  if (grantShip == null) {
    return;
  }

  grantShip.status = 3; // 3 = Rejected
  grantShip.isApproved = false;

  grantShip.applicationReviewReason = createRawMetadata(
    event.params.reason.protocol,
    event.params.reason.pointer
  );

  grantShip.save();
}

export function handleRecipientAcceptedEvent(
  event: RecipientAcceptedEvent
): void {
  let entityId = event.params.recipientAddress;

  let grantShip = GrantShip.load(entityId);

  if (grantShip == null) {
    return;
  }

  grantShip.status = 2; // 2 = Accepted
  grantShip.isApproved = true;

  grantShip.applicationReviewReason = createRawMetadata(
    event.params.reason.protocol,
    event.params.reason.pointer
  );

  grantShip.save();
}

export function handleShipLaunchedEvent(event: ShipLaunchedEvent): void {}

export function handleGameActiveEvent(event: GameActiveEvent): void {}

export function handleUpdatePostedEvent(event: UpdatePostedEvent): void {}

export function handleAllocatedEvent(event: AllocatedEvent): void {}

export function handleDistributedEvent(event: DistributedEvent): void {}
