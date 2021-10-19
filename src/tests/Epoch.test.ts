import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { createEpochIncrementedMockEvent } from './utils/events';
import { ADDRESSES, EPOCH_ENTITY } from './utils/constants';
import { handleEpochIncremented } from '../mappings/Epoch';
import { generateId } from '../utils/helpers';

export function runTests(): void {
  test("Should save updated epochs successfully", () => {    
    const epochIncrementedEvent = createEpochIncrementedMockEvent(ADDRESSES[0], 1);

    handleEpochIncremented(epochIncrementedEvent);
    
    const epochId = generateId([ADDRESSES[0], "1"]);
    assert.fieldEquals(EPOCH_ENTITY, epochId, "os", ADDRESSES[0]);
    assert.fieldEquals(EPOCH_ENTITY, epochId, "number", "1");
    assert.fieldEquals(EPOCH_ENTITY, epochId, "staked", "0");

    clearStore();
  });
}