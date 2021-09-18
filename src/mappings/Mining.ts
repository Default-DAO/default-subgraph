import { BigDecimal } from '@graphprotocol/graph-ts';

import {
  RewardsIssued,
  RewardsClaimed,
  MemberRegistered
} from '../../generated/templates/Mining/Mining';
import {
  generateEventId,
  generateId,
} from '../utils/helpers';
import {
  BONUS,
  BIGDECIMAL_ZERO,
} from '../utils/constants';
import { 
  getOrCreateEpoch,
  getOrCreateEpochMemberInfo, 
  getOrCreateMember,
  getOrCreateOs,
} from '../utils/entities'
import {
  MiningRegistration,
  VaultEpochInfo,
  TokenTransaction
} from '../../generated/schema'

export function handleRewardsIssued(event: RewardsIssued): void {
  // TODO: add vault param to RewardsIssued event in Mining.sol contract!
  let os = event.params.os
  let vault = event.params.vault
  let issuer = event.params.issuer
  let currentEpoch = event.params.currentEpoch
  let newRewardsPerShare = event.params.newRewardsPerShare
  let tokenBonus = event.params.tokenBonus
  let memberBonus = new BigDecimal(tokenBonus)
  let epochObj = getOrCreateEpoch(os, currentEpoch)

  let issuerMember = getOrCreateMember(os, issuer)
  issuerMember.bonus = issuerMember.bonus.plus(memberBonus)

  let tokenTransaction = new TokenTransaction(generateEventId(event))
  tokenTransaction.type = BONUS
  tokenTransaction.os = os.toHexString()
  tokenTransaction.epoch = currentEpoch
  tokenTransaction.from = os.toHexString()
  tokenTransaction.to = issuer.toHexString()
  tokenTransaction.amount = memberBonus

  let vaultEpochInfoId = generateId([os.toHexString(), vault.toHexString(), currentEpoch as string])
  let vaultEpochInfo = VaultEpochInfo.load(vaultEpochInfoId)
  if (vaultEpochInfo === null) {
    vaultEpochInfo = new VaultEpochInfo(vaultEpochInfoId)    
    vaultEpochInfo.epoch = epochObj.id    
    vaultEpochInfo.vault = vault.toHexString()
    vaultEpochInfo.amount = BIGDECIMAL_ZERO
    vaultEpochInfo.rewardsPerShare = BIGDECIMAL_ZERO
  }
  vaultEpochInfo.rewardsPerShare = new BigDecimal(newRewardsPerShare)

  let epochMemberInfo = getOrCreateEpochMemberInfo(os, issuer, currentEpoch)
  epochMemberInfo.bonus = epochMemberInfo.bonus.plus(memberBonus)

  tokenTransaction.save()
  issuerMember.save()
  vaultEpochInfo.save()
  epochMemberInfo.save()
}

export function handleRewardsClaimed(event: RewardsClaimed): void {
  let os = event.params.os
  let epochClaimed = event.params.epochClaimed
  let member = event.params.member
  let totalRewardsClaimed = event.params.totalRewardsClaimed

  let reward = new BigDecimal(totalRewardsClaimed)

  let tokenTransaction = new TokenTransaction(generateEventId(event))
  tokenTransaction.type = BONUS
  tokenTransaction.os = os.toHexString()
  tokenTransaction.epoch = epochClaimed
  tokenTransaction.from = os.toHexString()
  tokenTransaction.to = member.toHexString()
  tokenTransaction.amount = reward

  let claimingMember = getOrCreateMember(os, member)
  claimingMember.miningRewards = claimingMember.miningRewards.plus(reward)

  let epochMemberInfo = getOrCreateEpochMemberInfo(os, member, epochClaimed)
  epochMemberInfo.miningRewards = epochMemberInfo.miningRewards.plus(reward)

  tokenTransaction.save()
  claimingMember.save()
  epochMemberInfo.save()
}

export function handleMemberRegistered(event: MemberRegistered): void {
  let os = event.params.os
  let currentEpoch = event.params.currentEpoch
  let member = event.params.member
  let id = generateId([os.toHexString(), currentEpoch as string, member.toHexString()])

  let registrationOs = getOrCreateOs(os)
  let registrationMember = getOrCreateMember(os, member)
  let registration = new MiningRegistration(id)

  registration.os = registrationOs.id
  registration.member = registrationMember.id
  registration.epoch = currentEpoch

  registration.save()
}