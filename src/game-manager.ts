import { ethereum } from '@graphprotocol/graph-ts';
import { Registered as RegisteredEvent } from '../generated/GameManager/GameManager';
import { GrantShip } from '../generated/schema';

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
