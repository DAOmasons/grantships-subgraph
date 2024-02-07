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
import { GrantShip, GameManager, GameRound } from '../generated/schema';
import { createRawMetadata } from './utils/rawMetadata';

enum GameStatus {
  None = 0,
  Pending = 1,
  Accepted = 3,
  Rejected = 4,
  Allocated = 5,
  Funded = 6,
  Active = 7,
  Completed = 8,
}

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
  grantShip.status = GameStatus.Pending;
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
  gameRound.gameStatus = GameStatus.Pending; // 1 = Pending
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

  grantShip.status = GameStatus.Rejected; // 3 = Rejected
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

  grantShip.status = GameStatus.Accepted; // 2 = Accepted
  grantShip.isApproved = true;

  grantShip.applicationReviewReason = createRawMetadata(
    event.params.reason.protocol,
    event.params.reason.pointer
  );

  grantShip.save();
}

export function handleShipLaunchedEvent(event: ShipLaunchedEvent): void {
  let entityId = event.params.recipientId;

  let grantShip = GrantShip.load(entityId);

  if (grantShip == null) {
    return;
  }

  grantShip.poolId = event.params.shipPoolId;
  grantShip.shipContractAddress = event.params.shipAddress;
  grantShip.shipLaunched = true;

  grantShip.save();
}
export function handleAllocatedEvent(event: AllocatedEvent): void {
  let shipId = event.params.recipientId;
  let grantShip = GrantShip.load(shipId);
  let gameManager = GameManager.load(event.address);
  if (grantShip == null || gameManager == null) {
    return;
  }
  grantShip.status = GameStatus.Allocated; // 4 = Allocated
  grantShip.isAllocated = true;
  grantShip.allocatedAmount = event.params.amount;
  grantShip.save();
  if (gameManager.currentRound == null) {
    return;
  }
  let currentRound = GameRound.load(gameManager.currentRound!);
  if (currentRound == null) {
    return;
  }
  currentRound.ships.push(shipId);
  currentRound.gameStatus = GameStatus.Allocated; // 5 = Allocated
  currentRound.totalRoundAmount = currentRound.totalRoundAmount.plus(
    event.params.amount
  );
  currentRound.save();
}

export function handleDistributedEvent(event: DistributedEvent): void {
  let shipId = event.params.recipientId;
  let grantShip = GrantShip.load(shipId);
  let gameManager = GameManager.load(event.address);
  if (grantShip == null || gameManager == null) {
    return;
  }
  grantShip.status = GameStatus.Funded;
  grantShip.isDistributed = true;
  grantShip.distributedAmount = event.params.amount;
  grantShip.status = GameStatus.Active;
  if (grantShip.allocatedAmount) {
    grantShip.allocatedAmount = grantShip.allocatedAmount!.minus(
      event.params.amount
    );
  }
  grantShip.save();
  if (gameManager.currentRound == null) {
    return;
  }
  let currentRound = GameRound.load(gameManager.currentRound!);
  if (currentRound == null) {
    return;
  }
  currentRound.ships.push(shipId);
  currentRound.gameStatus = GameStatus.Funded;
  // Todo: Will need to track pool funded on Allo contract in order track the pool balance here.
  // Todo: Distributed event doesn't track start and stop times for the round
  // Will need to redeploy with relevant data
  currentRound.save();
}

export function handleGameActiveEvent(event: GameActiveEvent): void {
  // let gameManager = GameManager.load(event.address);
  // if (gameManager == null) {
  //   return;
  // }
  // gameManager.currentRoundId = event.params.gameIndex;
  // gameManager.save();
}

export function handleUpdatePostedEvent(event: UpdatePostedEvent): void {}
