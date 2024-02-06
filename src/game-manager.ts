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

  let decodedValue = ethereum.decode(
    '(address,string,(uint256,string))',
    event.params.data
  );

  if (decodedValue == null) {
    grantShip.name = 'Decoded value is null';
    grantShip.save();
    return;
  }
  let tuple = decodedValue.toTuple();

  if (tuple == null || tuple.length != 3) {
    grantShip.name = 'Could not decode';
    grantShip.save();
    return;
  }
  grantShip.name = tuple[1].toString();
  grantShip.save();
}
