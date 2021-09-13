import { ethereum, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { MemberRegistered } from "../../generated/templates/Members/Members";
import { EndorsementMemberInfo, Endorsement, Member } from '../../generated/schema';

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

export function generateId(fields: any): string {
  return fields.join("-")  
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
    member.epoch = event.params.epoch;
    member.stakedAmt = BIGDECIMAL_ZERO;
  }
  return member as Member;
}

export function getOrCreateEndorsement(
  toAddress: string,
  fromAddress: string,
  os: string,
  epoch: number,
): Endorsement {
  let id = `${toAddress}-${fromAddress}-${epoch}`;
  let endorsement = Endorsement.load(id);
  if (endorsement === null) {
    let toMember = getOrCreateEndorsementInfo(toAddress, epoch, os);
    let fromMember = getOrCreateEndorsementInfo(fromAddress, epoch, os);
    endorsement = new Endorsement(id);
    endorsement.amount = BIGDECIMAL_ZERO;
    endorsement.epoch = generateId([os,epoch]);
    endorsement.to = toMember.id;
    endorsement.from = fromMember.id;
  }
  return endorsement as Endorsement;
}

export function getOrCreateEndorsementInfo(
  address: string, 
  epoch: number,
  os: string
): EndorsementMemberInfo {
  let id = `${address}-${epoch}`;
  let endorseInfo = EndorsementMemberInfo.load(id);
  if (endorseInfo === null) {
    endorseInfo = new EndorsementMemberInfo(id);
    endorseInfo.epoch = generateId([os,epoch]);
    endorseInfo.member = address;
    endorseInfo.endorsementReceivedAmt = BIGDECIMAL_ZERO;
    endorseInfo.endorsementGivenAmt = BIGDECIMAL_ZERO;
  }
  return endorseInfo as EndorsementMemberInfo;
}

