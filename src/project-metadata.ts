import { json, Bytes, dataSource } from '@graphprotocol/graph-ts';
import { ProjectMetadata } from '../generated/schema';

export function handleProjectMetadata(content: Bytes): void {
  let projectMetadata = new ProjectMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();

  if (value) {
    const name = value.get('name');
    const description = value.get('description');
    const avatarHash_IPFS = value.get('avatarHash_IPFS');
    const email = value.get('email');
    const x = value.get('x');
    const github = value.get('github');
    const discord = value.get('discord');
    const telegram = value.get('telegram');

    projectMetadata.name = name ? name.toString() : null;
    projectMetadata.description = description ? description.toString() : null;
    projectMetadata.avatarHash_IPFS = avatarHash_IPFS
      ? avatarHash_IPFS.toString()
      : null;
    projectMetadata.email = email ? email.toString() : null;
    projectMetadata.x = x ? x.toString() : null;
    projectMetadata.github = github ? github.toString() : null;
    projectMetadata.discord = discord ? discord.toString() : null;
    projectMetadata.telegram = telegram ? telegram.toString() : null;

    projectMetadata.save();
  }
}
