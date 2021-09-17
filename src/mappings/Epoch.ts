import { EpochIncremented } from '../../generated/templates/Epoch/Epoch'
import { Epoch } from '../../generated/schema'
import { getOrCreateOs, getOrCreateEpoch } from '../utils/entities'
import { BIGDECIMAL_ZERO } from '../utils/constants'

export function handleEpochIncremented(event: EpochIncremented): void {  
  // os address of the contract that generated the event
  let osAddress = event.address
  let epochNumber = event.params.epoch
  let id = `${osAddress}-${epochNumber}`

  // create new epoch
  let epoch = getOrCreateEpoch(osAddress, epochNumber)

  epoch.save()
}