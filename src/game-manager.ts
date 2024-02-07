import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  Registered as RegisteredEvent,
  GameManagerInitialized as GameManagerInitializedEvent,
  RoundCreated as RoundCreatedEvent,
} from '../generated/GameManager/GameManager';
import { GrantShip, GameManager, GameRound } from '../generated/schema';

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

  gameRound.save();

  gameManager.currentRound = entityId.toString();
}
