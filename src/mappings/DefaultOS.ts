import { ModuleInstalled, OwnershipTransferred } from '../../generated/templates/DefaultOS/DefaultOS';
import { Epoch as EpochTemplate } from '../../generated/templates';
import { Members as MembersTemplate } from '../../generated/templates';
import { Mining as MiningTemplate } from '../../generated/templates';
import { PeerRewards as PeerRewardsTemplate } from '../../generated/templates';
import { Treasury as TreasuryTemplate } from '../../generated/templates';
import { getOrCreateOs, getOrCreateModule } from '../utils/entities'
import { Token } from '../../generated/schema'
import { generateId } from '../utils/helpers';

// export { runTests } from '../tests/DefaultOS.test'

export function handleModuleInstalled(event: ModuleInstalled): void {
  const os = event.params.os
  const module = event.params.module
  
  let moduleKeyCode = event.params.moduleKeyCode.toString()  

  // unfortunately switch statements using strings 
  // are not supported by assemblyscript
  if (moduleKeyCode == "EPC") EpochTemplate.create(os)
  else if (moduleKeyCode == "MBR") MembersTemplate.create(os)
  else if (moduleKeyCode == "MNG") MiningTemplate.create(os)
  else if (moduleKeyCode == "PAY") PeerRewardsTemplate.create(os)
  else if (moduleKeyCode == "TSY") TreasuryTemplate.create(os)
  else if (moduleKeyCode == "TKN") {                 
    let token = new Token(generateId([os.toHexString(), module.toHexString()]))
    token.os = os.toHexString()
    token.save();
  }

  let mod = getOrCreateModule(os, module, moduleKeyCode)
  mod.address = module.toHexString()
  mod.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  // this may not be a viable way to handle this event.
  // we should optimize contracts to set owner in constructor if possible
  let os = getOrCreateOs(event.params.previousOwner)
  os.id = event.params.newOwner.toHexString()
  os.save()
}