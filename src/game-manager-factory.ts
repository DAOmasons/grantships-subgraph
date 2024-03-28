import {
  FactoryInitialized as FactoryInitializedEvent,
  GameManagerDeployed as GameManagerDeployedEvent,
  GameManagerDeployedWithPool as GameManagerDeployedWithPoolEvent,
  RootAccountSwitched as RootAccountSwitchedEvent,
  TemplateCreated as TemplateCreatedEvent,
} from '../generated/GameManagerFactory/GameManagerFactory';
import { GmDeployment, GmVersion, RawMetadata } from '../generated/schema';
import { addTransaction } from './utils/addTransaction';
import { addFeedItem } from './utils/feed';

export function handleFactoryInitializedEvent(
  event: FactoryInitializedEvent
): void {}

export function handleGameManagerDeployedEvent(
  event: GameManagerDeployedEvent
): void {}

export function handleGameManagerDeployedWithPoolEvent(
  event: GameManagerDeployedWithPoolEvent
): void {
  let gmDeployment = new GmDeployment(
    event.params.gameManagerAddress.toHexString()
  );

  let gmVersion = GmVersion.load(event.params.templateName);

  if (gmVersion == null) {
    return;
  }

  let poolMetadata = new RawMetadata(event.params.poolMetadata.pointer);

  poolMetadata.pointer = event.params.poolMetadata.pointer;
  poolMetadata.protocol = event.params.poolMetadata.protocol;

  poolMetadata.save();

  let poolProfileMetadata = new RawMetadata(
    event.params.profileMetadata.pointer
  );

  poolProfileMetadata.pointer = event.params.profileMetadata.pointer;
  poolProfileMetadata.protocol = event.params.profileMetadata.protocol;

  poolProfileMetadata.save();

  gmDeployment.address = event.params.gameManagerAddress;
  gmDeployment.poolId = event.params.poolId;
  gmDeployment.profileId = event.params.profileId;
  gmDeployment.hasPool = true;
  gmDeployment.version = gmVersion.id;
  gmDeployment.blockNumber = event.block.number;
  gmDeployment.timestamp = event.block.timestamp;
  gmDeployment.transactionHash = event.transaction.hash;
  gmDeployment.poolMetadata = poolMetadata.id;
  gmDeployment.poolProfileMetadata = poolProfileMetadata.id;

  gmDeployment.save();

  addTransaction(event.block, event.transaction);
}

export function handleRootAccountSwitchedEvent(
  event: RootAccountSwitchedEvent
): void {}

export function handleTemplateCreatedEvent(event: TemplateCreatedEvent): void {
  let gnVersion = new GmVersion(event.params.name);

  gnVersion.name = event.params.name;
  gnVersion.address = event.params.templateAddress;

  gnVersion.save();

  addTransaction(event.block, event.transaction);
}
