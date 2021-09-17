import { OSCreated } from '../../generated/DefaultOSFactory/DefaultOSFactory';
import { FACTORY_ADDRESS } from '../utils/constants'
import { DefaultOSFactory, DefaultOS } from '../../generated/schema'
import { DefaultOS as DefaultOSTemplate } from '../../generated/templates';
import { getOrCreateOs } from '../utils/entities'

export function handleOSCreated(event: OSCreated): void {
  let factory = DefaultOSFactory.load(FACTORY_ADDRESS)
  if (factory === null) {
    factory = new DefaultOSFactory(FACTORY_ADDRESS)
    factory.id = FACTORY_ADDRESS
    factory.osCount = 0
  }
  factory.osCount += 1
  factory.save()

  let os = event.params.os
  let id = event.params.id // id is the name of the OS
  let defaultOs = getOrCreateOs(os, id)
  defaultOs.save()

  DefaultOSTemplate.create(os);
}