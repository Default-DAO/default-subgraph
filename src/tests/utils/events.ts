import { newMockEvent } from 'matchstick-as/assembly/index'
import { ModuleInstalled, OwnershipTransferred } from "../../../generated/templates/DefaultOS/DefaultOS";
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { debug } from "matchstick-as/assembly/log";

export function createModuleInstalledEvent(os: string, module: string, moduleKeyCode: string): ModuleInstalled {
  let mockEvent = newMockEvent()
  let moduleInstalledEvent = new ModuleInstalled(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let moduleParam = new ethereum.EventParam("module", ethereum.Value.fromAddress(Address.fromString(module)));
  
  let moduleKeyCodeParam = new ethereum.EventParam(
    "moduleKeyCode", ethereum.Value.fromBytes(Bytes.fromHexString(moduleKeyCode) as Bytes)
  );

  moduleInstalledEvent.parameters = new Array();
  moduleInstalledEvent.parameters.push(osParam);
  moduleInstalledEvent.parameters.push(moduleParam);
  moduleInstalledEvent.parameters.push(moduleKeyCodeParam);    

  return moduleInstalledEvent
}

export function createOwnershipTransferredEvent(previousOwner: string, newOwner: string): OwnershipTransferred {
  let mockEvent = newMockEvent()
  let ownershipTransferredEvent = new OwnershipTransferred(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters)

  let previousOwnerParam = new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(Address.fromString(previousOwner)));
  let newOwnerParam = new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(Address.fromString(newOwner)));

  ownershipTransferredEvent.parameters = new Array();
  ownershipTransferredEvent.parameters.push(previousOwnerParam);
  ownershipTransferredEvent.parameters.push(newOwnerParam);  

  return ownershipTransferredEvent
}
