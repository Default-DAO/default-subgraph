import { test, assert, clearStore, newMockEvent } from 'matchstick-as/assembly/index'
import { success } from "matchstick-as/assembly/log";
import { ethereum } from "@graphprotocol/graph-ts";
import { DefaultOS } from "../../generated/templates/DefaultOS/DefaultOS";
import { handleModuleInstalled, handleOwnershipTransferred } from "../mappings/DefaultOS";

export function runTests(): void {
  test("Should save token module", () => {
    
    success("")
  });
}