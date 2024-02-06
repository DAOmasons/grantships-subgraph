import { Registered as RegisteredEvent } from '../generated/GameManager/GameManager';

export function handleRegisteredEvent(event: RegisteredEvent): void {
  let entityId = event.params.recipientId;
}
