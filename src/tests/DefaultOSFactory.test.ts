import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { handleOSCreated } from "../mappings/DefaultOSFactory";
import { DefaultOSFactory } from "../../generated/schema";
import { createOSCreatedMockEvent } from './utils/events';
import { ADDRESSES, EPOCH_ENTITY, FACTORY_ENTITY, OS_ENTITY } from './utils/constants';
import { FACTORY_ADDRESS } from '../utils/constants';
import { debug } from "matchstick-as/assembly/log";
import { generateId } from '../utils/helpers';

export function runTests(): void {
  
  test("Should create and save a new OS successfully", () => {    
    const osCreatedEvent = createOSCreatedMockEvent(
      ADDRESSES[0], "default", "Default"
    );

    handleOSCreated(osCreatedEvent);
    
    const epochId = generateId([ADDRESSES[0], "1"]);
    assert.fieldEquals(OS_ENTITY, ADDRESSES[0], "name", "Default");
    assert.fieldEquals(EPOCH_ENTITY, epochId, "os", ADDRESSES[0]);
    assert.fieldEquals(EPOCH_ENTITY, epochId, "number", "1");

    clearStore();
  });

  test("Should update factory's os count", () => {    
    const factory = new DefaultOSFactory(FACTORY_ADDRESS);
    factory.osCount = 0;
    factory.save();

    // simulate first OS creation

    const osCreatedEvent = createOSCreatedMockEvent(
      ADDRESSES[1], "default", "Default"
    );
    handleOSCreated(osCreatedEvent);

    assert.fieldEquals(FACTORY_ENTITY, FACTORY_ADDRESS, "osCount", "1");

    // simulate second OS creation

    const osCreatedEvent2 = createOSCreatedMockEvent(
      ADDRESSES[2], "station", "Station"
    );
    handleOSCreated(osCreatedEvent2);

    assert.fieldEquals(FACTORY_ENTITY, FACTORY_ADDRESS, "osCount", "2");

    clearStore();
  });
}