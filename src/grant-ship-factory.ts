import { DataSourceContext, Value } from '@graphprotocol/graph-ts';
import { ShipCreated as ShipCreatedEvent } from '../generated/GrantShipFactory/GrantShipFactory';
// import { GrantShipLookup } from '../generated/schema';
import { GrantShipStrategyContract } from '../generated/templates';

// One problem with using a shared entity for GrantShip is that we
// have to map it to anchor address because the entity is created
// before the ship contract is deployed.

// This creates a lookup entity so that we can map the anchor address
// to the ship address. This will need to be used to access the GrantShip
// whenever we handle an event from a grant ship strategy
export function handleShipCreatedEvent(event: ShipCreatedEvent): void {
  // let anchorToShipAddress = new GrantShipLookup(event.params.strategyAddress);
  // anchorToShipAddress.anchorAddress = event.params.anchorAddress;
  // anchorToShipAddress.save();
  // let context = new DataSourceContext();
  // context.set('anchorAddress', Value.fromBytes(event.params.anchorAddress));
  // GrantShipStrategyContract.createWithContext(
  //   event.params.strategyAddress,
  //   context
  // );
}
