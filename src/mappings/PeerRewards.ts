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
  EpochMemberInfo
} from '../../generated/schema'
import {
  getOrCreateOs,
  getOrCreateMember,
  getOrCreateAllocationMemberInfo,
} from '../utils/entities';
import { generateId } from '../utils/helpers'
import {
  BIGDECIMAL_ZERO,
  PEER_REWARD
} from '../utils/constants';
import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { generateEventId } from '../utils/helpers';


export function handleMemberRegistered(event: MemberRegistered): void {
  let os = event.params.os
  let member = event.params.member
  let epochRegisteredFor = event.params.epochRegisteredFor
  let id = generateId([os.toHexString(), member.toHexString(), epochRegisteredFor as string])
  let registeredOs = getOrCreateOs(os)
  let registeredMember = getOrCreateMember(os, member)
  
  let registration = new RewardsRegistration(id)
  registration.os = registeredOs.id
  registration.member = registeredMember.id
  registration.epoch = epochRegisteredFor
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
  let netChange = BIGDECIMAL_ZERO
  if (allocation == null) {
    allocation = new Allocation(allocId)
    netChange = allocPts
    allocation.committed = false
    allocation.epoch = currentEpoch
    allocation.os = os.toHexString()
    allocation.from = fromMember.toHexString()
    allocation.to = toMember.toHexString()
  } else {
    netChange = allocPts.minus(allocation.amount)
  }
  allocation.amount = allocPts

  // Allocation FROM Aggregation
  let from = getOrCreateAllocationMemberInfo(os, fromMember, currentEpoch)
  from.allocationGivenAmt = from.allocationGivenAmt.plus(netChange )

  // Allocation TO Aggregation
  let to = getOrCreateAllocationMemberInfo(os, toMember, currentEpoch)
  to.allocationReceivedAmt = to.allocationReceivedAmt.plus(netChange)

  allocation.save()
  from.save()
  to.save()
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
  transaction.epoch = epoch
  transaction.from = osObj.id
  transaction.to = member.address // this field is a string so use actual address
  transaction.amount = totalRewardsClaimed.toBigDecimal()
  transaction.type = PEER_REWARD

  let epochMemberInfoId = generateId([osObj.id, epoch as string, member.address])
  let epochMemberInfo = new EpochMemberInfo(epochMemberInfoId)
  if (epochMemberInfo === null) {
    epochMemberInfo.os = osObj.id
    epochMemberInfo.member = member.id
    epochMemberInfo.epoch = epoch
    epochMemberInfo.staked = BIGDECIMAL_ZERO
    epochMemberInfo.miningRewards = BIGDECIMAL_ZERO
    epochMemberInfo.bonus = BIGDECIMAL_ZERO
    epochMemberInfo.peerRewards = BIGDECIMAL_ZERO
  }
  epochMemberInfo.peerRewards = totalRewardsClaimed.toBigDecimal().plus(
    epochMemberInfo.peerRewards
  )

  epochMemberInfo.save()
}