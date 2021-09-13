import { EpochIncremented } from '../../generated/templates/Epoch/Epoch';
import { Epoch } from '../../generated/schema'
import {
  generateId,
} from '../utils/helpers';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleEpochIncremented(event: EpochIncremented): void {  
  const {os, epoch, member} = event.params  
  
  let epochSchema = new Epoch(generateId([os,epoch]))
  epochSchema.os = os.toHexString()
  epochSchema.member = member.toHexString()
  epochSchema.epoch = epoch
  epochSchema.staked = BigInt.fromI32(0).toBigDecimal()
  
  epochSchema.save()
}