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

    if (
      name &&
      description &&
      avatarHash_IPFS &&
      email &&
      x &&
      github &&
      discord &&
      telegram
    ) {
      projectMetadata.name = name.toString();
      projectMetadata.description = description.toString();
      projectMetadata.avatarHash_IPFS = avatarHash_IPFS.toString();
      projectMetadata.email = email.toString();
      projectMetadata.x = x.toString();
      projectMetadata.github = github.toString();
      projectMetadata.discord = discord.toString();
      projectMetadata.telegram = telegram.toString();
    }

    projectMetadata.save();
  }
}
