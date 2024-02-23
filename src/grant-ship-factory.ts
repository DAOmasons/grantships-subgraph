import { DataSourceContext, Value } from '@graphprotocol/graph-ts';
import { ShipCreated as ShipCreatedEvent } from '../generated/GrantShipFactory/GrantShipFactory';

import { GrantShipStrategyContract } from '../generated/templates';
import { GrantShip, Log } from '../generated/schema';

// One problem with using a shared entity for GrantShip is that we
// have to map it to anchor address because the entity is created
// before the ship contract is deployed.

// This creates a lookup entity so that we can map the anchor address
// to the ship address. This will need to be used to access the GrantShip
// whenever we handle an event from a grant ship strategy
export function handleShipCreatedEvent(event: ShipCreatedEvent): void {
  let grantShip = GrantShip.load(event.params.anchorAddress);

  let log = new Log('Grant Ship Created');
  log.message = 'Grant Ship Created';
  log.type = 'Info';
  log.save();

  if (grantShip == null) {
    let log = new Log('Error: Grant Ship Not Found');
    log.message = 'Grant Ship Not Found';
    log.type = 'Error';
    log.save();
    return;
  }

  grantShip.shipContractAddress = event.params.strategyAddress;
  grantShip.save();

  let context = new DataSourceContext();
  context.set('anchorAddress', Value.fromBytes(event.params.anchorAddress));
  GrantShipStrategyContract.createWithContext(
    event.params.strategyAddress,
    context
  );
}
