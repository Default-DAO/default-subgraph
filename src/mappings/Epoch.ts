import { EpochIncremented } from '../../generated/templates/Epoch/Epoch'
import { getOrCreateEpoch } from '../utils/entities'

// export { runTests } from '../tests/DefaultOSFactory.test'

export function handleEpochIncremented(event: EpochIncremented): void {
  // os address of the contract that generated the event
  let osAddress = event.params.os
  let epochNumber = event.params.epoch

  // update epoch number
  let epoch = getOrCreateEpoch(osAddress, epochNumber)
  epoch.number = epochNumber

  epoch.save()
}