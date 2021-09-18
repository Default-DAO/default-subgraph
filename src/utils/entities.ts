import { Address, Bytes } from '@graphprotocol/graph-ts'

import { 
  Member, 
  EndorsementMemberInfo,
  Endorsement,
  EpochMemberInfo,
  DefaultOS,
  Epoch,
  AllocationMemberInfo,
  Vault,
} from '../../generated/schema';

import { BIGDECIMAL_ZERO, DEFAULT_DECIMALS } from './constants';
import { generateId } from './helpers'

/*
  If this file becomes bloated we may need separate files
  for each entity. We can define that as src/entities/Members.ts etc.

*/

export function getOrCreateOs(address: Address, name: string = null): DefaultOS {
  let id = address.toHexString()
  let os = DefaultOS.load(id)
  if (os === null) {
    os = new DefaultOS(id);
    os.name = name !== null ? name : id // default to address if no name
  }
  return os as DefaultOS
}

export function getOrCreateEpoch(os: Address, epochNumber: i32): Epoch {
  let id = generateId([os.toHexString(), epochNumber as string])
  let epoch = Epoch.load(id)
  if (epoch === null) {
    epoch.os = getOrCreateOs(os).id
    epoch.staked = BIGDECIMAL_ZERO
  }
  return epoch as Epoch
}

export function getOrCreateMember(
  osAddress: Address, 
  address: Address, 
  alias: Bytes = null,
  epoch: i32 = null,
): Member {
  let id = generateId([osAddress.toHexString(), address.toHexString()])
  let member = Member.load(id)
  if (member === null) {
    member = new Member(id);
    member.address = address.toHexString();
    member.os = getOrCreateOs(osAddress).id
    member.epoch = getOrCreateEpoch(osAddress, epoch).id;
    member.alias = alias ? alias.toHexString() : address.toHexString() // default to address if no alias
    member.stakedAmt = BIGDECIMAL_ZERO;
    member.miningRewards = BIGDECIMAL_ZERO;
    member.bonus = BIGDECIMAL_ZERO;
    member.peerRewards = BIGDECIMAL_ZERO;
  }
  return member as Member
}

export function getOrCreateEndorsementMemInfo(
  osAddress: Address,
  address: Address, 
  epoch: i32,
): EndorsementMemberInfo {
  let id = generateId([osAddress.toHexString(), address.toHexString(), epoch as string])
  let endorseInfo = EndorsementMemberInfo.load(id);
  if (endorseInfo === null) {
    endorseInfo = new EndorsementMemberInfo(id);
    endorseInfo.member = getOrCreateMember(osAddress, address).id;
    endorseInfo.epoch = epoch;
    endorseInfo.endorsementReceivedAmt = BIGDECIMAL_ZERO;
    endorseInfo.endorsementGivenAmt = BIGDECIMAL_ZERO;
  }
  return endorseInfo as EndorsementMemberInfo;
}

export function getOrCreateEndorsement(
  os: Address,
  toAddress: Address,
  fromAddress: Address,
  epoch: i32,
): Endorsement {
  let id = generateId([toAddress.toHexString(), fromAddress.toHexString(), epoch as string])
  let endorsement = Endorsement.load(id)
  if (endorsement === null) {
    let toMember = getOrCreateEndorsementMemInfo(os, toAddress, epoch)
    let fromMember = getOrCreateEndorsementMemInfo(os, fromAddress, epoch)
    endorsement = new Endorsement(id)
    endorsement.amount = BIGDECIMAL_ZERO
    endorsement.epoch = epoch
    endorsement.to = toMember.id
    endorsement.from = fromMember.id
  }
  return endorsement as Endorsement;
}

export function getOrCreateEpochMemberInfo(
  os: Address, 
  member: Address,
  epoch: i32,
): EpochMemberInfo {
  let epochMemberInfoId = generateId([os.toHexString(), member.toHexString(), epoch as string])
  let epochMemberInfo = EpochMemberInfo.load(epochMemberInfoId)
  if (epochMemberInfo === null) {
    epochMemberInfo = new EpochMemberInfo(epochMemberInfoId)
    epochMemberInfo.os = os.toHexString()
    epochMemberInfo.member = member.toHexString()
    epochMemberInfo.epoch = epoch
    epochMemberInfo.staked = BIGDECIMAL_ZERO
    epochMemberInfo.miningRewards = BIGDECIMAL_ZERO
    epochMemberInfo.bonus = BIGDECIMAL_ZERO
    epochMemberInfo.peerRewards = BIGDECIMAL_ZERO
  }
  return epochMemberInfo as EpochMemberInfo
}

export function getOrCreateAllocationMemberInfo(
  osAddress: Address, 
  address: Address, 
  currentEpoch: i32
): AllocationMemberInfo {
  let id = generateId([osAddress.toHexString(), currentEpoch as string, address.toHexString()])
  let info = AllocationMemberInfo.load(id)
  if (info === null) {
    info = new AllocationMemberInfo(id)
    info.os = getOrCreateOs(osAddress).id
    info.epoch = currentEpoch
    info.member = address.toHexString()
    info.allocationGivenAmt = BIGDECIMAL_ZERO
    info.allocationReceivedAmt = BIGDECIMAL_ZERO
  }
  return info as AllocationMemberInfo
}

export function getOrCreateVault(
  osAddress: Address, 
  vaultAddress: Address,
  name: string = null,
  symbol: string = null,
  decimals: i32 = null,
  fee: i32 = null
): Vault {
  let id = generateId([osAddress.toHexString(), vaultAddress.toHexString()])
  let vault = Vault.load(id)
  if (vault === null) {
    vault.os = getOrCreateOs(osAddress).id
    vault.name = name ? name : vaultAddress.toHexString();
    vault.symbol = symbol ? symbol : '?'
    vault.decimals = decimals ? decimals : DEFAULT_DECIMALS
    vault.fee = fee !== null ? fee : 0
    vault.amount = BIGDECIMAL_ZERO
  }
  return vault as Vault
}