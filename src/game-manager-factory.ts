import {
  FactoryInitialized as FactoryInitializedEvent,
  GameManagerDeployed as GameManagerDeployedEvent,
  GameManagerDeployedWithPool as GameManagerDeployedWithPoolEvent,
  RootAccountSwitched as RootAccountSwitchedEvent,
  TemplateCreated as TemplateCreatedEvent,
} from '../generated/GameManagerFactory/GameManagerFactory';
import { GmVersion } from '../generated/schema';
import { addTransaction } from './utils/addTransaction';

export function handleFactoryInitializedEvent(
  event: FactoryInitializedEvent
): void {}

export function handleGameManagerDeployedEvent(
  event: GameManagerDeployedEvent
): void {}

export function handleGameManagerDeployedWithPoolEvent(
  event: GameManagerDeployedWithPoolEvent
): void {}

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
