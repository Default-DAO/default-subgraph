import { BigDecimal, store } from '@graphprotocol/graph-ts';

import {
  MemberRegistered,
  TokensStaked,
  TokensUnstaked,
  EndorsementGiven,
  EndorsementWithdrawn,
} from '../../generated/Default/Members';

import {
  Member,
  Stake,
  MemberEndorsementInfo,
} from '../../generated/schema';

import {
  BIGDECIMAL_ZERO,
  STAKETYPE_STAKE,
  STAKETYPE_UNSTAKE,
  ENDORSEMENTTYPE_GIVEN,
  ENDORSEMENTTYPE_WITHDRAWN,
} from '../utils/constants';

import {
  generateEventId,
  toDecimal,
  getOrCreateEndorsement,
  getOrCreateMember,
} from '../utils/helpers';

// MEMBERS ENTITY
export function handleMemberRegistered(event: MemberRegistered): void {
  let member = getOrCreateMember(event);
  member.alias = event.params.alias_.toHexString();

  member.save();
}

// STAKE ENTITY
export function handleStakeEvent<T>(event: T, type: string): void {
  let id = generateEventId(event);
  let stake = new Stake(id);
  let amount = toDecimal(event.params.amount);
  let member = Member.load(event.params.member.toHexString());
  stake.type = type;
  stake.epoch = event.params.currentEpoch;
  stake.amount = amount;
  stake.lockDuration = event.params.lockDuration;
  stake.member = member;

  stake.save();


  // we should be able to do something like this:
  // member.stakedAmt[operator](amount) 
  // but i just dont have time to figure out how
  if (type === STAKETYPE_STAKE) {
    member.stakedAmt = member.stakedAmt.plus(amount);
  } else {
    member.stakedAmt = member.stakedAmt.minus(amount);
  }

  member.save();
}

export function handleTokensStaked(event: TokensStaked): void {
  handleStakeEvent(event, STAKETYPE_STAKE);
}
export function handleTokensUnStaked(event: TokensUnstaked): void {
  handleStakeEvent(event, STAKETYPE_UNSTAKE);
}

// ENDORSEMENT ENTITY
export function handleEndorsementEvent<T>(
  event: T,
  type: string,
  amount: BigDecimal,
): void {
  let toMember = Member.load(event.params.toMember.toHexString());
  let fromMember = Member.load(event.params.fromMember.toHexString());
  let epoch = event.params.currentEpoch;
  let endorsement = getOrCreateEndorsement(toMember.id, fromMember.id, epoch);

  
  
  let toMemberInfo = MemberEndorsementInfo.load(endorsement.toMember);
  let fromMemberInfo = MemberEndorsementInfo.load(endorsement.fromMember);
  if (type === ENDORSEMENTTYPE_GIVEN) {
    endorsement.amount = endorsement.amount.plus(amount);
    toMemberInfo.endorsementReceivedAmt = toMemberInfo.endorsementReceivedAmt.plus(amount);
    fromMemberInfo.endorsementGivenAmt = fromMemberInfo.endorsementGivenAmt.plus(amount);

  } else {
    endorsement.amount = endorsement.amount.minus(amount);
    toMemberInfo.endorsementReceivedAmt = toMemberInfo.endorsementReceivedAmt.minus(amount);
    fromMemberInfo.endorsementGivenAmt = fromMemberInfo.endorsementGivenAmt.minus(amount);
  }

  endorsement.save();
  toMemberInfo.save();
  fromMemberInfo.save();


  // if the endorsement amount is 0 then delete the endorsement row
  let endorsementRevoked = endorsement.amount === BIGDECIMAL_ZERO;
  if (endorsementRevoked) {
    store.remove('Endorsement', endorsement.id);
  } else {
    // otherwise save it
    endorsement.save();
  }
}

export function handleEndorsementGiven(event: EndorsementGiven): void {
  let amount = toDecimal(event.params.endorsementsGiven);
  handleEndorsementEvent(event, ENDORSEMENTTYPE_GIVEN, amount);
}

export function handleEndorsementWithdrawn(event: EndorsementWithdrawn): void {
  let amount = toDecimal(event.params.endorsementsWithdrawn);
  handleEndorsementEvent(event, ENDORSEMENTTYPE_WITHDRAWN, amount);
}
