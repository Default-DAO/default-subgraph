import { 
  MemberRegistered,
  AllocationSet,
  AllocationGiven,
  RewardsClaimed
} from '../../generated/templates/PeerRewards/PeerRewards';
import { 
  RewardsRegistration,
  TokenTransaction,
} from '../../generated/schema'
import {
  getOrCreateOs,
  getOrCreateMember,
  getOrCreateAllocation,
} from '../utils/entities';
import { generateId } from '../utils/helpers'
import { PEER_REWARD } from '../utils/constants';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { generateEventId } from '../utils/helpers';

//export { runTests } from '../tests/PeerRewards.test'

// Record when a contributor has successfully registered for the allocations
export function handleMemberRegistered(event: MemberRegistered): void {
  let os = event.params.os;
  let member = event.params.member;
  let epochRegisteredFor = event.params.epochRegisteredFor;
  let registeredOs = getOrCreateOs(os);
  let registeredMember = getOrCreateMember(os, member);
  
  let id = generateId([os.toHexString(), epochRegisteredFor.toString(), member.toHexString()]);
  let registration = new RewardsRegistration(id);
  registration.os = registeredOs.id;
  registration.member = registeredMember.id;
  registration.epochNumber = epochRegisteredFor;

  registration.save();
}

// Record when a contributor changes their allocation settings
export function handleAllocationSet(event: AllocationSet): void {    
  const allocation = getOrCreateAllocation(
    event.params.os,     
    event.params.fromMember, 
    event.params.toMember,    
    event.params.currentEpoch,
    new BigDecimal(BigInt.fromI32(event.params.allocPts)),
  );
  allocation.amount = new BigDecimal(BigInt.fromI32(event.params.allocPts))

  allocation.save();
}

// Record when a contributor gives an allocation
export function handleAllocationGiven(event: AllocationGiven): void {  
  let allocation = getOrCreateAllocation(
    event.params.os,     
    event.params.fromMember, 
    event.params.toMember,    
    event.params.currentEpoch
  );

  allocation.committed = true;
  allocation.save();
}

// Record when a contributor claims their rewarded allocations
export function handleRewardsClaimed(event: RewardsClaimed): void {  
  let osObj = getOrCreateOs(event.params.os);
  let member = getOrCreateMember(event.params.os, event.params.member);
  let epoch = event.params.epochClaimed;
  let totalRewardsClaimed = event.params.totalRewardsClaimed;
  
  let transactionId = generateEventId(event);
  let transaction = new TokenTransaction(transactionId);
  transaction.os = osObj.id;
  transaction.epochNumber = epoch;
  transaction.from = osObj.id;
  transaction.to = member.address; // this field is a string so use actual address
  transaction.amount = totalRewardsClaimed.toBigDecimal();
  transaction.type = PEER_REWARD;

  transaction.save();
}