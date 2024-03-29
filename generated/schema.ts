// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class Project extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Project entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Project must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Project", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Project | null {
    return changetype<Project | null>(
      store.get_in_block("Project", id.toHexString()),
    );
  }

  static load(id: Bytes): Project | null {
    return changetype<Project | null>(store.get("Project", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get profileId(): Bytes {
    let value = this.get("profileId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set profileId(value: Bytes) {
    this.set("profileId", Value.fromBytes(value));
  }

  get nonce(): BigInt {
    let value = this.get("nonce");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set nonce(value: BigInt) {
    this.set("nonce", Value.fromBigInt(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get metadata_protocol(): BigInt {
    let value = this.get("metadata_protocol");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set metadata_protocol(value: BigInt) {
    this.set("metadata_protocol", Value.fromBigInt(value));
  }

  get metadata_pointer(): string {
    let value = this.get("metadata_pointer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set metadata_pointer(value: string) {
    this.set("metadata_pointer", Value.fromString(value));
  }

  get metadata(): string | null {
    let value = this.get("metadata");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set metadata(value: string | null) {
    if (!value) {
      this.unset("metadata");
    } else {
      this.set("metadata", Value.fromString(<string>value));
    }
  }

  get owner(): Bytes {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get anchor(): Bytes {
    let value = this.get("anchor");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set anchor(value: Bytes) {
    this.set("anchor", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get members(): Bytes | null {
    let value = this.get("members");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set members(value: Bytes | null) {
    if (!value) {
      this.unset("members");
    } else {
      this.set("members", Value.fromBytes(<Bytes>value));
    }
  }
}

export class ProjectMetadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProjectMetadata entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ProjectMetadata must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ProjectMetadata", id.toString(), this);
    }
  }

  static loadInBlock(id: string): ProjectMetadata | null {
    return changetype<ProjectMetadata | null>(
      store.get_in_block("ProjectMetadata", id),
    );
  }

  static load(id: string): ProjectMetadata | null {
    return changetype<ProjectMetadata | null>(store.get("ProjectMetadata", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (!value) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(<string>value));
    }
  }

  get avatarHash_IPFS(): string | null {
    let value = this.get("avatarHash_IPFS");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set avatarHash_IPFS(value: string | null) {
    if (!value) {
      this.unset("avatarHash_IPFS");
    } else {
      this.set("avatarHash_IPFS", Value.fromString(<string>value));
    }
  }

  get email(): string | null {
    let value = this.get("email");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set email(value: string | null) {
    if (!value) {
      this.unset("email");
    } else {
      this.set("email", Value.fromString(<string>value));
    }
  }

  get x(): string | null {
    let value = this.get("x");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set x(value: string | null) {
    if (!value) {
      this.unset("x");
    } else {
      this.set("x", Value.fromString(<string>value));
    }
  }

  get github(): string | null {
    let value = this.get("github");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set github(value: string | null) {
    if (!value) {
      this.unset("github");
    } else {
      this.set("github", Value.fromString(<string>value));
    }
  }

  get discord(): string | null {
    let value = this.get("discord");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set discord(value: string | null) {
    if (!value) {
      this.unset("discord");
    } else {
      this.set("discord", Value.fromString(<string>value));
    }
  }

  get telegram(): string | null {
    let value = this.get("telegram");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set telegram(value: string | null) {
    if (!value) {
      this.unset("telegram");
    } else {
      this.set("telegram", Value.fromString(<string>value));
    }
  }

  get website(): string | null {
    let value = this.get("website");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set website(value: string | null) {
    if (!value) {
      this.unset("website");
    } else {
      this.set("website", Value.fromString(<string>value));
    }
  }
}

export class ShipProfile extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ShipProfile entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type ShipProfile must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ShipProfile", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): ShipProfile | null {
    return changetype<ShipProfile | null>(
      store.get_in_block("ShipProfile", id.toHexString()),
    );
  }

  static load(id: Bytes): ShipProfile | null {
    return changetype<ShipProfile | null>(
      store.get("ShipProfile", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get profileId(): Bytes {
    let value = this.get("profileId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set profileId(value: Bytes) {
    this.set("profileId", Value.fromBytes(value));
  }

  get nonce(): BigInt {
    let value = this.get("nonce");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set nonce(value: BigInt) {
    this.set("nonce", Value.fromBigInt(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get metadata_protocol(): BigInt {
    let value = this.get("metadata_protocol");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set metadata_protocol(value: BigInt) {
    this.set("metadata_protocol", Value.fromBigInt(value));
  }

  get metadata_pointer(): string {
    let value = this.get("metadata_pointer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set metadata_pointer(value: string) {
    this.set("metadata_pointer", Value.fromString(value));
  }

  get metadata(): string {
    let value = this.get("metadata");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set metadata(value: string) {
    this.set("metadata", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get anchor(): Bytes {
    let value = this.get("anchor");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set anchor(value: Bytes) {
    this.set("anchor", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get alloProfileMembers(): Bytes | null {
    let value = this.get("alloProfileMembers");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set alloProfileMembers(value: Bytes | null) {
    if (!value) {
      this.unset("alloProfileMembers");
    } else {
      this.set("alloProfileMembers", Value.fromBytes(<Bytes>value));
    }
  }
}

export class ShipProfileMetadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ShipProfileMetadata entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ShipProfileMetadata must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ShipProfileMetadata", id.toString(), this);
    }
  }

  static loadInBlock(id: string): ShipProfileMetadata | null {
    return changetype<ShipProfileMetadata | null>(
      store.get_in_block("ShipProfileMetadata", id),
    );
  }

  static load(id: string): ShipProfileMetadata | null {
    return changetype<ShipProfileMetadata | null>(
      store.get("ShipProfileMetadata", id),
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get mission(): string | null {
    let value = this.get("mission");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set mission(value: string | null) {
    if (!value) {
      this.unset("mission");
    } else {
      this.set("mission", Value.fromString(<string>value));
    }
  }

  get avatarHash_IPFS(): string | null {
    let value = this.get("avatarHash_IPFS");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set avatarHash_IPFS(value: string | null) {
    if (!value) {
      this.unset("avatarHash_IPFS");
    } else {
      this.set("avatarHash_IPFS", Value.fromString(<string>value));
    }
  }

  get email(): string | null {
    let value = this.get("email");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set email(value: string | null) {
    if (!value) {
      this.unset("email");
    } else {
      this.set("email", Value.fromString(<string>value));
    }
  }

  get x(): string | null {
    let value = this.get("x");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set x(value: string | null) {
    if (!value) {
      this.unset("x");
    } else {
      this.set("x", Value.fromString(<string>value));
    }
  }

  get github(): string | null {
    let value = this.get("github");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set github(value: string | null) {
    if (!value) {
      this.unset("github");
    } else {
      this.set("github", Value.fromString(<string>value));
    }
  }

  get discord(): string | null {
    let value = this.get("discord");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set discord(value: string | null) {
    if (!value) {
      this.unset("discord");
    } else {
      this.set("discord", Value.fromString(<string>value));
    }
  }

  get telegram(): string | null {
    let value = this.get("telegram");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set telegram(value: string | null) {
    if (!value) {
      this.unset("telegram");
    } else {
      this.set("telegram", Value.fromString(<string>value));
    }
  }

  get website(): string | null {
    let value = this.get("website");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set website(value: string | null) {
    if (!value) {
      this.unset("website");
    } else {
      this.set("website", Value.fromString(<string>value));
    }
  }
}

export class ProfileMemberGroup extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProfileMemberGroup entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type ProfileMemberGroup must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ProfileMemberGroup", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): ProfileMemberGroup | null {
    return changetype<ProfileMemberGroup | null>(
      store.get_in_block("ProfileMemberGroup", id.toHexString()),
    );
  }

  static load(id: Bytes): ProfileMemberGroup | null {
    return changetype<ProfileMemberGroup | null>(
      store.get("ProfileMemberGroup", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get addresses(): Array<Bytes> | null {
    let value = this.get("addresses");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set addresses(value: Array<Bytes> | null) {
    if (!value) {
      this.unset("addresses");
    } else {
      this.set("addresses", Value.fromBytesArray(<Array<Bytes>>value));
    }
  }
}

export class Transaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Transaction entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Transaction must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Transaction", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Transaction | null {
    return changetype<Transaction | null>(
      store.get_in_block("Transaction", id),
    );
  }

  static load(id: string): Transaction | null {
    return changetype<Transaction | null>(store.get("Transaction", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }
}
