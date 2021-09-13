import {
  VaultOpened,
  VaultFeeChanged,
  Deposited,
  Withdrawn
} from '../../generated/templates/Treasury/Treasury';
import { 
  Vault, 
  VaultTransaction, 
  Member, 
  VaultEpochInfo,
  VaultMemberInfo,
  VaultMemberEpochInfo
} from '../../generated/schema'
import {
  generateId,
  toDecimal
} from '../utils/helpers';
import {
  BIGDECIMAL_ZERO,
  VAULTTYPE_DEPOSITED,
  VAULTTYPE_WITHDRAWN
} from '../utils/constants'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

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

  let vaultTransaction = new VaultTransaction(generateId([vault, epoch]))
  vaultTransaction.os = os.toHexString()
  vaultTransaction.epoch = epoch
  vaultTransaction.vault = vault.toHexString()
  vaultTransaction.member = Member.load(member.toHexString()).id;
  vaultTransaction.amount = amountDec
  vaultTransaction.type = type

  const vaultEpochInfoId = generateId([epoch, vault])
  let vaultEpochInfo = VaultEpochInfo.load(vaultEpochInfoId)
  if (VaultEpochInfo === null) {
    vaultEpochInfo = new VaultEpochInfo(vaultEpochInfoId) 
    vaultEpochInfo.os = os.toHexString()
    vaultEpochInfo.epoch = epoch
    vaultEpochInfo.vault = vault.toHexString()
    vaultEpochInfo.amount = new BigDecimal(new BigInt(0))
  }
  if (type === VAULTTYPE_DEPOSITED) {
    vaultEpochInfo.amount = vaultEpochInfo.amount.plus(amountDec);
  } else {
    vaultEpochInfo.amount = vaultEpochInfo.amount.minus(amountDec);
  }

  const vaultMemberInfoId = generateId([member,vault])
  let vaultMemberInfo = VaultMemberInfo.load(vaultMemberInfoId)
  if (VaultMemberInfo === null) {
    vaultMemberInfo = new VaultMemberInfo(vaultMemberInfoId) 
    vaultMemberInfo.os = os.toHexString()
    vaultMemberInfo.epoch = epoch
    vaultMemberInfo.member = member.toHexString()
    vaultMemberInfo.vault = vault.toHexString()
    vaultMemberInfo.amount = new BigDecimal(new BigInt(0))
  }
  if (type === VAULTTYPE_DEPOSITED) {
    vaultMemberInfo.amount = vaultMemberInfo.amount.plus(amountDec);
  } else {
    vaultMemberInfo.amount = vaultMemberInfo.amount.minus(amountDec);
  }

  const vaultMemberEpochInfoId = generateId([
    epoch,member,vault
  ])
  let vaultMemberEpochInfo = VaultMemberEpochInfo.load(vaultMemberEpochInfoId)
  if (VaultMemberEpochInfo === null) {
    vaultMemberEpochInfo = new VaultMemberEpochInfo(vaultMemberEpochInfoId) 
    vaultMemberEpochInfo.os = os.toHexString()
    vaultMemberEpochInfo.epoch = epoch
    vaultMemberEpochInfo.member = member.toHexString()
    vaultMemberEpochInfo.vault = vault.toHexString()
    vaultMemberEpochInfo.amount = new BigDecimal(new BigInt(0))
  }
  if (type === VAULTTYPE_DEPOSITED) {
    vaultMemberEpochInfo.amount = vaultMemberEpochInfo.amount.plus(amountDec);
  } else {
    vaultMemberEpochInfo.amount = vaultMemberEpochInfo.amount.minus(amountDec);
  }

  vaultSchema.save()
  vaultEpochInfo.save()
  vaultMemberInfo.save()
  vaultMemberEpochInfo.save()
  vaultTransaction.save()
}