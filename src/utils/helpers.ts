import { ethereum, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { MemberRegistered } from "../../generated/Default/Members";
import { MemberEndorsementInfo, Endorsement, Member } from '../../generated/schema';

import { BIGDECIMAL_ZERO } from './constants';

export const DEFAULT_DECIMALS = 3;

export function toDecimal(
  value: BigInt,
  decimals: number = DEFAULT_DECIMALS,
): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<number>decimals)
    .toBigDecimal();

  return value.divDecimal(precision);
}

export function generateEventId(event: ethereum.Event): string {
  return `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
}

export function getOrCreateMember(event: MemberRegistered): Member {
  let id = event.params.member.toHexString();
  let member = Member.load(id);
  if ( member === null ) {
    member = new Member(id);
    member.alias = event.params.alias_.toHexString();
    member.epoch = event.params.currentEpoch;
    member.stakedAmt = BIGDECIMAL_ZERO;
  }
  return member as Member;
}

export function getOrCreateEndorsement(
  toAddress: string,
  fromAddress: string,
  epoch: number,
): Endorsement {
  let id = `${toAddress}-${fromAddress}-${epoch}`;
  let endorsement = Endorsement.load(id);
  if (endorsement === null) {
    let toMember = getOrCreateEndorsementInfo(toAddress, epoch);
    let fromMember = getOrCreateEndorsementInfo(fromAddress, epoch);
    endorsement = new Endorsement(id);
    endorsement.amount = BIGDECIMAL_ZERO;
    endorsement.epoch = epoch;
    endorsement.toMember = toMember.id;
    endorsement.fromMember = fromMember.id;
  }
  return endorsement as Endorsement;
}

export function getOrCreateEndorsementInfo(
  address: string, 
  epoch: number,
): MemberEndorsementInfo {
  let id = `${address}-${epoch}`;
  let endorseInfo = MemberEndorsementInfo.load(id);
  if (endorseInfo === null) {
    endorseInfo = new MemberEndorsementInfo(id);
    endorseInfo.epoch = epoch;
    endorseInfo.member = address;
    endorseInfo.endorsementReceivedAmt = BIGDECIMAL_ZERO;
    endorseInfo.endorsementGivenAmt = BIGDECIMAL_ZERO;
  }
  return endorseInfo as MemberEndorsementInfo;
}

