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
import { GrantShip, GameManager, GameRound, Log } from '../generated/schema';
import { createRawMetadata } from './utils/rawMetadata';
import { addTransaction } from './utils/addTransaction';
import { GameStatus } from './utils/constants';
import { addFeedItem, inWeiMarker } from './utils/feed';

export function handleGameManagerInitializedEvent(
  event: GameManagerInitializedEvent
): void {
  let gameManager = new GameManager(event.address);
  gameManager.gameFacilitatorId = event.params.gameFacilitatorId;
  gameManager.rootAccount = event.params.rootAccount;
  gameManager.tokenAddress = event.params.token;
  gameManager.currentRoundId = BigInt.fromI32(0);
  gameManager.poolFunds = BigInt.fromI32(0);

  gameManager.save();

  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Facilitator Crew Initialized the Game Manager Contract`,
    subjectMetadataPointer: 'facilitators',
    subject: {
      id: event.address.toHexString(),
      type: 'facilitators',
      name: 'Facilitator Crew',
    },
    object: null,
    embed: null,
    details: null,
    tag: 'gm-initialized',
    postIndex: 0,
  });
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
  grantShip.isAwaitingApproval = true;
  grantShip.applicationSubmittedTime = event.block.timestamp;
  // resets isApproved and isRejected in case of re-submission
  grantShip.isApproved = false;
  grantShip.isRejected = false;

  grantShip.status = GameStatus.Pending;
  grantShip.save();
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Ship ${grantShip.name} submitted an application to become a Grant Ship`,
    subjectMetadataPointer: grantShip.profileMetadata,
    subject: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    object: null,
    embed: null,
    details: null,
    tag: 'ship-registered',
    postIndex: 0,
  });
}

export function handleRoundCreatedEvent(event: RoundCreatedEvent): void {
  let entityId = event.params.gameIndex;
  let gameManager = GameManager.load(event.address);
  if (gameManager == null) {
    let log = new Log('Game Manager Not Found');
    log.message = 'Game Manager not found';
    log.type = 'Error';
    log.save();
    return;
  }
  let gameRound = new GameRound(entityId.toString());
  gameRound.startTime = BigInt.fromI32(0);
  gameRound.endTime = BigInt.fromI32(0);
  gameRound.totalRoundAmount = event.params.totalRoundAmount;
  gameRound.totalAllocatedAmount = BigInt.fromI32(0);
  gameRound.totalDistributedAmount = BigInt.fromI32(0);
  gameRound.gameStatus = GameStatus.Pending; // 1 = Pending
  gameRound.ships = [];
  gameRound.save();
  gameManager.currentRound = entityId.toString();
  gameManager.save();
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Facilitator Crew created a new Game Round`,
    subjectMetadataPointer: 'facilitators',
    subject: {
      id: event.address.toHexString(),
      type: 'facilitators',
      name: 'Facilitator Crew',
    },
    object: null,
    embed: null,
    details: null,
    tag: 'gm-round-created',
    postIndex: 0,
  });
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
  grantShip.isRejected = true;
  grantShip.isAwaitingApproval = false;
  grantShip.rejectedTime = event.block.timestamp;
  grantShip.applicationReviewReason = createRawMetadata(
    event.params.reason.protocol,
    event.params.reason.pointer
  );
  grantShip.save();
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Facilitator Crew rejected Grant Ship application for ${grantShip.name}`,
    subjectMetadataPointer: 'facilitators',
    subject: {
      id: event.address.toHexString(),
      type: 'facilitators',
      name: 'Facilitator Crew',
    },
    object: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    embed: {
      key: 'reason',
      pointer: event.params.reason.pointer,
      protocol: event.params.reason.protocol,
      content: null,
    },
    details: null,
    tag: 'ship-rejected',
    postIndex: 0,
  });
}

export function handleRecipientAcceptedEvent(
  event: RecipientAcceptedEvent
): void {
  let entityId = event.params.recipientAddress;
  let grantShip = GrantShip.load(entityId);
  if (grantShip == null) {
    return;
  }
  grantShip.status = GameStatus.Accepted;
  grantShip.isApproved = true;
  grantShip.isAwaitingApproval = false;
  grantShip.approvedTime = event.block.timestamp;
  grantShip.applicationReviewReason = createRawMetadata(
    event.params.reason.protocol,
    event.params.reason.pointer
  );
  grantShip.save();
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Facilitator Crew approved Grant Ship application for ${grantShip.name}`,
    subjectMetadataPointer: 'facilitators',
    subject: {
      id: event.address.toHexString(),
      type: 'facilitators',
      name: 'Facilitator Crew',
    },
    object: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    embed: {
      key: 'reason',
      pointer: event.params.reason.pointer,
      protocol: event.params.reason.protocol,
      content: null,
    },
    details: null,
    tag: 'ship-accepted',
    postIndex: 0,
  });
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
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `${grantShip.name} has launched a Grant Ship contract! 🚀`,
    subjectMetadataPointer: grantShip.profileMetadata,
    subject: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    object: null,
    embed: null,
    details: null,
    tag: 'ship-launched',
    postIndex: 0,
  });
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
  currentRound.totalAllocatedAmount = currentRound.totalAllocatedAmount.plus(
    event.params.amount
  );
  currentRound.save();
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Facilitator Crew allocated ${inWeiMarker(
      event.params.amount
    )} to ${grantShip.name}`,
    subjectMetadataPointer: 'facilitators',
    subject: {
      id: event.address.toHexString(),
      type: 'facilitators',
      name: 'Facilitator Crew',
    },
    object: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    embed: null,
    details: null,
    tag: `${grantShip.id}-allocated`,
    postIndex: 0,
  });
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
  currentRound.totalDistributedAmount =
    currentRound.totalDistributedAmount.plus(event.params.amount);

  // Todo: Will need to track pool funded on Allo contract in order track the pool balance here.
  // Todo: Distributed event doesn't track start and stop times for the round
  // Will need to redeploy with relevant data
  currentRound.save();
  addTransaction(event.block, event.transaction);

  addFeedItem({
    timestamp: event.block.timestamp,
    tx: event.transaction,
    content: `Facilitator Crew distributed ${inWeiMarker(
      event.params.amount
    )} to ${grantShip.name}`,
    subjectMetadataPointer: 'facilitators',
    subject: {
      id: event.address.toHexString(),
      type: 'facilitators',
      name: 'Facilitator Crew',
    },
    object: {
      id: grantShip.id.toHexString(),
      type: 'ship',
      name: grantShip.name,
    },
    embed: null,
    details: null,
    tag: `${grantShip.id}-ship-distributed`,
    postIndex: 0,
  });
}

export function handleGameActiveEvent(event: GameActiveEvent): void {
  let gameManager = GameManager.load(event.address);
  if (gameManager == null) {
    return;
  }

  let currentRound = GameRound.load(gameManager.currentRound!);

  if (currentRound == null) {
    return;
  }

  // Is start game
  if (event.params.active === true) {
    currentRound.gameStatus = GameStatus.Active;
    currentRound.realStartTime = event.block.timestamp;
    currentRound.isGameActive = true;
    addFeedItem({
      timestamp: event.block.timestamp,
      tx: event.transaction,
      content: `Facilitator Crew has started round 0 of the Grant Ships game! 🚀`,
      subjectMetadataPointer: 'facilitators',
      subject: {
        id: event.address.toHexString(),
        type: 'facilitators',
        name: 'Facilitator Crew',
      },
      object: null,
      embed: null,
      details: null,
      tag: 'gm-game-active',
      postIndex: 0,
    });
  }
  // Is stop game
  if (event.params.active === false) {
    currentRound.gameStatus = GameStatus.Completed;
    currentRound.realEndTime = event.block.timestamp;
    gameManager.currentRoundId = event.params.gameIndex;
    currentRound.isGameActive = false;
    addFeedItem({
      timestamp: event.block.timestamp,
      tx: event.transaction,
      content: `Facilitator Crew has ended round 0 of the Grant Ships game! 🚀`,
      subjectMetadataPointer: 'facilitators',
      subject: {
        id: event.address.toHexString(),
        type: 'facilitators',
        name: 'Facilitator Crew',
      },
      object: null,
      embed: null,
      details: null,
      tag: 'gm-game-inactive',
      postIndex: 0,
    });
  }
  currentRound.save();
  gameManager.save();
  addTransaction(event.block, event.transaction);
}

export function handleUpdatePostedEvent(event: UpdatePostedEvent): void {}
