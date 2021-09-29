import { BigDecimal, Address, store } from '@graphprotocol/graph-ts';

import {
  MemberRegistered,
  TokensStaked,
  TokensUnstaked,
  EndorsementGiven,
  EndorsementWithdrawn,
} from '../../generated/templates/Members/Members';

import { Stake } from '../../generated/schema';

import {
  getOrCreateMember,
  getOrCreateEndorsement,
  getOrCreateOs,
} from '../utils/entities';

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
} from '../utils/helpers';

// export { runTests } from '../tests/Members.test'

// MEMBERS ENTITY

export function handleMemberRegistered(event: MemberRegistered): void {
  let member = getOrCreateMember(
    event.params.os, 
    event.params.member, 
    event.params.alias_,
    event.params.epoch
  );
  
  member.save();
}

// STAKE ENTITY
// Define a staketype, STAKE or UNSTAKE so that both events are indexed together.

export function handleTokensStaked(event: TokensStaked): void {
  handleStakeEvent(event, STAKETYPE_STAKE);
}

export function handleTokensUnstaked(event: TokensUnstaked): void {
  handleStakeEvent(event, STAKETYPE_UNSTAKE);
}

export function handleStakeEvent<T>(event: T, type: string): void {
  let id = generateEventId(event);
  let amount = toDecimal(event.params.amount);
  let os = event.params.os;
  let member = getOrCreateMember(os, event.params.member);
  
  // create new stake
  let stake = new Stake(id);
  stake.os = getOrCreateOs(os).id;
  stake.member = member.id;
  stake.epochNumber = event.params.epoch;
  stake.lockDuration = event.params.lockDuration;
  stake.amount = amount;
  stake.type = type;

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

// ENDORSEMENT ENTITY
// Define an endorsementType, GIVEN or WITHDRAWN so that both events are indexed together.

export function handleEndorsementGiven(event: EndorsementGiven): void {
  let amount = toDecimal(event.params.endorsementsGiven);
  handleEndorsementEvent(event, ENDORSEMENTTYPE_GIVEN, amount);
}

export function handleEndorsementWithdrawn(event: EndorsementWithdrawn): void {
  let amount = toDecimal(event.params.endorsementsWithdrawn);
  handleEndorsementEvent(event, ENDORSEMENTTYPE_WITHDRAWN, amount);
}

export function handleEndorsementEvent<T>(
  event: T,
  type: string,
  amount: BigDecimal,
): void {
  let epoch = event.params.epoch;
  let os = event.params.os;
  let toMember = getOrCreateMember(os, event.params.toMember);
  let fromMember = getOrCreateMember(os, event.params.fromMember);
  let toAddress = Address.fromString(toMember.address);
  let fromAddress = Address.fromString(fromMember.address);

  let endorsement = getOrCreateEndorsement(
    os,
    toAddress,
    fromAddress, 
    epoch
  );
  if (type === ENDORSEMENTTYPE_GIVEN) {
    endorsement.amount = endorsement.amount.plus(amount);
  } else {
    endorsement.amount = endorsement.amount.minus(amount);
  }

  endorsement.save();


  // if the endorsement amount is 0 then delete the endorsement row
  let endorsementRevoked = endorsement.amount === BIGDECIMAL_ZERO;
  if (endorsementRevoked) {
    store.remove('Endorsement', endorsement.id);
  } else {
    // otherwise save it
    endorsement.save();
  }
}
