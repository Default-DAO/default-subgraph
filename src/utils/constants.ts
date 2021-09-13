import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);

// StakeType enum
export const FACTORY_ADDRESS = ''
export const STAKETYPE_UNSTAKE = 'UNSTAKE';
export const STAKETYPE_STAKE = 'STAKE';

// EndorsementType enum
export let ENDORSEMENTTYPE_GIVEN = 'GIVEN';
export const ENDORSEMENTTYPE_WITHDRAWN = 'WITHDRAWN';

// VaultTransaction enum
export const VAULTTYPE_DEPOSITED = 'DEPOSIT'
export const VAULTTYPE_WITHDRAWN = 'WITHDRAW'