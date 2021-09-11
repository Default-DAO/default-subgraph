import { ByteArray } from '@graphprotocol/graph-ts'
import { ModuleInstalled } from '../../generated/templates/DefaultOS/DefaultOS';
import { Epoch as EpochTemplate } from '../../generated/templates';
import { Members as MembersTemplate } from '../../generated/templates';
import { Mining as MiningTemplate } from '../../generated/templates';
import { PeerRewards as PeerRewardsTemplate } from '../../generated/templates';
import { Token as TokenTemplate } from '../../generated/templates';
import { Treasury as TreasuryTemplate } from '../../generated/templates';

export function handleModuleInstalled(event: ModuleInstalled): void {
  switch(event.params.moduleKeycode) {
    case(ByteArray.fromI32("EPC")):
      EpochTemplate.create(event.params.module)
      break
    case(ByteArray.fromI32("MBR")):
      MembersTemplate.create(event.params.module)
      break
    case(ByteArray.fromI32("MNG")):
      MiningTemplate.create(event.params.module)
      break
    case(ByteArray.fromI32("PAY")):
      PeerRewardsTemplate.create(event.params.module)
      break
    case(ByteArray.fromI32("TKN")):
      TokenTemplate.create(event.params.module)
      break
    case(ByteArray.fromI32("TSY")):
      TreasuryTemplate.create(event.params.module)
      break
  }  
}