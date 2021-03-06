import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);

export const DEFAULT_DECIMALS = 3;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const FACTORY_ADDRESS = 'default-os-factory'

// TokenTransaction enum
export const PEER_REWARD = 'PEER_REWARD'
export const MINING_REWARD = 'MINING_REWARD'
export const BONUS = 'BONUS'
export const TRANSFER = 'TRANSFER'
export const BURN = 'BURN'

// VaultTransfer enum
export const DEPOSIT = 'DEPOSIT'
export const WITHDRAW = 'WITHDRAW'

// StakeType enum
export const STAKETYPE_UNSTAKE = 'UNSTAKE';
export const STAKETYPE_STAKE = 'STAKE';

// EndorsementType enum
export const ENDORSEMENTTYPE_GIVEN = 'GIVEN';
export const ENDORSEMENTTYPE_WITHDRAWN = 'WITHDRAWN';

// VaultTransaction enum
export const VAULTTYPE_DEPOSITED = 'DEPOSIT'
export const VAULTTYPE_WITHDRAWN = 'WITHDRAW'