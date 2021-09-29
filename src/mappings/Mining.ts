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


// Record when someone calls the contract to issue rewards
// @fully: should we add timestamp here?

export function handleRewardsIssued(event: RewardsIssued): void {
  // TODO: add vault param to RewardsIssued event in Mining.sol contract!
  // save data about the contract
  let os = event.params.os;
  let issuer = event.params.issuer; // allocator
  let currentEpoch = event.params.currentEpoch;
  let tokenBonus = event.params.tokenBonus;
  let memberBonus = new BigDecimal(tokenBonus);

  // save data about the member calling the function
  let issuerMember = getOrCreateMember(os, issuer);
  issuerMember.bonus = issuerMember.bonus.plus(memberBonus);

  issuerMember.save();

  // save data about the token transaction
  let tokenTransaction = new TokenTransaction(generateEventId(event));
  tokenTransaction.type = BONUS;
  tokenTransaction.os = os.toHexString();
  tokenTransaction.epochNumber = currentEpoch;
  tokenTransaction.from = os.toHexString();
  tokenTransaction.to = issuer.toHexString();
  tokenTransaction.amount = memberBonus;

  tokenTransaction.save();
}

// Record when a user claims the rewards from treasury mining
export function handleRewardsClaimed(event: RewardsClaimed): void {
  let os = event.params.os;
  let epochClaimed = event.params.epochClaimed;
  let member = event.params.member;
  let totalRewardsClaimed = event.params.totalRewardsClaimed;

  let reward = new BigDecimal(totalRewardsClaimed);

  let tokenTransaction = new TokenTransaction(generateEventId(event));
  tokenTransaction.type = BONUS;
  tokenTransaction.os = os.toHexString();
  tokenTransaction.epochNumber = epochClaimed;
  tokenTransaction.from = os.toHexString();
  tokenTransaction.to = member.toHexString();
  tokenTransaction.amount = reward;
  
  tokenTransaction.save();

  let claimingMember = getOrCreateMember(os, member);
  claimingMember.miningRewards = claimingMember.miningRewards.plus(reward);

  claimingMember.save();
}

// Record when a user first registers their shares for the mining program
export function handleMemberRegistered(event: MemberRegistered): void {
  let os = event.params.os;
  let currentEpoch = event.params.currentEpoch;
  let member = event.params.member;
  let id = generateId([os.toHexString(), currentEpoch.toString(), member.toHexString()]);

  let registrationOs = getOrCreateOs(os);
  let registrationMember = getOrCreateMember(os, member);
  let registration = new MiningRegistration(id);

  registration.os = registrationOs.id;
  registration.member = registrationMember.id;
  registration.epochNumber = currentEpoch;

  registration.save();
}