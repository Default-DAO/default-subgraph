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
} from '../utils/entities';
import { generateId } from '../utils/helpers'
import { PEER_REWARD } from '../utils/constants';
import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
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

function generateAllocationId(
  os: Address, 
  currentEpoch: number, 
  fromMember: Address, 
  toMember: Address
): string {
  return generateId([os.toHexString(), currentEpoch.toString(), fromMember.toHexString(), toMember.toHexString()])
}

export function handleAllocationSet(event: AllocationSet): void {  
 let os = event.params.os
 let toMember = event.params.toMember
 let fromMember = event.params.fromMember
 let allocPts = new BigDecimal(BigInt.fromI32(event.params.allocPts))
 let currentEpoch = event.params.currentEpoch

  // Allocation
  let allocId = generateAllocationId(os, currentEpoch, fromMember, toMember)
  let allocation = Allocation.load(allocId)
  if (allocation == null) {
    allocation = new Allocation(allocId)
    allocation.committed = false
    allocation.epochNumber = currentEpoch
    allocation.os = os.toHexString()
    allocation.from = fromMember.toHexString()
    allocation.to = toMember.toHexString()
  } 
  allocation.amount = allocPts

  allocation.save()
}

export function handleAllocationGiven(event: AllocationGiven): void {  
  // Allocation
  let allocId = generateAllocationId(
    event.params.os, 
    event.params.currentEpoch, 
    event.params.fromMember, 
    event.params.toMember,
  )
  let allocation = Allocation.load(allocId)
  if (allocation == null) return  
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