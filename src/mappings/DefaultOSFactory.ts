import { OSCreated } from '../../generated/DefaultOSFactory/DefaultOSFactory';
import { FACTORY_ADDRESS } from '../utils/constants'
import { DefaultOS as DefaultOSTemplate } from '../../generated/templates';
import { getOrCreateFactory, getOrCreateOs } from '../utils/entities'

// export { runTests } from '../tests/DefaultOSFactory.test'

export function handleOSCreated(event: OSCreated): void {
  let factory = getOrCreateFactory(FACTORY_ADDRESS)
  factory.osCount += 1
  factory.save()

  let id = event.params.os
  let name = event.params.id // id is the name of the OS
  let defaultOs = getOrCreateOs(id, name.toString())
  defaultOs.save()

  DefaultOSTemplate.create(id);
}