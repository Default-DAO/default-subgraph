import { Address, BigDecimal, Bytes } from '@graphprotocol/graph-ts'

import { 
  Member, 
  Endorsement,
  DefaultOS,
  Epoch,
  Vault,
  Module,
  Allocation,
  DefaultOSFactory
} from '../../generated/schema';

import { BIGDECIMAL_ZERO, DEFAULT_DECIMALS } from './constants';
import { generateId } from './helpers'

/*
  If this file becomes bloated we may need separate files
  for each entity. We can define that as src/entities/Members.ts etc.

*/

export function getOrCreateFactory(id: string): DefaultOSFactory {  
  let factory = DefaultOSFactory.load(id);
  if (factory === null) {
    factory = new DefaultOSFactory(id);
    factory.osCount = 0;
  };

  return factory;
}

export function getOrCreateOs(address: Address, name: string = address.toHexString()): DefaultOS {
  let id = address.toHexString();
  let os = DefaultOS.load(id);
  if (os === null) {
    os = new DefaultOS(id);
    os.name = name; // default to address if no name
  };

  return os as DefaultOS;
}

export function getOrCreateEpoch(os: Address, epochNumber: i32): Epoch {
  let id = generateId([os.toHexString(), epochNumber.toString()]);
  let epoch = Epoch.load(id);
  if (epoch === null) {
    epoch = new Epoch(id);
    epoch.os = getOrCreateOs(os).id;
    epoch.staked = BIGDECIMAL_ZERO;
    epoch.number = epochNumber;
  };

  return epoch as Epoch;
}

export function getOrCreateMember(
  osAddress: Address, 
  address: Address, 
  alias: Bytes = address,
  epoch: i32 = 0,
): Member {
  let id = generateId([osAddress.toHexString(), address.toHexString()]);
  let member = Member.load(id);
  if (member === null) {
    member = new Member(id);
    member.address = address.toHexString();
    member.os = getOrCreateOs(osAddress).id;
    member.epoch = getOrCreateEpoch(osAddress, epoch).id;
    member.alias = alias.toString()
    member.stakedAmt = BIGDECIMAL_ZERO;
    member.miningRewards = BIGDECIMAL_ZERO;
    member.bonus = BIGDECIMAL_ZERO;
    member.peerRewards = BIGDECIMAL_ZERO;
    member.endorsementsReceived = BIGDECIMAL_ZERO
  }

  return member as Member;
}

export function getOrCreateEndorsement(
  os: Address,
  toAddress: Address,
  fromAddress: Address,
  epoch: i32,
): Endorsement {
  let id = generateId([os.toHexString(), epoch.toString(), fromAddress.toHexString(), toAddress.toHexString()])
  let endorsement = Endorsement.load(id)
  if (endorsement === null) {
    endorsement = new Endorsement(id)
    endorsement.os = getOrCreateOs(os).id
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
  name: string = vaultAddress.toHexString(),
  symbol: string = '?',
  decimals: i32 = DEFAULT_DECIMALS,
  fee: i32 = 0
): Vault {
  let id = generateId([osAddress.toHexString(), vaultAddress.toHexString()]);
  let vault = Vault.load(id);
  if (vault === null) {
    vault = new Vault(id);
    vault.os = getOrCreateOs(osAddress).id;
    vault.name = name;
    vault.symbol = symbol;
    vault.decimals = decimals;
    vault.fee = fee;
    vault.amount = BIGDECIMAL_ZERO;
  }

  return vault as Vault;
}

export function getOrCreateAllocation(
  os: Address,
  fromMember: Address, 
  toMember: Address,   
  epochNumber: i32,    
  points: BigDecimal = BIGDECIMAL_ZERO
): Allocation {
  let id = generateId([os.toHexString(), epochNumber.toString(), fromMember.toHexString(), toMember.toHexString()])
  let allocation = Allocation.load(id)
  if (allocation == null) {
    allocation = new Allocation(id);
    allocation.committed = false;
    allocation.epochNumber = epochNumber;
    allocation.os = os.toHexString();
    allocation.from = getOrCreateMember(os, fromMember).id
    allocation.to = getOrCreateMember(os, toMember).id
    allocation.points = points;
    allocation.rewards = BIGDECIMAL_ZERO;
  } 

  return allocation as Allocation;
}

export function getOrCreateModule(os: Address, module: Address, moduleKeyCode: string): Module {
  let id = generateId([os.toHexString(), moduleKeyCode]);
  let mod = Module.load(id);
  if (mod === null) {
    mod = new Module(id);
    mod.os = getOrCreateOs(os).id;
    mod.address = module.toHexString();
    mod.keycode = moduleKeyCode;
  }

  return mod as Module;
}