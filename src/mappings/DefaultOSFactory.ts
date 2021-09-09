import { DaoCreated } from '../../generated/DefaultOSFactory/DefaultOSFactory';
import { FACTORY_ADDRESS } from '../utils/constants'
import { DefaultOSFactory, DefaultOS } from '../../generated/schema'
import { DefaultOS as DefaultOSTemplate } from '../../generated/templates';

export function handleDaoCreated(event: DaoCreated): void {  
  let factory = DefaultOSFactory.load(FACTORY_ADDRESS)
  if (factory === null) {
    factory = new DefaultOSFactory(FACTORY_ADDRESS)    
    factory.id = FACTORY_ADDRESS
  }
  factory.osCount = 0
  factory.save()

  const osAddress = event.params.os.toHexString()
  let os = new DefaultOS(osAddress)  
  os.id = event.params.id
  os.address = osAddress
  os.save()

  DefaultOSTemplate.create(event.params.os);
}