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
import { BONUS } from '../utils/constants';
import { 
  getOrCreateMember,
  getOrCreateOs,
} from '../utils/entities'
import {
  MiningRegistration,
  TokenTransaction
} from '../../generated/schema'

export function handleRewardsIssued(event: RewardsIssued): void {
  // TODO: add vault param to RewardsIssued event in Mining.sol contract!
  let os = event.params.os
  let issuer = event.params.issuer
  let currentEpoch = event.params.currentEpoch
  let tokenBonus = event.params.tokenBonus
  let memberBonus = new BigDecimal(tokenBonus)

  let issuerMember = getOrCreateMember(os, issuer)
  issuerMember.bonus = issuerMember.bonus.plus(memberBonus)

  let tokenTransaction = new TokenTransaction(generateEventId(event))
  tokenTransaction.type = BONUS
  tokenTransaction.os = os.toHexString()
  tokenTransaction.epochNumber = currentEpoch
  tokenTransaction.from = os.toHexString()
  tokenTransaction.to = issuer.toHexString()
  tokenTransaction.amount = memberBonus

  tokenTransaction.save()
  issuerMember.save()
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
  tokenTransaction.epochNumber = epochClaimed
  tokenTransaction.from = os.toHexString()
  tokenTransaction.to = member.toHexString()
  tokenTransaction.amount = reward

  let claimingMember = getOrCreateMember(os, member)
  claimingMember.miningRewards = claimingMember.miningRewards.plus(reward)

  tokenTransaction.save()
  claimingMember.save()
}

export function handleMemberRegistered(event: MemberRegistered): void {
  let os = event.params.os
  let currentEpoch = event.params.currentEpoch
  let member = event.params.member
  let id = generateId([os.toHexString(), currentEpoch.toString(), member.toHexString()])

  let registrationOs = getOrCreateOs(os)
  let registrationMember = getOrCreateMember(os, member)
  let registration = new MiningRegistration(id)

  registration.os = registrationOs.id
  registration.member = registrationMember.id
  registration.epochNumber = currentEpoch

  registration.save()
}