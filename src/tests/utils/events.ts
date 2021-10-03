import { newMockEvent } from 'matchstick-as/assembly/index'
import { OSCreated } from "../../../generated/DefaultOSFactory/DefaultOSFactory";
import { ModuleInstalled, OwnershipTransferred } from "../../../generated/templates/DefaultOS/DefaultOS";
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { EpochIncremented } from '../../../generated/templates/Epoch/Epoch';
import { EndorsementGiven, EndorsementWithdrawn, MemberRegistered, TokensStaked, TokensUnstaked } from '../../../generated/templates/Members/Members';
import { MemberRegistered as PeerRewardsMemberRegistered, AllocationSet, AllocationGiven, RewardsClaimed } from '../../../generated/templates/PeerRewards/PeerRewards';
import { debug } from "matchstick-as/assembly/log";

function stringToBytes(str: string): Bytes {
  return Bytes.fromHexString(Bytes.fromUTF8(str).toHexString()) as Bytes
}

// ##################################
// ######## DefaultOSFactory ########
// ##################################

export function createOSCreatedMockEvent(os: string, alias: string, name: string): OSCreated {
  let mockEvent = newMockEvent();
  let osCreatedEvent = new OSCreated(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters);

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));  
  let nameParam = new ethereum.EventParam(
    "name",
    //Not sure why just converting to Bytes straight from UTF8 fails
    ethereum.Value.fromBytes(stringToBytes(name))
  );

  osCreatedEvent.parameters = new Array();
  osCreatedEvent.parameters.push(osParam);
  osCreatedEvent.parameters.push(nameParam);

  return osCreatedEvent
}

// ##################################
// ########### DefaultOS ############
// ##################################

export function createModuleInstalledMockEvent(os: string, module: string, moduleKeyCode: string): ModuleInstalled {
  let mockEvent = newMockEvent();
  let moduleInstalledEvent = new ModuleInstalled(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters);

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let moduleParam = new ethereum.EventParam("module", ethereum.Value.fromAddress(Address.fromString(module)));

  let moduleKeyCodeParam = new ethereum.EventParam(
    "moduleKeyCode", ethereum.Value.fromBytes(stringToBytes(moduleKeyCode))
  );

  moduleInstalledEvent.parameters = new Array();
  moduleInstalledEvent.parameters.push(osParam);
  moduleInstalledEvent.parameters.push(moduleParam);
  moduleInstalledEvent.parameters.push(moduleKeyCodeParam);

  return moduleInstalledEvent;
}

export function createOwnershipTransferredMockEvent(previousOwner: string, newOwner: string): OwnershipTransferred {
  let mockEvent = newMockEvent();
  let ownershipTransferredEvent = new OwnershipTransferred(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters);

  let previousOwnerParam = new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(Address.fromString(previousOwner)));
  let newOwnerParam = new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(Address.fromString(newOwner)));

  ownershipTransferredEvent.parameters = new Array();
  ownershipTransferredEvent.parameters.push(previousOwnerParam);
  ownershipTransferredEvent.parameters.push(newOwnerParam);

  return ownershipTransferredEvent;
}

// ##################################
// ############ Epoch ###############
// ##################################

export function createEpochIncrementedMockEvent(os: string, epoch: i32): EpochIncremented {
  let mockEvent = newMockEvent();
  let epochIncrementedEvent = new EpochIncremented(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters);

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let epochParam = new ethereum.EventParam("epoch", ethereum.Value.fromI32(epoch));

  epochIncrementedEvent.parameters = new Array();
  epochIncrementedEvent.parameters.push(osParam);
  epochIncrementedEvent.parameters.push(epochParam);

  return epochIncrementedEvent
}

// ##################################
// ########### Members ##############
// ##################################

export function createMemberRegisteredMockEvent(os: string, member: string, alias_: string, epoch: i32): MemberRegistered {
  let mockEvent = newMockEvent()
  let memberRegisteredEvent = new MemberRegistered(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let memberParam = new ethereum.EventParam("address", ethereum.Value.fromAddress(Address.fromString(member)));
  let aliasParam = new ethereum.EventParam("alias", ethereum.Value.fromBytes(stringToBytes(alias_)));
  let epochparam = new ethereum.EventParam("epoch", ethereum.Value.fromI32(epoch));

  memberRegisteredEvent.parameters = new Array();
  memberRegisteredEvent.parameters.push(osParam);
  memberRegisteredEvent.parameters.push(memberParam);
  memberRegisteredEvent.parameters.push(aliasParam);
  memberRegisteredEvent.parameters.push(epochparam);

  return memberRegisteredEvent
}

export function createTokensStakedMockEvent(os: string, member: string, amount: i32, lockDuration: i32, epoch: i32): TokensStaked {
  let mockEvent = newMockEvent()
  let tokensStakedEvent = new TokensStaked(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let memberParam = new ethereum.EventParam("member", ethereum.Value.fromAddress(Address.fromString(member)));
  let amountParam = new ethereum.EventParam("amount", ethereum.Value.fromI32(amount));
  let lockDurationParam = new ethereum.EventParam("alias", ethereum.Value.fromI32(lockDuration));
  let epochparam = new ethereum.EventParam("epoch", ethereum.Value.fromI32(epoch));

  tokensStakedEvent.parameters = new Array();
  tokensStakedEvent.parameters.push(osParam);
  tokensStakedEvent.parameters.push(memberParam);
  tokensStakedEvent.parameters.push(amountParam);
  tokensStakedEvent.parameters.push(lockDurationParam);
  tokensStakedEvent.parameters.push(epochparam);

  return tokensStakedEvent
}

export function createTokensUnstakedMockEvent(os: string, member: string, amount: i32, lockDuration: i32, epoch: i32): TokensUnstaked {
  let mockEvent = newMockEvent()
  let tokensUnstakedEvent = new TokensUnstaked(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let memberParam = new ethereum.EventParam("member", ethereum.Value.fromAddress(Address.fromString(member)));
  let amountParam = new ethereum.EventParam("amount", ethereum.Value.fromI32(amount));
  let lockDurationParam = new ethereum.EventParam("alias", ethereum.Value.fromI32(lockDuration));
  let epochparam = new ethereum.EventParam("epoch", ethereum.Value.fromI32(epoch));

  tokensUnstakedEvent.parameters = new Array();
  tokensUnstakedEvent.parameters.push(osParam);
  tokensUnstakedEvent.parameters.push(memberParam);
  tokensUnstakedEvent.parameters.push(amountParam);
  tokensUnstakedEvent.parameters.push(lockDurationParam);
  tokensUnstakedEvent.parameters.push(epochparam);

  return tokensUnstakedEvent
}

export function createEndorsementGivenMockEvent(os: string, fromMember: string, toMember: string, endorsementsGiven: i32, epoch: i32): EndorsementGiven {
  let mockEvent = newMockEvent()
  let endorsementGivenEvent = new EndorsementGiven(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let fromMemberParam = new ethereum.EventParam("fromMember", ethereum.Value.fromAddress(Address.fromString(fromMember)));
  let toMemberParam = new ethereum.EventParam("toMember", ethereum.Value.fromAddress(Address.fromString(toMember)));
  let endorsementsGivenParam = new ethereum.EventParam("endorsementsGiven", ethereum.Value.fromI32(endorsementsGiven));  
  let epochparam = new ethereum.EventParam("epoch", ethereum.Value.fromI32(epoch));

  endorsementGivenEvent.parameters = new Array();
  endorsementGivenEvent.parameters.push(osParam);
  endorsementGivenEvent.parameters.push(fromMemberParam);
  endorsementGivenEvent.parameters.push(toMemberParam);
  endorsementGivenEvent.parameters.push(endorsementsGivenParam);
  endorsementGivenEvent.parameters.push(epochparam);

  return endorsementGivenEvent
}

export function createEndorsementWithdrawnMockEvent(os: string, fromMember: string, toMember: string, endorsementsWithdrawn: i32, epoch: i32): EndorsementWithdrawn {
  let mockEvent = newMockEvent()
  let endorsementWithdrawnEvent = new EndorsementWithdrawn(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let fromMemberParam = new ethereum.EventParam("fromMember", ethereum.Value.fromAddress(Address.fromString(fromMember)));
  let toMemberParam = new ethereum.EventParam("toMember", ethereum.Value.fromAddress(Address.fromString(toMember)));
  let endorsementsWithdrawnParam = new ethereum.EventParam("endorsementsWithdrawn", ethereum.Value.fromI32(endorsementsWithdrawn));  
  let epochparam = new ethereum.EventParam("epoch", ethereum.Value.fromI32(epoch));

  endorsementWithdrawnEvent.parameters = new Array();
  endorsementWithdrawnEvent.parameters.push(osParam);
  endorsementWithdrawnEvent.parameters.push(fromMemberParam);
  endorsementWithdrawnEvent.parameters.push(toMemberParam);
  endorsementWithdrawnEvent.parameters.push(endorsementsWithdrawnParam);
  endorsementWithdrawnEvent.parameters.push(epochparam);

  return endorsementWithdrawnEvent
}


// ##################################
// ######### PeerRewards ############
// ##################################

export function createPeerReviewMemberRegisteredMockEvent(os: string, member: string, ptsRegistered: i32, epochRegisteredFor: i32): PeerRewardsMemberRegistered {
  let mockEvent = newMockEvent()
  let prMemberRegisteredEvent = new PeerRewardsMemberRegistered(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let memberParam = new ethereum.EventParam("member", ethereum.Value.fromAddress(Address.fromString(member)));  
  let ptsRegisteredParam = new ethereum.EventParam("ptsRegistered", ethereum.Value.fromI32(ptsRegistered));
  let epochRegisteredForParam = new ethereum.EventParam("epochRegisteredFor", ethereum.Value.fromI32(epochRegisteredFor));  

  prMemberRegisteredEvent.parameters = new Array();
  prMemberRegisteredEvent.parameters.push(osParam);
  prMemberRegisteredEvent.parameters.push(memberParam);
  prMemberRegisteredEvent.parameters.push(ptsRegisteredParam);
  prMemberRegisteredEvent.parameters.push(epochRegisteredForParam);  

  return prMemberRegisteredEvent
}

export function createAllocationSetMockEvent(os: string, fromMember: string, toMember: string, allocPts: i32, currentEpoch: i32): AllocationSet {
  let mockEvent = newMockEvent()
  let allocationSetEvent = new AllocationSet(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let fromMemberParam = new ethereum.EventParam("fromMember", ethereum.Value.fromAddress(Address.fromString(fromMember)));  
  let toMemberParam = new ethereum.EventParam("toMember", ethereum.Value.fromAddress(Address.fromString(toMember)));  
  let allocPtsParam = new ethereum.EventParam("allocPts", ethereum.Value.fromI32(allocPts));
  let currentEpochParam = new ethereum.EventParam("currentEpoch", ethereum.Value.fromI32(currentEpoch));

  allocationSetEvent.parameters = new Array();
  allocationSetEvent.parameters.push(osParam);
  allocationSetEvent.parameters.push(fromMemberParam);
  allocationSetEvent.parameters.push(toMemberParam);
  allocationSetEvent.parameters.push(allocPtsParam);
  allocationSetEvent.parameters.push(currentEpochParam);

  return allocationSetEvent
}

export function createAllocationGivenMockEvent(os: string, fromMember: string, toMember: string, allocGiven: i32, currentEpoch: i32): AllocationGiven {
  let mockEvent = newMockEvent()
  let allocationGivenEvent = new AllocationGiven(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let fromMemberParam = new ethereum.EventParam("fromMember", ethereum.Value.fromAddress(Address.fromString(fromMember)));  
  let toMemberParam = new ethereum.EventParam("toMember", ethereum.Value.fromAddress(Address.fromString(toMember)));  
  let allocGivenParam = new ethereum.EventParam("allocGiven", ethereum.Value.fromI32(allocGiven));
  let currentEpochParam = new ethereum.EventParam("currentEpoch", ethereum.Value.fromI32(currentEpoch));

  allocationGivenEvent.parameters = new Array();
  allocationGivenEvent.parameters.push(osParam);
  allocationGivenEvent.parameters.push(fromMemberParam);
  allocationGivenEvent.parameters.push(toMemberParam);
  allocationGivenEvent.parameters.push(allocGivenParam);
  allocationGivenEvent.parameters.push(currentEpochParam);

  return allocationGivenEvent
}

export function createRewardsClaimedMockEvent(os: string, member: string, totalRewardsClaimed: i32, epochClaimed: i32): RewardsClaimed {
  let mockEvent = newMockEvent()
  let rewardsClaimedEvent = new RewardsClaimed(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let memberParam = new ethereum.EventParam("member", ethereum.Value.fromAddress(Address.fromString(member)));  
  let totalRewardsClaimedParam = new ethereum.EventParam("totalRewardsClaimed", ethereum.Value.fromI32(totalRewardsClaimed));  
  let epochClaimedParam = new ethereum.EventParam("epochClaimed", ethereum.Value.fromI32(epochClaimed));  

  rewardsClaimedEvent.parameters = new Array();
  rewardsClaimedEvent.parameters.push(osParam);
  rewardsClaimedEvent.parameters.push(memberParam);
  rewardsClaimedEvent.parameters.push(totalRewardsClaimedParam);
  rewardsClaimedEvent.parameters.push(epochClaimedParam);  

  return rewardsClaimedEvent
}