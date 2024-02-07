import { ethereum } from '@graphprotocol/graph-ts';
import { Registered as RegisteredEvent } from '../generated/GameManager/GameManager';
import { GrantShip } from '../generated/schema';

export function handleRegisteredEvent(event: RegisteredEvent): void {
  // anchorAddress:
  let entityId = event.params.recipientId;
  let grantShip = GrantShip.load(entityId);
  if (grantShip == null) {
    grantShip = new GrantShip(entityId);
  }

  grantShip.applicationBytesData = event.params.data;
  grantShip.save();
}
