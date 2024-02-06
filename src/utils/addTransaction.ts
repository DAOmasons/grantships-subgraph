import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { Transaction } from '../../generated/schema';

export function addTransaction(
  block: ethereum.Block,
  tx: ethereum.Transaction
): void {
  let transaction = new Transaction(tx.hash.toHex());
  transaction.blockNumber = block.number;
  transaction.txHash = tx.hash;
  transaction.sender = tx.from;
  transaction.save();
}
