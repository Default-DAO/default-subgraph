import { test, assert, clearStore } from 'matchstick-as/assembly/index'
import { Bytes } from "@graphprotocol/graph-ts";
import { handleModuleInstalled, handleOwnershipTransferred } from "../mappings/DefaultOS";
import { DefaultOS } from "../../generated/schema";
import { createModuleInstalledMockEvent, createOwnershipTransferredMockEvent } from './utils/events';
import { generateId } from '../utils/helpers';
import { ADDRESSES, TOKEN_ENTITY, MODULE_ENTITY, OS_ENTITY } from './utils/constants';
import { debug } from "matchstick-as/assembly/log";

export function runTests(): void {
  test("Should save token entity", () => {    
    
    /// simulate a module installation for the token
    const moduleInstalledEvent = createModuleInstalledMockEvent(
      ADDRESSES[0], ADDRESSES[1], "TKN"
    );

    handleModuleInstalled(moduleInstalledEvent);

    const tokenId = generateId([ADDRESSES[0], ADDRESSES[1]]);
    assert.fieldEquals(TOKEN_ENTITY, tokenId, "os", ADDRESSES[0]);

    clearStore();
  });

  test("Should save the correct module", () => {    

    const moduleKeyCode = "TKN";
    const moduleInstalledEvent = createModuleInstalledMockEvent(
      ADDRESSES[0], ADDRESSES[1], moduleKeyCode
    );

    handleModuleInstalled(moduleInstalledEvent);

    const moduleId = generateId([ADDRESSES[0], moduleKeyCode]);
    assert.fieldEquals(MODULE_ENTITY, moduleId, "os", ADDRESSES[0]);
    assert.fieldEquals(MODULE_ENTITY, moduleId, "address", ADDRESSES[1]);
    assert.fieldEquals(MODULE_ENTITY, moduleId, "keycode", moduleKeyCode);

    const moduleKeyCode2 = "EPC";
    const moduleInstalledEvent2 = createModuleInstalledMockEvent(
      ADDRESSES[2], ADDRESSES[3], moduleKeyCode2
    );

    handleModuleInstalled(moduleInstalledEvent2);

    const moduleId2 = generateId([ADDRESSES[2], moduleKeyCode2])
    assert.fieldEquals(MODULE_ENTITY, moduleId2, "os", ADDRESSES[2])
    assert.fieldEquals(MODULE_ENTITY, moduleId2, "address", ADDRESSES[3])
    assert.fieldEquals(MODULE_ENTITY, moduleId2, "keycode", moduleKeyCode2)

    clearStore();
  });

  test("Should replace an existing module instance when re-installing", () => {    
    const moduleKeyCode = "TKN";
    const moduleInstalledEvent = createModuleInstalledMockEvent(
      ADDRESSES[0], ADDRESSES[1], moduleKeyCode
    );

    handleModuleInstalled(moduleInstalledEvent);

    const moduleInstalledEvent2 = createModuleInstalledMockEvent(
      // OS address stays the same, module address is different
      ADDRESSES[0], ADDRESSES[2], moduleKeyCode
    );

    handleModuleInstalled(moduleInstalledEvent2);

    const moduleId2 = generateId([ADDRESSES[0], moduleKeyCode]);
    assert.fieldEquals(MODULE_ENTITY, moduleId2, "os", ADDRESSES[0]);
    assert.fieldEquals(MODULE_ENTITY, moduleId2, "address", ADDRESSES[2]);
    assert.fieldEquals(MODULE_ENTITY, moduleId2, "keycode", moduleKeyCode);

    clearStore();
  });

  test("Should transfer ownership successfully", () => {    
    let defaultOs = new DefaultOS(ADDRESSES[1]);
    defaultOs.save();

    const ownershipTransferredEvent = createOwnershipTransferredMockEvent(
      ADDRESSES[1], ADDRESSES[0]
    );

    handleOwnershipTransferred(ownershipTransferredEvent);
    
    assert.fieldEquals(OS_ENTITY, ADDRESSES[0], "id", ADDRESSES[0]);

    clearStore();
  });
}