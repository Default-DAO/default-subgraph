import { EpochIncremented } from '../../generated/templates/Epoch/Epoch';
import { Epoch } from '../../generated/schema'
import {
  generateId,
} from '../utils/helpers';

export function handleEpochIncremented(event: EpochIncremented): void {  
  const os = event.params.os.toHexString();
  const currentEpoch = event.params.epoch.toHexString();
  const incrementedBy = event.params.member.toHexString(); 
  let epoch = new Epoch(generateId([os,currentEpoch]))
  epoch.os = os
  epoch.member = incrementedBy
  epoch.epoch = currentEpoch
  
  epoch.save()
}