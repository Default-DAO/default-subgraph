import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { createEndorsementGivenMockEvent, createEndorsementWithdrawnMockEvent, createMemberRegisteredMockEvent, createTokensStakedMockEvent, createTokensUnstakedMockEvent } from './utils/events';
import { ADDRESSES, ENDORSEMENT_ENTITY, MEMBER_ENTITY, STAKE_ENTITY } from './utils/constants';
import { STAKETYPE_STAKE, STAKETYPE_UNSTAKE } from '../utils/constants';
import { handleEndorsementGiven, handleEndorsementWithdrawn, handleMemberRegistered, handleTokensStaked, handleTokensUnstaked } from '../mappings/Members';
import { generateEventId, generateId } from '../utils/helpers';
import { debug } from "matchstick-as/assembly/log";
import { getOrCreateEpoch } from '../utils/entities';

export function runTests(): void {
  test("Should successfully create member", () => { 
    const alias = 'alias1';
    const memberRegisteredEvent = createMemberRegisteredMockEvent(
      ADDRESSES[0], ADDRESSES[1], alias, 1
    );

    handleMemberRegistered(memberRegisteredEvent);
    
    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    const epochId = generateId([ADDRESSES[0], "1"]);
    assert.fieldEquals(MEMBER_ENTITY, memberId, "os", ADDRESSES[0]);
    assert.fieldEquals(MEMBER_ENTITY, memberId, "address", ADDRESSES[1]);
    assert.fieldEquals(MEMBER_ENTITY, memberId, "alias", alias);
    assert.fieldEquals(MEMBER_ENTITY, memberId, "epoch", epochId);
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "0");
    assert.fieldEquals(MEMBER_ENTITY, memberId, "miningRewards", "0");
    assert.fieldEquals(MEMBER_ENTITY, memberId, "bonus", "0");
    assert.fieldEquals(MEMBER_ENTITY, memberId, "peerRewards", "0");
    assert.fieldEquals(MEMBER_ENTITY, memberId, "endorsementsReceived", "0");    

    clearStore()
  });

  test("Should successfully chanage alias", () => { 
    const alias = 'alias1';
    const memberRegisteredEvent = createMemberRegisteredMockEvent(
      ADDRESSES[0], ADDRESSES[1], alias, 1
    );

    handleMemberRegistered(memberRegisteredEvent);
    
    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]]);  
    const epochId = generateId([ADDRESSES[0], "1"]);

    assert.fieldEquals(MEMBER_ENTITY, memberId, "alias", alias);
    assert.fieldEquals(MEMBER_ENTITY, memberId, "epoch", epochId);

    const alias2 = 'alias2';
    const memberRegisteredEvent2 = createMemberRegisteredMockEvent(
      ADDRESSES[0], ADDRESSES[1], alias2, 2
    );

    handleMemberRegistered(memberRegisteredEvent2);    

    assert.fieldEquals(MEMBER_ENTITY, memberId, "alias", alias2);
    //Epoch should not change on change alias!
    assert.fieldEquals(MEMBER_ENTITY, memberId, "epoch", epochId);
    
    clearStore()
  });

  test("Should successfully handle stake", () => {   
    const tokensStakedEvent = createTokensStakedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    );

    handleTokensStaked(tokensStakedEvent);

    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    const stakeId = generateEventId(tokensStakedEvent)
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "1");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "os", ADDRESSES[0]);
    assert.fieldEquals(STAKE_ENTITY, stakeId, "epochNumber", "1");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "type", STAKETYPE_STAKE);
    assert.fieldEquals(STAKE_ENTITY, stakeId, "amount", "1");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "lockDuration", "10");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "member", memberId);

    clearStore();
  });

  test("Should successfully handle unstake", () => {   
    const tokensStakedEvent = createTokensStakedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    );

    handleTokensStaked(tokensStakedEvent);

    const tokensUnstakedEvent = createTokensUnstakedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    );

    handleTokensUnstaked(tokensUnstakedEvent);

    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    const stakeId = generateEventId(tokensUnstakedEvent)
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "0");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "os", ADDRESSES[0]);
    assert.fieldEquals(STAKE_ENTITY, stakeId, "epochNumber", "1");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "type", STAKETYPE_UNSTAKE);
    assert.fieldEquals(STAKE_ENTITY, stakeId, "amount", "1");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "lockDuration", "10");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "member", memberId);

    clearStore()
  });

  test("Should successfully update member stake amount", () => {    
    const initialStake = createTokensStakedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    );

    handleTokensStaked(initialStake);

    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    const stakeId = generateEventId(initialStake)
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "1");
    assert.fieldEquals(STAKE_ENTITY, stakeId, "type", STAKETYPE_STAKE);
    assert.fieldEquals(STAKE_ENTITY, stakeId, "amount", "1");

    const tokensStakedEvent = createTokensStakedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 10000, 10, 2
    );

    handleTokensStaked(tokensStakedEvent);

    const stakeId2 = generateEventId(tokensStakedEvent)
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "11");
    assert.fieldEquals(STAKE_ENTITY, stakeId2, "type", STAKETYPE_STAKE);
    assert.fieldEquals(STAKE_ENTITY, stakeId2, "amount", "10");

    const tokensUnstakedEvent = createTokensUnstakedMockEvent(
      ADDRESSES[0], ADDRESSES[1], 11000, 10, 2
    );

    handleTokensUnstaked(tokensUnstakedEvent);

    //Seems like these mock events generate the same hash everytime. Something to beware of
    const stakeId3 = generateEventId(tokensUnstakedEvent)
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "0");
    assert.fieldEquals(STAKE_ENTITY, stakeId3, "type", STAKETYPE_UNSTAKE);
    assert.fieldEquals(STAKE_ENTITY, stakeId3, "amount", "11");

    clearStore();
  });

  test("Should successfully handle endorsement", () => {    
    const endorsementGivenEvent = createEndorsementGivenMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    );

    handleEndorsementGiven(endorsementGivenEvent);

    let endorsementId = generateId([ADDRESSES[0], "1", ADDRESSES[1], ADDRESSES[2]]);
    let fromId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    let toId = generateId([ADDRESSES[0], ADDRESSES[2]]); 
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "os", ADDRESSES[0]);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "epochNumber", "1");
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "amount", "0.01");
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "from", fromId);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "to", toId);    
    assert.fieldEquals(MEMBER_ENTITY, toId, "endorsementsReceived", "0.01");

    const endorsementGivenEvent2 = createEndorsementGivenMockEvent(
      ADDRESSES[0], ADDRESSES[3], ADDRESSES[2], 20, 1
    );

    handleEndorsementGiven(endorsementGivenEvent2);

    let endorsementId2 = generateId([ADDRESSES[0], "1", ADDRESSES[3], ADDRESSES[2]]);
    let fromId2 = generateId([ADDRESSES[0], ADDRESSES[3]]);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId2, "os", ADDRESSES[0]);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId2, "epochNumber", "1");
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId2, "amount", "0.02");
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId2, "from", fromId2);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId2, "to", toId);
    assert.fieldEquals(MEMBER_ENTITY, toId, "endorsementsReceived", "0.03");

    clearStore()
  });

  test("Should successfully handle withdraw endorsement", () => {
    const endorsementGivenEvent = createEndorsementGivenMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    );

    handleEndorsementGiven(endorsementGivenEvent);

    const endorsementWithdrawnEvent = createEndorsementWithdrawnMockEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 5, 1
    );

    handleEndorsementWithdrawn(endorsementWithdrawnEvent);

    let endorsementId = generateId([ADDRESSES[0], "1", ADDRESSES[1], ADDRESSES[2]]);    
    let fromId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    let toId = generateId([ADDRESSES[0], ADDRESSES[2]]);    
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "os", ADDRESSES[0]);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "epochNumber", "1");
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "amount", "0.005");
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "from", fromId);
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "to", toId);
    assert.fieldEquals(MEMBER_ENTITY, toId, "endorsementsReceived", "0.005");

    clearStore();
  });
}