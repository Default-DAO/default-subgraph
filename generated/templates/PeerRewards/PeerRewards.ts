// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AllocationGiven extends ethereum.Event {
  get params(): AllocationGiven__Params {
    return new AllocationGiven__Params(this);
  }
}

export class AllocationGiven__Params {
  _event: AllocationGiven;

  constructor(event: AllocationGiven) {
    this._event = event;
  }

  get fromMember(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get toMember(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get allocGiven(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get currentEpoch(): i32 {
    return this._event.parameters[3].value.toI32();
  }
}

export class AllocationSet extends ethereum.Event {
  get params(): AllocationSet__Params {
    return new AllocationSet__Params(this);
  }
}

export class AllocationSet__Params {
  _event: AllocationSet;

  constructor(event: AllocationSet) {
    this._event = event;
  }

  get fromMember(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get toMember(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get allocPts(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class MemberRegistered extends ethereum.Event {
  get params(): MemberRegistered__Params {
    return new MemberRegistered__Params(this);
  }
}

export class MemberRegistered__Params {
  _event: MemberRegistered;

  constructor(event: MemberRegistered) {
    this._event = event;
  }

  get member(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get epochRegisteredFor(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get ptsRegistered(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class RewardsClaimed extends ethereum.Event {
  get params(): RewardsClaimed__Params {
    return new RewardsClaimed__Params(this);
  }
}

export class RewardsClaimed__Params {
  _event: RewardsClaimed;

  constructor(event: RewardsClaimed) {
    this._event = event;
  }

  get member(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get totalRewardsClaimed(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get epochClaimed(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class PeerRewards__getAllocationsListForResult {
  value0: i32;
  value1: i32;
  value2: i32;
  value3: i32;
  value4: Address;

  constructor(
    value0: i32,
    value1: i32,
    value2: i32,
    value3: i32,
    value4: Address
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set(
      "value0",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value0))
    );
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1))
    );
    map.set(
      "value2",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value2))
    );
    map.set(
      "value3",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value3))
    );
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    return map;
  }
}

export class PeerRewards extends ethereum.SmartContract {
  static bind(address: Address): PeerRewards {
    return new PeerRewards("PeerRewards", address);
  }

  CONTRIBUTOR_EPOCH_REWARDS(): BigInt {
    let result = super.call(
      "CONTRIBUTOR_EPOCH_REWARDS",
      "CONTRIBUTOR_EPOCH_REWARDS():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_CONTRIBUTOR_EPOCH_REWARDS(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "CONTRIBUTOR_EPOCH_REWARDS",
      "CONTRIBUTOR_EPOCH_REWARDS():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  MAX_ALLOC_PCTG(): i32 {
    let result = super.call("MAX_ALLOC_PCTG", "MAX_ALLOC_PCTG():(uint8)", []);

    return result[0].toI32();
  }

  try_MAX_ALLOC_PCTG(): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "MAX_ALLOC_PCTG",
      "MAX_ALLOC_PCTG():(uint8)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  MIN_ALLOC_PCTG(): i32 {
    let result = super.call("MIN_ALLOC_PCTG", "MIN_ALLOC_PCTG():(uint8)", []);

    return result[0].toI32();
  }

  try_MIN_ALLOC_PCTG(): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "MIN_ALLOC_PCTG",
      "MIN_ALLOC_PCTG():(uint8)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  PARTICIPATION_THRESHOLD(): BigInt {
    let result = super.call(
      "PARTICIPATION_THRESHOLD",
      "PARTICIPATION_THRESHOLD():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_PARTICIPATION_THRESHOLD(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "PARTICIPATION_THRESHOLD",
      "PARTICIPATION_THRESHOLD():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  REWARDS_THRESHOLD(): BigInt {
    let result = super.call(
      "REWARDS_THRESHOLD",
      "REWARDS_THRESHOLD():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_REWARDS_THRESHOLD(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "REWARDS_THRESHOLD",
      "REWARDS_THRESHOLD():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  _OS(): Address {
    let result = super.call("_OS", "_OS():(address)", []);

    return result[0].toAddress();
  }

  try__OS(): ethereum.CallResult<Address> {
    let result = super.tryCall("_OS", "_OS():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  eligibleForRewards(param0: i32, param1: Address): boolean {
    let result = super.call(
      "eligibleForRewards",
      "eligibleForRewards(uint16,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return result[0].toBoolean();
  }

  try_eligibleForRewards(
    param0: i32,
    param1: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "eligibleForRewards",
      "eligibleForRewards(uint16,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getAllocationsListFor(
    param0: Address
  ): PeerRewards__getAllocationsListForResult {
    let result = super.call(
      "getAllocationsListFor",
      "getAllocationsListFor(address):(uint8,uint8,uint8,uint16,address)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new PeerRewards__getAllocationsListForResult(
      result[0].toI32(),
      result[1].toI32(),
      result[2].toI32(),
      result[3].toI32(),
      result[4].toAddress()
    );
  }

  try_getAllocationsListFor(
    param0: Address
  ): ethereum.CallResult<PeerRewards__getAllocationsListForResult> {
    let result = super.tryCall(
      "getAllocationsListFor",
      "getAllocationsListFor(address):(uint8,uint8,uint8,uint16,address)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new PeerRewards__getAllocationsListForResult(
        value[0].toI32(),
        value[1].toI32(),
        value[2].toI32(),
        value[3].toI32(),
        value[4].toAddress()
      )
    );
  }

  lastEpochClaimed(param0: Address): i32 {
    let result = super.call(
      "lastEpochClaimed",
      "lastEpochClaimed(address):(uint16)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toI32();
  }

  try_lastEpochClaimed(param0: Address): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "lastEpochClaimed",
      "lastEpochClaimed(address):(uint16)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  mintableRewards(param0: i32, param1: Address): BigInt {
    let result = super.call(
      "mintableRewards",
      "mintableRewards(uint16,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_mintableRewards(
    param0: i32,
    param1: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "mintableRewards",
      "mintableRewards(uint16,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  participationHistory(param0: i32, param1: Address): boolean {
    let result = super.call(
      "participationHistory",
      "participationHistory(uint16,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return result[0].toBoolean();
  }

  try_participationHistory(
    param0: i32,
    param1: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "participationHistory",
      "participationHistory(uint16,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  participationStreak(param0: Address): i32 {
    let result = super.call(
      "participationStreak",
      "participationStreak(address):(uint16)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toI32();
  }

  try_participationStreak(param0: Address): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "participationStreak",
      "participationStreak(address):(uint16)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  pointsRegisteredForEpoch(param0: i32, param1: Address): BigInt {
    let result = super.call(
      "pointsRegisteredForEpoch",
      "pointsRegisteredForEpoch(uint16,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_pointsRegisteredForEpoch(
    param0: i32,
    param1: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "pointsRegisteredForEpoch",
      "pointsRegisteredForEpoch(uint16,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0)),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalPointsRegisteredForEpoch(param0: i32): BigInt {
    let result = super.call(
      "totalPointsRegisteredForEpoch",
      "totalPointsRegisteredForEpoch(uint16):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))]
    );

    return result[0].toBigInt();
  }

  try_totalPointsRegisteredForEpoch(param0: i32): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalPointsRegisteredForEpoch",
      "totalPointsRegisteredForEpoch(uint16):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get os_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ClaimRewardsCall extends ethereum.Call {
  get inputs(): ClaimRewardsCall__Inputs {
    return new ClaimRewardsCall__Inputs(this);
  }

  get outputs(): ClaimRewardsCall__Outputs {
    return new ClaimRewardsCall__Outputs(this);
  }
}

export class ClaimRewardsCall__Inputs {
  _call: ClaimRewardsCall;

  constructor(call: ClaimRewardsCall) {
    this._call = call;
  }
}

export class ClaimRewardsCall__Outputs {
  _call: ClaimRewardsCall;

  constructor(call: ClaimRewardsCall) {
    this._call = call;
  }
}

export class CommitAllocationCall extends ethereum.Call {
  get inputs(): CommitAllocationCall__Inputs {
    return new CommitAllocationCall__Inputs(this);
  }

  get outputs(): CommitAllocationCall__Outputs {
    return new CommitAllocationCall__Outputs(this);
  }
}

export class CommitAllocationCall__Inputs {
  _call: CommitAllocationCall;

  constructor(call: CommitAllocationCall) {
    this._call = call;
  }
}

export class CommitAllocationCall__Outputs {
  _call: CommitAllocationCall;

  constructor(call: CommitAllocationCall) {
    this._call = call;
  }
}

export class ConfigureAllocationCall extends ethereum.Call {
  get inputs(): ConfigureAllocationCall__Inputs {
    return new ConfigureAllocationCall__Inputs(this);
  }

  get outputs(): ConfigureAllocationCall__Outputs {
    return new ConfigureAllocationCall__Outputs(this);
  }
}

export class ConfigureAllocationCall__Inputs {
  _call: ConfigureAllocationCall;

  constructor(call: ConfigureAllocationCall) {
    this._call = call;
  }

  get toMember_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get newAllocPts_(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class ConfigureAllocationCall__Outputs {
  _call: ConfigureAllocationCall;

  constructor(call: ConfigureAllocationCall) {
    this._call = call;
  }
}

export class RegisterCall extends ethereum.Call {
  get inputs(): RegisterCall__Inputs {
    return new RegisterCall__Inputs(this);
  }

  get outputs(): RegisterCall__Outputs {
    return new RegisterCall__Outputs(this);
  }
}

export class RegisterCall__Inputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }
}

export class RegisterCall__Outputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetContributorEpochRewardsCall extends ethereum.Call {
  get inputs(): SetContributorEpochRewardsCall__Inputs {
    return new SetContributorEpochRewardsCall__Inputs(this);
  }

  get outputs(): SetContributorEpochRewardsCall__Outputs {
    return new SetContributorEpochRewardsCall__Outputs(this);
  }
}

export class SetContributorEpochRewardsCall__Inputs {
  _call: SetContributorEpochRewardsCall;

  constructor(call: SetContributorEpochRewardsCall) {
    this._call = call;
  }

  get newEpochRewards_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetContributorEpochRewardsCall__Outputs {
  _call: SetContributorEpochRewardsCall;

  constructor(call: SetContributorEpochRewardsCall) {
    this._call = call;
  }
}

export class SetMaxAllocPctgCall extends ethereum.Call {
  get inputs(): SetMaxAllocPctgCall__Inputs {
    return new SetMaxAllocPctgCall__Inputs(this);
  }

  get outputs(): SetMaxAllocPctgCall__Outputs {
    return new SetMaxAllocPctgCall__Outputs(this);
  }
}

export class SetMaxAllocPctgCall__Inputs {
  _call: SetMaxAllocPctgCall;

  constructor(call: SetMaxAllocPctgCall) {
    this._call = call;
  }

  get newMaxAllocPctg_(): i32 {
    return this._call.inputValues[0].value.toI32();
  }
}

export class SetMaxAllocPctgCall__Outputs {
  _call: SetMaxAllocPctgCall;

  constructor(call: SetMaxAllocPctgCall) {
    this._call = call;
  }
}

export class SetMinAllocPctgCall extends ethereum.Call {
  get inputs(): SetMinAllocPctgCall__Inputs {
    return new SetMinAllocPctgCall__Inputs(this);
  }

  get outputs(): SetMinAllocPctgCall__Outputs {
    return new SetMinAllocPctgCall__Outputs(this);
  }
}

export class SetMinAllocPctgCall__Inputs {
  _call: SetMinAllocPctgCall;

  constructor(call: SetMinAllocPctgCall) {
    this._call = call;
  }

  get newMinAllocPctg_(): i32 {
    return this._call.inputValues[0].value.toI32();
  }
}

export class SetMinAllocPctgCall__Outputs {
  _call: SetMinAllocPctgCall;

  constructor(call: SetMinAllocPctgCall) {
    this._call = call;
  }
}

export class SetParticipationThresholdCall extends ethereum.Call {
  get inputs(): SetParticipationThresholdCall__Inputs {
    return new SetParticipationThresholdCall__Inputs(this);
  }

  get outputs(): SetParticipationThresholdCall__Outputs {
    return new SetParticipationThresholdCall__Outputs(this);
  }
}

export class SetParticipationThresholdCall__Inputs {
  _call: SetParticipationThresholdCall;

  constructor(call: SetParticipationThresholdCall) {
    this._call = call;
  }

  get newThreshold_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetParticipationThresholdCall__Outputs {
  _call: SetParticipationThresholdCall;

  constructor(call: SetParticipationThresholdCall) {
    this._call = call;
  }
}

export class SetRewardsThresholdCall extends ethereum.Call {
  get inputs(): SetRewardsThresholdCall__Inputs {
    return new SetRewardsThresholdCall__Inputs(this);
  }

  get outputs(): SetRewardsThresholdCall__Outputs {
    return new SetRewardsThresholdCall__Outputs(this);
  }
}

export class SetRewardsThresholdCall__Inputs {
  _call: SetRewardsThresholdCall;

  constructor(call: SetRewardsThresholdCall) {
    this._call = call;
  }

  get newThreshold_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetRewardsThresholdCall__Outputs {
  _call: SetRewardsThresholdCall;

  constructor(call: SetRewardsThresholdCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
