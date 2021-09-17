import { ModuleInstalled } from '../../generated/templates/DefaultOS/DefaultOS';
import { Epoch as EpochTemplate } from '../../generated/templates';
import { Members as MembersTemplate } from '../../generated/templates';
import { Mining as MiningTemplate } from '../../generated/templates';
import { PeerRewards as PeerRewardsTemplate } from '../../generated/templates';
import { Treasury as TreasuryTemplate } from '../../generated/templates';
import { Token } from '../../generated/schema'

export function handleModuleInstalled(event: ModuleInstalled): void {
  let moduleKeyCode = event.params.moduleKeyCode.toString()

  // unfortunately switch statements using strings 
  // are not supported by assemblyscript
  if (moduleKeyCode === "EPC") EpochTemplate.create(event.params.os)
  else if (moduleKeyCode === "MBR") MembersTemplate.create(event.params.os)
  else if (moduleKeyCode === "MNG") MiningTemplate.create(event.params.os)
  else if (moduleKeyCode === "PAY") PeerRewardsTemplate.create(event.params.os)
  else if (moduleKeyCode === "TSY") TreasuryTemplate.create(event.params.os)
  else if (moduleKeyCode === "TKN") { 
    let token = new Token(event.params.os.toHexString())
    token.save();
  }

}