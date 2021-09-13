import { ByteArray } from '@graphprotocol/graph-ts'
import { ModuleInstalled } from '../../generated/templates/DefaultOS/DefaultOS';
import { Epoch as EpochTemplate } from '../../generated/templates';
import { Members as MembersTemplate } from '../../generated/templates';
import { Mining as MiningTemplate } from '../../generated/templates';
import { PeerRewards as PeerRewardsTemplate } from '../../generated/templates';
import { Treasury as TreasuryTemplate } from '../../generated/templates';
import { Token } from '../../generated/schema'

export function handleModuleInstalled(event: ModuleInstalled): void {
  switch(event.params.moduleKeycode.toHexString()) {
    case("EPC"):
      EpochTemplate.create(event.params.module)
      break
    case("MBR"):
      MembersTemplate.create(event.params.module)
      break
    case("MNG"):
      MiningTemplate.create(event.params.module)
      break
    case("PAY"):
      PeerRewardsTemplate.create(event.params.module)
      break
    case("TKN"):      
      const token = new Token(event.params.module.toHexString())
      token.save()
      break
    case("TSY"):
      TreasuryTemplate.create(event.params.module)
      break
  }  
}