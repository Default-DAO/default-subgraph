import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { handleOSCreated } from "../mappings/DefaultOSFactory";
import { DefaultOSFactory } from "../../generated/schema";
import { createOSCreatedEvent } from './utils/events';
import { ADDRESSES, FACTORY_ENTITY, OS_ENTITY } from './utils/constants';
import { FACTORY_ADDRESS } from '../utils/constants';
import { debug } from "matchstick-as/assembly/log";

export function runTests(): void {
  test("Should create OS", () => {    
    const osCreatedEvent = createOSCreatedEvent(
      ADDRESSES[0], "default"
    )

    handleOSCreated(osCreatedEvent)
    
    assert.fieldEquals(OS_ENTITY, ADDRESSES[0], "name", "default")

    clearStore()
  });

  test("Should update factory's os count", () => {    
    const factory = new DefaultOSFactory(FACTORY_ADDRESS)
    factory.osCount = 0
    factory.save()

    const osCreatedEvent = createOSCreatedEvent(
      ADDRESSES[1], "default"
    )
    handleOSCreated(osCreatedEvent)

    assert.fieldEquals(FACTORY_ENTITY, FACTORY_ADDRESS, "osCount", "1")

    const osCreatedEvent2 = createOSCreatedEvent(
      ADDRESSES[2], "station"
    )
    handleOSCreated(osCreatedEvent2)

    assert.fieldEquals(FACTORY_ENTITY, FACTORY_ADDRESS, "osCount", "2")

    clearStore()
  });
}