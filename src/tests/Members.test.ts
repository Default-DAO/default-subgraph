import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { createEndorsementGivenEvent, createEndorsementWithdrawnEvent, createMemberRegisteredEvent, createOSCreatedEvent, createTokensStakedEvent, createTokensUnstakedEvent } from './utils/events';
import { ADDRESSES, ENDORSEMENT_ENTITY, MEMBER_ENTITY, STAKE_ENTITY } from './utils/constants';
import { STAKETYPE_STAKE, STAKETYPE_UNSTAKE } from '../utils/constants';
import { handleEndorsementGiven, handleEndorsementWithdrawn, handleMemberRegistered, handleTokensStaked, handleTokensUnstaked } from '../mappings/Members';
import { generateId } from '../utils/helpers';
import { debug } from "matchstick-as/assembly/log";

export function runTests(): void {
  test("Should successfully create member", () => { 
    const alias = 'alias1'
    const memberRegisteredEvent = createMemberRegisteredEvent(
      ADDRESSES[0], ADDRESSES[1], alias, 1
    )

    handleMemberRegistered(memberRegisteredEvent)
    
    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]])
    const epochId = generateId([ADDRESSES[0], "1"])
    assert.fieldEquals(MEMBER_ENTITY, memberId, "os", ADDRESSES[0])
    assert.fieldEquals(MEMBER_ENTITY, memberId, "address", ADDRESSES[1])
    assert.fieldEquals(MEMBER_ENTITY, memberId, "alias", alias)
    assert.fieldEquals(MEMBER_ENTITY, memberId, "epoch", epochId)

    clearStore()
  });

  test("Should successfully handle stake", () => {   
    const tokensStakedEvent = createTokensStakedEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    )

    handleTokensStaked(tokensStakedEvent)

    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]])    
    const stakeId = generateId(
      [tokensStakedEvent.transaction.hash.toHex(), tokensStakedEvent.logIndex.toString()]
    )
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "1")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "os", ADDRESSES[0])
    assert.fieldEquals(STAKE_ENTITY, stakeId, "epochNumber", "1")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "type", STAKETYPE_STAKE)
    assert.fieldEquals(STAKE_ENTITY, stakeId, "amount", "1")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "lockDuration", "10")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "member", memberId)

    clearStore()
  });

  test("Should successfully handle unstake", () => {   
    const tokensStakedEvent = createTokensStakedEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    )

    handleTokensStaked(tokensStakedEvent)

    const tokensUnstakedEvent = createTokensUnstakedEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    )

    handleTokensUnstaked(tokensUnstakedEvent)

    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]])    
    const stakeId = generateId(
      [tokensUnstakedEvent.transaction.hash.toHex(), tokensUnstakedEvent.logIndex.toString()]
    )
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "0")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "os", ADDRESSES[0])
    assert.fieldEquals(STAKE_ENTITY, stakeId, "epochNumber", "1")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "type", STAKETYPE_UNSTAKE)
    assert.fieldEquals(STAKE_ENTITY, stakeId, "amount", "1")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "lockDuration", "10")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "member", memberId)

    clearStore()
  });

  test("Should successfully update member stake amount", () => {    
    const initialStake = createTokensStakedEvent(
      ADDRESSES[0], ADDRESSES[1], 1000, 10, 1
    )

    handleTokensStaked(initialStake)

    const memberId = generateId([ADDRESSES[0], ADDRESSES[1]])    
    const stakeId = generateId(
      [initialStake.transaction.hash.toHex(), initialStake.logIndex.toString()]
    )
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "1")
    assert.fieldEquals(STAKE_ENTITY, stakeId, "type", STAKETYPE_STAKE)   
    assert.fieldEquals(STAKE_ENTITY, stakeId, "amount", "1")

    const tokensStakedEvent = createTokensStakedEvent(
      ADDRESSES[0], ADDRESSES[1], 10000, 10, 2
    )

    handleTokensStaked(tokensStakedEvent)

    const stakeId2 = generateId(
      [tokensStakedEvent.transaction.hash.toHex(), tokensStakedEvent.logIndex.toString()]
    )
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "11")
    assert.fieldEquals(STAKE_ENTITY, stakeId2, "type", STAKETYPE_STAKE)   
    assert.fieldEquals(STAKE_ENTITY, stakeId2, "amount", "10")

    const tokensUnstakedEvent = createTokensUnstakedEvent(
      ADDRESSES[0], ADDRESSES[1], 11000, 10, 2
    )

    handleTokensUnstaked(tokensUnstakedEvent)

    //Seems like these mock events generate the same hash everytime. Something to beware of
    const stakeId3 = generateId(
      [tokensUnstakedEvent.transaction.hash.toHex(), tokensUnstakedEvent.logIndex.toString()]
    )    
    assert.fieldEquals(MEMBER_ENTITY, memberId, "stakedAmt", "0")
    assert.fieldEquals(STAKE_ENTITY, stakeId3, "type", STAKETYPE_UNSTAKE)   
    assert.fieldEquals(STAKE_ENTITY, stakeId3, "amount", "11")    

    clearStore()
  });

  test("Should successfully handle endorsement", () => {    
    const endorsementGivenEvent = createEndorsementGivenEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    )

    handleEndorsementGiven(endorsementGivenEvent)

    let endorsementId = generateId([ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], "1"])    
    let fromId = generateId([ADDRESSES[0], ADDRESSES[1]])
    let toId = generateId([ADDRESSES[0], ADDRESSES[2]])    
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "os", ADDRESSES[0])
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "os", ADDRESSES[0])
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "epochNumber", "1")
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "amount", "0.01")
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "from", fromId)
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "to", toId)

    clearStore()
  });

  test("Should successfully handle withdraw endorsement", () => {
    const endorsementGivenEvent = createEndorsementGivenEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 10, 1
    )

    handleEndorsementGiven(endorsementGivenEvent)

    const endorsementWithdrawnEvent = createEndorsementWithdrawnEvent(
      ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], 5, 1
    )

    handleEndorsementWithdrawn(endorsementWithdrawnEvent)

    let endorsementId = generateId([ADDRESSES[0], ADDRESSES[1], ADDRESSES[2], "1"])    
    let fromId = generateId([ADDRESSES[0], ADDRESSES[1]])
    let toId = generateId([ADDRESSES[0], ADDRESSES[2]])    
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "os", ADDRESSES[0])
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "epochNumber", "1")
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "amount", "0.005")
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "from", fromId)
    assert.fieldEquals(ENDORSEMENT_ENTITY, endorsementId, "to", toId)

    clearStore()
  });
}