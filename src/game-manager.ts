import { ethereum, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Registered as RegisteredEvent } from "../generated/GameManager/GameManager";
import { GameManagerInitialized as GameManagerInitializedEvent } from "../generated/GameManager/GameManager";
import { GrantShip, FeedEvent } from "../generated/schema";

export function handleRegisteredEvent(event: RegisteredEvent): void {
  // anchorAddress:
  let entityId = event.params.recipientId;
  let grantShip = GrantShip.load(entityId);
  if (grantShip == null) {
    grantShip = new GrantShip(entityId);
  }

  let decodedValue = ethereum.decode(
    "(address,string,(uint256,string))",
    event.params.data
  );

  if (decodedValue == null) {
    grantShip.name = "Decoded value is null";
    grantShip.save();
    return;
  }
  let tuple = decodedValue.toTuple();

  if (tuple == null || tuple.length != 3) {
    grantShip.name = "Could not decode";
    grantShip.save();
    return;
  }
  grantShip.name = tuple[1].toString();
  grantShip.save();
}

export function handleGameManagerInitialized(
  event: GameManagerInitializedEvent
): void {
  createFeedEvent(
    event.params.rootAccount,
    event.block.number,
    "Game was initialized by " + event.params.gameFacilitatorId.toString()
  );
}

export function createFeedEvent(
  entityId: Bytes,
  blockNumber: BigInt,
  message: string
): void {
  let feedEvent = FeedEvent.load(entityId);
  if (feedEvent == null) {
    feedEvent = new FeedEvent(entityId);
  }
  feedEvent.blockNumber = blockNumber;
  feedEvent.message = message;
  feedEvent.save();
}
