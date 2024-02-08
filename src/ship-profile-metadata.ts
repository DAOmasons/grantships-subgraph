import { json, Bytes, dataSource } from '@graphprotocol/graph-ts';
// import { ShipProfileMetadata } from "../generated/schema";

export function handleShipProfileMetadata(content: Bytes): void {
  // let shipProfileMetadata = new ShipProfileMetadata(dataSource.stringParam());
  // const value = json.fromBytes(content).toObject();
  // if (value) {
  //   const name = value.get('name');
  //   const mission = value.get('mission');
  //   const avatarHash_IPFS = value.get('avatarHash_IPFS');
  //   const email = value.get('email');
  //   const x = value.get('x');
  //   const github = value.get('github');
  //   const discord = value.get('discord');
  //   const telegram = value.get('telegram');
  //   const website = value.get('website');
  //   shipProfileMetadata.name = name ? name.toString() : null;
  //   shipProfileMetadata.mission = mission ? mission.toString() : null;
  //   shipProfileMetadata.avatarHash_IPFS = avatarHash_IPFS
  //     ? avatarHash_IPFS.toString()
  //     : null;
  //   shipProfileMetadata.email = email ? email.toString() : null;
  //   shipProfileMetadata.x = x ? x.toString() : null;
  //   shipProfileMetadata.github = github ? github.toString() : null;
  //   shipProfileMetadata.discord = discord ? discord.toString() : null;
  //   shipProfileMetadata.telegram = telegram ? telegram.toString() : null;
  //   shipProfileMetadata.website = website ? website.toString() : null;
  //   shipProfileMetadata.save();
  // }
}
