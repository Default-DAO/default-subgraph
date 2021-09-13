import { BigDecimal } from '@graphprotocol/graph-ts';

import {
  RewardsIssued,
  RewardsClaimed,
  MemberRegistered
} from '../../generated/templates/Mining/Mining';
import {
  generateId,
} from '../utils/helpers';
import {
  MiningRegistration,
  Member,
  EpochMemberInfo,
  VaultEpochInfo
} from '../../generated/schema'

export function handleRewardsIssued(event: RewardsIssued): void {
  // TODO: add vault param to RewardsIssued event in Mining.sol contract!
  const { os, vault, issuer, currentEpoch, newRewardsPerShare, tokenBonus } = event.params
  const memberBonus = new BigDecimal(tokenBonus)

  const vaultEpochInfo = new VaultEpochInfo(generateId(currentEpoch, vault))
  vaultEpochInfo.rewardsPerShare = new BigDecimal(newRewardsPerShare)

  const memberSchema = Member.load(issuer.toHexString())
  memberSchema.bonus = memberSchema.bonus.plus(memberBonus)

  const epochMemberSchema = EpochMemberInfo.load(generateId([os.toHexString(), currentEpoch, issuer.toHexString()]))
  epochMemberSchema.bonus = epochMemberSchema.bonus.plus(memberBonus)

  vaultEpochInfo.save()
  memberSchema.save()
  epochMemberSchema.save()
}

export function handleRewardsClaimed(event: RewardsClaimed): void {
  const { os, epochClaimed, member, totalRewardsClaimed } = event.params

  const reward = new BigDecimal(totalRewardsClaimed)

  const memberSchema = Member.load(member.toHexString())
  memberSchema.miningRewards = memberSchema.miningRewards.plus(reward)

  const epochMemberSchema = EpochMemberInfo.load(generateId([os.toHexString(), epochClaimed, member.toHexString()]))
  epochMemberSchema.miningRewards = epochMemberSchema.miningRewards.plus(reward)

  memberSchema.save()
  epochMemberSchema.save()
}

export function handleMemberRegistered(event: MemberRegistered): void {
  const { os, currentEpoch, member } = event.params

  const registration = new MiningRegistration(generateId([os.toHexString(), currentEpoch, member.toHexString()])) // should member be address or id?

  registration.epoch = currentEpoch
  registration.member = Member.load(member.toHexString()).id
  registration.os = os.toHexString()

  registration.save()
}