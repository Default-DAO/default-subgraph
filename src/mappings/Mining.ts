import { BigDecimal, BigInt, Address } from '@graphprotocol/graph-ts';

import {
  RewardsIssued,
  RewardsClaimed,
  MemberRegistered
} from '../../generated/templates/Mining/Mining';
import {
  generateId,
} from '../utils/helpers';
import {
  BONUS,
} from '../utils/constants';
import {
  MiningRegistration,
  Member,
  EpochMemberInfo,
  VaultEpochInfo,
  TokenTransaction
} from '../../generated/schema'
import { v4 as uuidv4 } from 'uuid';

function getOrCreateEpochMemberInfo(os: Address, epoch: BigInt, member: Address): EpochMemberInfo {
  const epochMemberInfoId = generateId([os, epoch, member])
  let epochMemberInfo = EpochMemberInfo.load(epochMemberInfoId)
  if (epochMemberInfo === null) {
    epochMemberInfo = new EpochMemberInfo(epochMemberInfoId)
    epochMemberInfo.os = os.toHexString()
    epochMemberInfo.member = member.toHexString()
    epochMemberInfo.epoch = epoch
    epochMemberInfo.staked = new BigDecimal(new BigInt(0))
    epochMemberInfo.miningRewards = new BigDecimal(new BigInt(0))
    epochMemberInfo.bonus = new BigDecimal(new BigInt(0))
    epochMemberInfo.peerRewards = new BigDecimal(new BigInt(0))
  }
  return epochMemberInfo
}

export function handleRewardsIssued(event: RewardsIssued): void {
  // TODO: add vault param to RewardsIssued event in Mining.sol contract!
  const { os, vault, issuer, currentEpoch, newRewardsPerShare, tokenBonus } = event.params
  const memberBonus = new BigDecimal(tokenBonus)

  const memberSchema = Member.load(issuer.toHexString())
  memberSchema.bonus = memberSchema.bonus.plus(memberBonus)

  const tokenTransaction = new TokenTransaction(uuidv4())
  tokenTransaction.type = BONUS
  tokenTransaction.os = os.toHexString()
  tokenTransaction.epoch = currentEpoch
  tokenTransaction.from = os.toHexString()
  tokenTransaction.to = issuer.toHexString()
  tokenTransaction.amount = memberBonus

  const vaultEpochInfoId = generateId([currentEpoch, vault])
  let vaultEpochInfo = VaultEpochInfo.load(vaultEpochInfoId)
  if (vaultEpochInfo === null) {
    vaultEpochInfo = new VaultEpochInfo(vaultEpochInfoId)    
    vaultEpochInfo.epoch = currentEpoch    
    vaultEpochInfo.vault = vault.toHexString()
    vaultEpochInfo.amount = new BigDecimal(new BigInt(0))
    vaultEpochInfo.rewardsPerShare = new BigDecimal(new BigInt(0))
  }
  vaultEpochInfo.rewardsPerShare = new BigDecimal(newRewardsPerShare)

  const epochMemberInfo = getOrCreateEpochMemberInfo(os, currentEpoch, issuer)
  epochMemberInfo.bonus = epochMemberInfo.bonus.plus(memberBonus)

  tokenTransaction.save()
  memberSchema.save()
  vaultEpochInfo.save()
  epochMemberInfo.save()
}

export function handleRewardsClaimed(event: RewardsClaimed): void {
  const { os, epochClaimed, member, totalRewardsClaimed } = event.params

  const reward = new BigDecimal(totalRewardsClaimed)

  const tokenTransaction = new TokenTransaction(uuidv4())
  tokenTransaction.type = BONUS
  tokenTransaction.os = os.toHexString()
  tokenTransaction.epoch = epochClaimed
  tokenTransaction.from = os.toHexString()
  tokenTransaction.to = member.toHexString()
  tokenTransaction.amount = reward

  const memberSchema = Member.load(member.toHexString())
  memberSchema.miningRewards = memberSchema.miningRewards.plus(reward)

  const epochMemberInfo = getOrCreateEpochMemberInfo(os, epochClaimed, member)
  epochMemberInfo.miningRewards = epochMemberInfo.miningRewards.plus(reward)

  tokenTransaction.save()
  memberSchema.save()
  epochMemberInfo.save()
}

export function handleMemberRegistered(event: MemberRegistered): void {
  const { os, currentEpoch, member } = event.params

  const registration = new MiningRegistration(generateId([os, currentEpoch, member])) // should member be address or id?

  registration.epoch = currentEpoch
  registration.member = member.toHexString()
  registration.os = os.toHexString()

  registration.save()
}