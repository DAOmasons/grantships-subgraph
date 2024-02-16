import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  FeedItem,
  FeedItemEntity,
  FeedItemEmbed,
} from '../../generated/schema';

class FeedSubject {
  id: string;
  type: string;
  name: string;
}

class FeedObject {
  id: string;
  type: string;
  name: string;
}

class Embed {
  key: string | null;
  pointer: string | null;
  protocol: BigInt | null;
  content: string | null;
}

class FeedItemArgs {
  tx: ethereum.Transaction;
  timestamp: BigInt;
  content: string;
  postIndex: number; // Assuming i32 is the integer type you're using, nullable if necessary
  tag: string;
  subjectMetadataPointer: string;
  details: string | null;
  subject: FeedSubject;
  object: FeedObject | null;
  embed: Embed | null;
}

export const addFeedItem = (feedArgs: FeedItemArgs): void => {
  let entityId = `${feedArgs.tag}-${feedArgs.tx.hash.toHex()}-${
    feedArgs.postIndex
  }`;
  let feedItem = new FeedItem(entityId);
  feedItem.timestamp = feedArgs.timestamp;
  feedItem.sender = feedArgs.tx.from;
  feedItem.tag = (feedArgs.tag !== null ? feedArgs.tag : 'general') as string;
  feedItem.content = feedArgs.content;
  feedItem.details = feedArgs.details || null;

  let subjectEntity = new FeedItemEntity(entityId);

  let subject = feedArgs.subject;
  subjectEntity.id = subject.id;
  subjectEntity.type = subject.type;
  subjectEntity.name = subject.name;
  feedItem.subject = subject.id;
  subjectEntity.save();

  let object = feedArgs.object;
  if (object) {
    let objectEntity = new FeedItemEntity(entityId);
    objectEntity.id = object.id;
    objectEntity.type = object.type;
    objectEntity.name = object.name;
    feedItem.object = object.id;
    objectEntity.save();
  }
  let embed = feedArgs.embed;
  if (embed) {
    let embed = new FeedItemEmbed(entityId);
    embed.key = embed.key;
    embed.pointer = embed.pointer;
    embed.protocol = embed.protocol;
    embed.content = embed.content;
    feedItem.embed = embed.id;
    embed.save();
  }
  feedItem.save();
};

export const inWeiMarker = (value: BigInt): string => {
  return `##IN-WEI${value}##`;
};
