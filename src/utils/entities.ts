import { Address, Bytes } from '@graphprotocol/graph-ts'

import { 
  Member, 
  Endorsement,
  DefaultOS,
  Epoch,
  Vault,
  Module,
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
    epoch = new Epoch(id)
    epoch.os = getOrCreateOs(os).id
    epoch.staked = BIGDECIMAL_ZERO
    epoch.number = epochNumber
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

export function getOrCreateEndorsement(
  os: Address,
  toAddress: Address,
  fromAddress: Address,
  epoch: i32,
): Endorsement {
  let id = generateId([toAddress.toHexString(), fromAddress.toHexString(), epoch as string])
  let endorsement = Endorsement.load(id)
  if (endorsement === null) {
    endorsement = new Endorsement(id)
    endorsement.amount = BIGDECIMAL_ZERO
    endorsement.epochNumber = epoch
    endorsement.to = getOrCreateMember(os, toAddress).id
    endorsement.from = getOrCreateMember(os, fromAddress).id
  }
  return endorsement as Endorsement;
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
    vault = new Vault(id)
    vault.os = getOrCreateOs(osAddress).id
    vault.name = name ? name : vaultAddress.toHexString();
    vault.symbol = symbol ? symbol : '?'
    vault.decimals = decimals ? decimals : DEFAULT_DECIMALS
    vault.fee = fee !== null ? fee : 0
    vault.amount = BIGDECIMAL_ZERO
  }
  return vault as Vault
}

export function getOrCreateModule(os: Address, moduleKeyCode: string): Module {
  let id = generateId([os.toHexString(), moduleKeyCode])
  let mod = Module.load(id)
  if (mod === null) {
    mod = new Module(id)
    mod.os = getOrCreateOs(os).id
    mod.keycode = moduleKeyCode
  }
  return mod as Module
}