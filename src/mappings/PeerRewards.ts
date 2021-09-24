import { 
  MemberRegistered,
  AllocationSet,
  AllocationGiven,
  RewardsClaimed
} from '../../generated/templates/PeerRewards/PeerRewards';
import { 
  RewardsRegistration,
  Allocation,
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

export function handleMemberRegistered(event: MemberRegistered): void {
  let os = event.params.os
  let member = event.params.member
  let epochRegisteredFor = event.params.epochRegisteredFor
  let id = generateId([os.toHexString(), member.toHexString(), epochRegisteredFor.toString()])
  let registeredOs = getOrCreateOs(os)
  let registeredMember = getOrCreateMember(os, member)
  
  let registration = new RewardsRegistration(id)
  registration.os = registeredOs.id
  registration.member = registeredMember.id
  registration.epochNumber = epochRegisteredFor
}

export function handleAllocationSet(event: AllocationSet): void {  
  const allocation = getOrCreateAllocation(
    event.params.os,     
    event.params.fromMember, 
    event.params.toMember,    
    event.params.currentEpoch,
    new BigDecimal(new BigInt(event.params.allocPts)),
  )
  allocation.save()
}

export function handleAllocationGiven(event: AllocationGiven): void {  
  let allocation = getOrCreateAllocation(
    event.params.os,     
    event.params.fromMember, 
    event.params.toMember,    
    event.params.currentEpoch
  )
  allocation.committed = true
  allocation.save()  
}

export function handleRewardsClaimed(event: RewardsClaimed): void {  
  let osObj = getOrCreateOs(event.params.os)
  let member = getOrCreateMember(event.params.os, event.params.member)
  let epoch = event.params.epochClaimed
  let totalRewardsClaimed = event.params.totalRewardsClaimed
  
  let transactionId = generateEventId(event)
  let transaction = new TokenTransaction(transactionId)
  transaction.os = osObj.id
  transaction.epochNumber = epoch
  transaction.from = osObj.id
  transaction.to = member.address // this field is a string so use actual address
  transaction.amount = totalRewardsClaimed.toBigDecimal()
  transaction.type = PEER_REWARD

  transaction.save()
}