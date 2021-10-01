import {
  VaultOpened,
  VaultFeeChanged,
  Deposited,
  Withdrawn
} from '../../generated/templates/Treasury/Treasury';
import { VaultTransaction } from '../../generated/schema'
import { generateId, toDecimal } from '../utils/helpers';
import { 
  getOrCreateOs, 
  getOrCreateVault, 
  getOrCreateMember
} from '../utils/entities'
import { VAULTTYPE_DEPOSITED, VAULTTYPE_WITHDRAWN } from '../utils/constants'

export function handleVaultOpened(event: VaultOpened): void {
  let vaultSchema = getOrCreateVault(
    event.params.os, 
    event.params.vault, 
    event.params.name, 
    event.params.symbol, 
    event.params.decimals, 
    event.params.fee
  );

  vaultSchema.save();
}

export function handleVaultFeeChanged(event: VaultFeeChanged): void {
  let vaultSchema = getOrCreateVault(event.params.os, event.params.vault);
  vaultSchema.fee = event.params.newFee;

  vaultSchema.save();
}

export function handleDeposited(event: Deposited): void {
  _handleVaultTransaction(event, VAULTTYPE_DEPOSITED);
}

export function handleWithdrawn(event: Withdrawn): void {
  _handleVaultTransaction(event, VAULTTYPE_WITHDRAWN);
}

export function _handleVaultTransaction<T>(event: T, type: string): void {
  let os = event.params.os;
  let vault = event.params.vault;
  let epoch = event.params.epoch;

  let amountDec = toDecimal(event.params.amount);

  // update the total amount in the vault
  let vaultSchema = getOrCreateVault(os, vault);
  if (type === VAULTTYPE_DEPOSITED) {
    vaultSchema.amount = vaultSchema.amount.plus(amountDec);
  } else {
    vaultSchema.amount = vaultSchema.amount.minus(amountDec);
  }
  
  let osId = getOrCreateOs(os).id;
  let memberId = getOrCreateMember(os, event.params.member).id;
  let vaultId = vaultSchema.id;

  vaultSchema.save();

  // save the actual transaction data (deposit / withdraw)
  let vaultTransactionId = generateId([os.toHexString(), vault.toHexString(), epoch.toString()])
  let vaultTransaction = new VaultTransaction(vaultTransactionId);
  vaultTransaction.os = osId;
  vaultTransaction.vault = vaultId;
  vaultTransaction.member = memberId;
  vaultTransaction.epochNumber = epoch;
  vaultTransaction.amount = amountDec;
  vaultTransaction.type = type;

  vaultTransaction.save();
}