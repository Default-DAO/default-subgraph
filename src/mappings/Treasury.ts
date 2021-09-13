import {
  VaultOpened,
  VaultFeeChanged,
  Deposited,
  Withdrawn
} from '../../generated/templates/Treasury/Treasury';
import { Vault, VaultTransaction, Member } from '../../generated/schema'
import {
  generateId,
  toDecimal
} from '../utils/helpers';
import {
  BIGDECIMAL_ZERO,
  VAULTTYPE_DEPOSITED,
  VAULTTYPE_WITHDRAWN
} from '../utils/constants'
import { BigDecimal } from '@graphprotocol/graph-ts';

export function handleVaultOpened(event: VaultOpened): void {
  const { os, vault, name, symbol, decimals, fee } = event.params

  let vaultSchema = new Vault(vault.toHexString())
  vaultSchema.os = os.toHexString()
  vaultSchema.name = name
  vaultSchema.symbol = symbol
  vaultSchema.decimals = decimals
  vaultSchema.fee = fee
  vaultSchema.amount = BIGDECIMAL_ZERO

  vaultSchema.save()
}

export function handleVaultFeeChanged(event: VaultFeeChanged): void {
  const { vault, newFee } = event.params

  let vaultSchema = Vault.load(vault.toHexString())
  vaultSchema.fee = new BigDecimal(newFee)

  vaultSchema.save()
}

export function handleDeposited(event: Deposited): void {
  _handleVaultTransaction(event, VAULTTYPE_DEPOSITED)
}

export function handleWithdrawn(event: Withdrawn): void {
  _handleVaultTransaction(event, VAULTTYPE_WITHDRAWN)
}

export function _handleVaultTransaction(event: Deposited | Withdrawn, type: string) {
  const { os, vault, member, amount, epoch } = event.params
  const amountDec = toDecimal(amount)

  let vaultSchema = Vault.load(vault.toHexString())

  if (type === VAULTTYPE_DEPOSITED) {
    vaultSchema.amount = vaultSchema.amount.plus(amountDec);
  } else {
    vaultSchema.amount = vaultSchema.amount.minus(amountDec);
  }

  let vaultTransaction = new VaultTransaction(generateId([vault.toHexString(), epoch.toHexString()]))

  vaultTransaction.os = os.toHexString()
  vaultTransaction.epoch = epoch
  vaultTransaction.vault = vault.toHexString()
  vaultTransaction.member = Member.load(member.toHexString()).id;
  vaultTransaction.amount = amountDec
  vaultTransaction.type = type

  vaultSchema.save()
  vaultTransaction.save()
}