import { newMockEvent } from 'matchstick-as/assembly/index'
import { OSCreated } from "../../../generated/DefaultOSFactory/DefaultOSFactory";
import { ModuleInstalled, OwnershipTransferred } from "../../../generated/templates/DefaultOS/DefaultOS";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { EpochIncremented } from '../../../generated/templates/Epoch/Epoch';
import { debug } from "matchstick-as/assembly/log";

// ##################################
// ######## DefaultOSFactory ########
// ##################################

export function createOSCreatedMockEvent(os: string, id: string): OSCreated {
  let mockEvent = newMockEvent();
  let osCreatedEvent = new OSCreated(mockEvent.address, mockEvent.logIndex, mockEvent.transactionLogIndex,
    mockEvent.logType, mockEvent.block, mockEvent.transaction, mockEvent.parameters);

  let osParam = new ethereum.EventParam("os", ethereum.Value.fromAddress(Address.fromString(os)));
  let idParam = new ethereum.EventParam(
    "name",
    //Not sure why just converting to Bytes straight from UTF8 fails
    ethereum.Value.fromBytes(Bytes.fromHexString(Bytes.fromUTF8(id).toHexString()) as Bytes)
  );

  osCreatedEvent.parameters = new Array();
  osCreatedEvent.parameters.push(osParam);
  osCreatedEvent.parameters.push(idParam);

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
    "moduleKeyCode", ethereum.Value.fromBytes(Bytes.fromHexString(moduleKeyCode) as Bytes)
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

  return epochIncrementedEvent;
}