import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { createAllocationGivenMockEvent, createAllocationSetMockEvent, createPeerReviewMemberRegisteredMockEvent, createRewardsClaimedMockEvent } from './utils/events';
import { ADDRESSES, ALLOCATION_ENTITY, REWARDS_REGISTRATION_ENTITY, TOKEN_TRANSACTION_ENTITY } from './utils/constants';
import { PEER_REWARD } from '../utils/constants';
import { handleAllocationGiven, handleAllocationSet, handleMemberRegistered, handleRewardsClaimed } from '../mappings/PeerRewards';
import { generateEventId, generateId } from '../utils/helpers';
import { debug } from "matchstick-as/assembly/log";

export function runTests(): void {
  test("Should successfully save peer rewards registration", () => { 
    const memberRegisteredEvent = createPeerReviewMemberRegisteredMockEvent(
      ADDRESSES[0], ADDRESSES[1], 1, 10
    );

    handleMemberRegistered(memberRegisteredEvent);
    
    const registrationId = generateId([ADDRESSES[0], "1", ADDRESSES[1]]);
    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    assert.fieldEquals(REWARDS_REGISTRATION_ENTITY, registrationId, "os", ADDRESSES[0]);
    assert.fieldEquals(REWARDS_REGISTRATION_ENTITY, registrationId, "epochNumber", "1");
    assert.fieldEquals(REWARDS_REGISTRATION_ENTITY, registrationId, "member", memberId);

    clearStore();
  });

  test("Should successfully create allocation", () => {   
    const allocationSetEvent = createAllocationSetMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    );

    handleAllocationSet(allocationSetEvent);
    
    const allocationId = generateId([ADDRESSES[0], "1", ADDRESSES[1], ADDRESSES[2]]);    
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "os", ADDRESSES[0]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "epochNumber", "1");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "amount", "10");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "committed", "false");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "from", ADDRESSES[1]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "to", ADDRESSES[2]);

    const allocationSetEvent2 = createAllocationSetMockEvent(
      ADDRESSES[0], ADDRESSES[2], ADDRESSES[1], 5, 1
    );

    handleAllocationSet(allocationSetEvent2);
    
    const allocationId2 = generateId([ADDRESSES[0], "1", ADDRESSES[2], ADDRESSES[1]]);    
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "os", ADDRESSES[0]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "epochNumber", "1");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "amount", "5");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "committed", "false");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "from", ADDRESSES[2]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "to", ADDRESSES[1]);

    clearStore();
  });

  test("Should successfully change allocation", () => {   
    const allocationSetEvent = createAllocationSetMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    );

    handleAllocationSet(allocationSetEvent);
    
    const allocationId = generateId([ADDRESSES[0], "1", ADDRESSES[1], ADDRESSES[2]]);    
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "os", ADDRESSES[0]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "epochNumber", "1");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "amount", "10");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "committed", "false");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "from", ADDRESSES[1]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "to", ADDRESSES[2]);

    const allocationSetEvent2 = createAllocationSetMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 100, 1
    );

    handleAllocationSet(allocationSetEvent2);
    
    const allocationId2 = generateId([ADDRESSES[0], "1", ADDRESSES[1], ADDRESSES[2]]);    
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "os", ADDRESSES[0]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "epochNumber", "1");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "amount", "100");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "committed", "false");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "from", ADDRESSES[1]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId2, "to", ADDRESSES[2]);

    clearStore();
  });

  test("Should successfully create commit allocation", () => {   
    const allocationSetEvent = createAllocationSetMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    );

    handleAllocationSet(allocationSetEvent);
    
    const allocationId = generateId([ADDRESSES[0], "1", ADDRESSES[1], ADDRESSES[2]]);    
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "os", ADDRESSES[0]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "epochNumber", "1");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "amount", "10");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "committed", "false");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "from", ADDRESSES[1]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "to", ADDRESSES[2]);

    const allocationGivenEvent = createAllocationGivenMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    );

    handleAllocationGiven(allocationGivenEvent);
    
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "os", ADDRESSES[0]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "epochNumber", "1");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "amount", "10");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "committed", "true");
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "from", ADDRESSES[1]);
    assert.fieldEquals(ALLOCATION_ENTITY, allocationId, "to", ADDRESSES[2]);
  });

  test("Should successfully create peer reward transaction on rewards claimed", () => {
    const rewardsClaimedEvent = createRewardsClaimedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 10, 1
    );

    handleRewardsClaimed(rewardsClaimedEvent);

    const transactionId = generateEventId(rewardsClaimedEvent)
    assert.fieldEquals(TOKEN_TRANSACTION_ENTITY, transactionId, "os", ADDRESSES[0]);
    assert.fieldEquals(TOKEN_TRANSACTION_ENTITY, transactionId, "epochNumber", "1");
    assert.fieldEquals(TOKEN_TRANSACTION_ENTITY, transactionId, "amount", "10");
    assert.fieldEquals(TOKEN_TRANSACTION_ENTITY, transactionId, "from", ADDRESSES[0]);
    assert.fieldEquals(TOKEN_TRANSACTION_ENTITY, transactionId, "to", ADDRESSES[1]);
    assert.fieldEquals(TOKEN_TRANSACTION_ENTITY, transactionId, "type", PEER_REWARD);
  });
}