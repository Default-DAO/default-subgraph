import { OSCreated } from '../../generated/DefaultOSFactory/DefaultOSFactory';
import { FACTORY_ADDRESS } from '../utils/constants';
import { DefaultOS as DefaultOSTemplate } from '../../generated/templates';
import { getOrCreateFactory, getOrCreateOs } from '../utils/entities';

// export { runTests } from '../tests/DefaultOSFactory.test'

export function handleOSCreated(event: OSCreated): void {
  // look for the factory entity, or create a new one
  let factory = getOrCreateFactory(FACTORY_ADDRESS);
  factory.osCount += 1; // increment the number of OS's created by our contract
  factory.save();

  let id = event.params.os;
  let name = event.params.id; // id is the name of the OS
  let defaultOs = getOrCreateOs(id, name.toString());
  defaultOs.save();

  DefaultOSTemplate.create(id);
}