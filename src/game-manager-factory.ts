import {
  FactoryInitialized as FactoryInitializedEvent,
  GameManagerDeployed as GameManagerDeployedEvent,
  GameManagerDeployedWithPool as GameManagerDeployedWithPoolEvent,
  RootAccountSwitched as RootAccountSwitchedEvent,
  TemplateCreated as TemplateCreatedEvent,
} from '../generated/GameManagerFactory/GameManagerFactory';
import { GmVersion } from '../generated/schema';

export const handleFactoryInitializedEvent = (
  event: FactoryInitializedEvent
) => {};

export const handleGameManagerDeployedEvent = (
  event: GameManagerDeployedEvent
) => {};

export const handleGameManagerDeployedWithPoolEvent = (
  event: GameManagerDeployedWithPoolEvent
) => {};

export const handleRootAccountSwitchedEvent = (
  event: RootAccountSwitchedEvent
) => {};

export const handleTemplateCreatedEvent = (event: TemplateCreatedEvent) => {
  let template = new GmVersion(event.params.name);

  template.name = event.params.name;
  template.address = event.params.templateAddress;

  template.save();
};
