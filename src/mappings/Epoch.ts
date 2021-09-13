import { EpochIncremented } from '../../generated/templates/Epoch/Epoch';
import { Epoch } from '../../generated/schema'
import {
  generateId,
} from '../utils/helpers';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleEpochIncremented(event: EpochIncremented): void {  
  const os = event.params.os.toHexString();
  const currentEpoch = event.params.epoch.toHexString();
  const incrementedBy = event.params.member.toHexString(); 
  let epochSchema = new Epoch(generateId([os,currentEpoch]))
  epochSchema.os = os
  epochSchema.member = incrementedBy
  epochSchema.epoch = currentEpoch
  epochSchema.staked = BigInt.fromI32(0).toBigDecimal()
  
  epochSchema.save()
}