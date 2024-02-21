import { PoolFunded as PoolFundedEvent } from '../generated/Allo/Allo';

import { store } from '@graphprotocol/graph-ts';
import { GameManager, GrantShip, PoolIdLookup } from '../generated/schema';
import { GAME_MANAGER_ADDRESS } from './utils/constants';

export function handlePoolFundedEvent(event: PoolFundedEvent): void {
  // const isGameManager = event.params.poolId === GAME_MANAGER_POOL_ID;
  // if (!isGameManager) return;
  // let gameManager = GameManager.load(GAME_MANAGER_ADDRESS);
  // if (gameManager == null) return;
  // gameManager.poolFunds = gameManager.poolFunds.plus(event.params.amount);
  // gameManager.save();
}
