import { dataSource } from '@graphprotocol/graph-ts';
import { Initialized as InitializedEvent } from '../generated/templates/GrantShipStrategyContract/GrantShipStrategy';
import { GrantShip, Log } from '../generated/schema';
import { addTransaction } from './utils/addTransaction';

export function handleInitializeEvent(event: InitializedEvent): void {
  let anchorAddress = dataSource.context().getBytes('anchorAddress');

  let log1 = new Log('Test Anchor/Ship Address Join');

  log1.message =
    'Anchor Address: ' +
    anchorAddress.toHex() +
    ' Ship Address: ' +
    event.address.toHex();
  log1.type = 'Debug';
  log1.save();

  let grantShip = new GrantShip(anchorAddress);

  let log2 = new Log('Test Use Anchor to Access GrantShip Entity');

  log2.message =
    'GrantShip Name: ' +
    grantShip.name +
    ' GrantShip Status: ' +
    grantShip.status.toString();
  log2.type = 'Debug';

  log2.save();

  addTransaction(event.block, event.transaction);
}
