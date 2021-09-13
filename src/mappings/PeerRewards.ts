import { 
  MemberRegistered,
  AllocationSet,
  AllocationGiven,
  RewardsClaimed
} from '../../generated/templates/PeerRewards/PeerRewards';
import { 
  RewardsRegistration,
  Allocation,
  AllocationMemberInfo,
  TokenTransaction,
  EpochMemberInfo
} from '../../generated/schema'
import {
  generateId
} from '../utils/helpers';
import {
  PEER_REWARD
} from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { BigInt } from '@graphprotocol/graph-ts';


export function handleMemberRegistered(event: MemberRegistered): void {
  let {os, member, epochRegisteredFor} = event.params
  
  let registration = new RewardsRegistration(generateId([
    os, epochRegisteredFor, member
  ]))
  registration.os = os.toHexString()
  registration.epoch = epochRegisteredFor
  registration.member = member.toHexString()
}

export function handleAllocationSet(event: AllocationSet): void {  
  let {os, toMember, fromMember, allocPts, currentEpoch} = event.params

  // Allocation
  const allocId = generateId([
    os, currentEpoch, fromMember, toMember    
  ])
  let allocation = Allocation.load(allocId)
  let netChange = 0
  if (allocation == null) {
    allocation = new Allocation(allocId)
    netChange = allocPts
    allocation.committed = false
    allocation.epoch = currentEpoch
    allocation.os = os.toHexString()
    allocation.from = fromMember.toHexString()
    allocation.to = toMember.toHexString()
  } else {
    netChange = allocPts - allocation.amount
  }
  allocation.amount = allocPts

  // Allocation FROM Aggregation
  const fromId = generateId([
    os, currentEpoch, fromMember
  ])
  let from = AllocationMemberInfo.load(fromId)

  if (from === null) {
    from = new AllocationMemberInfo(fromId)
    from.epoch = currentEpoch
    from.os = os.toHexString()
    from.member = fromMember.toHexString()
    from.allocationReceivedAmt = 0  
  }
  from.allocationGivenAmt += netChange  

  // Allocation TO Aggregation
  const toId = generateId([
    os, currentEpoch, toMember,
  ])
  let to = AllocationMemberInfo.load(toId)

  if (to === null) {
    to = new AllocationMemberInfo(toId)
    to.epoch = currentEpoch
    to.os = os.toHexString()
    to.member = toMember.toHexString()
    to.allocationGivenAmt = 0
  }
  to.allocationReceivedAmt += netChange

  allocation.save()
  from.save()
  to.save()
}

export function handleAllocationGiven(event: AllocationGiven): void {  
  let {os, toMember, fromMember, currentEpoch} = event.params

  // Allocation
  const allocId = generateId([
    os, currentEpoch, fromMember, toMember    
  ])
  let allocation = Allocation.load(allocId)
  allocation.committed = true
  allocation.save()
}

export function handleRewardsClaimed(event: RewardsClaimed): void {  
  const {os, epochClaimed, member, totalRewardsClaimed} = event.params

  const transactionId = generateId([os, uuidv4()])
  let transaction = new TokenTransaction(transactionId)
  transaction.os = os.toHexString()
  transaction.epoch = epochClaimed
  transaction.from = os.toHexString()
  transaction.to = member.toHexString()
  transaction.amount = totalRewardsClaimed.toBigDecimal()
  transaction.type = PEER_REWARD

  const epochMemberInfoId = generateId([
    os,epochClaimed,member
  ])
  let epochMemberInfo = new EpochMemberInfo(epochMemberInfoId)
  if (epochMemberInfo === null) {
    epochMemberInfo.os = os.toHexString()
    epochMemberInfo.member = member.toHexString()
    epochMemberInfo.epoch = epochClaimed
    epochMemberInfo.staked = BigInt.fromI32(0).toBigDecimal()
    epochMemberInfo.miningRewards = BigInt.fromI32(0).toBigDecimal()
    epochMemberInfo.bonus = BigInt.fromI32(0).toBigDecimal()
    epochMemberInfo.peerRewards = BigInt.fromI32(0).toBigDecimal()
  }
  epochMemberInfo.peerRewards = totalRewardsClaimed.toBigDecimal().plus(
    epochMemberInfo.peerRewards
  )

  epochMemberInfo.save()
}