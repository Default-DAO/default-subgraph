import {
  VaultOpened,
  VaultFeeChanged,
  Deposited,
  Withdrawn
} from '../../generated/templates/Treasury/Treasury';
import { 
  VaultTransaction, 
  VaultEpochInfo,
  VaultMemberInfo,
  VaultMemberEpochInfo
} from '../../generated/schema'
import {
  toDecimal
} from '../utils/helpers';
import { 
  getOrCreateOs, 
  getOrCreateVault, 
  getOrCreateMember,
  getOrCreateEpoch,
 } from '../utils/entities'
import {
  BIGDECIMAL_ZERO,
  VAULTTYPE_DEPOSITED,
  VAULTTYPE_WITHDRAWN
} from '../utils/constants'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function handleVaultOpened(event: VaultOpened): void {
  let vaultSchema = getOrCreateVault(
    event.params.os, 
    event.params.vault, 
    event.params.name, 
    event.params.symbol, 
    event.params.decimals, 
    event.params.fee
  )
  vaultSchema.save()
}

export function handleVaultFeeChanged(event: VaultFeeChanged): void {
  let vaultSchema = getOrCreateVault(event.params.os, event.params.vault)
  vaultSchema.fee = event.params.newFee

  vaultSchema.save()
}

export function handleDeposited(event: Deposited): void {
  _handleVaultTransaction(event, VAULTTYPE_DEPOSITED)
}

export function handleWithdrawn(event: Withdrawn): void {
  _handleVaultTransaction(event, VAULTTYPE_WITHDRAWN)
}

export function _handleVaultTransaction<T>(event: T, type: string): void {
  let os = event.params.os
  let vault = event.params.vault
  let member = event.params.member
  let epoch = event.params.epoch
  let epochObj = getOrCreateEpoch(os, epoch)

  let amountDec = toDecimal(event.params.amount)

  let vaultSchema = getOrCreateVault(os, vault)
  if (type === VAULTTYPE_DEPOSITED) {
    vaultSchema.amount = vaultSchema.amount.plus(amountDec);
  } else {
    vaultSchema.amount = vaultSchema.amount.minus(amountDec);
  }
  let osId = getOrCreateOs(os).id
  let memberId = getOrCreateMember(os, event.params.member).id
  let vaultId = vaultSchema.id

  let vaultTransactionId = `${os.toHexString()}-${vault.toHexString()}-${epoch}`
  let vaultTransaction = new VaultTransaction(vaultTransactionId)
  vaultTransaction.os = osId
  vaultTransaction.vault = vaultId
  vaultTransaction.member = memberId
  vaultTransaction.epoch = epoch
  vaultTransaction.amount = amountDec
  vaultTransaction.type = type

  const vaultEpochInfoId = `${os.toHexString()}-${vault.toHexString()}-${epoch}`
  let vaultEpochInfo = VaultEpochInfo.load(vaultEpochInfoId)
  if (vaultEpochInfo === null) {
    vaultEpochInfo = new VaultEpochInfo(vaultEpochInfoId) 
    vaultEpochInfo.os = osId
    vaultEpochInfo.vault = vaultId
    vaultEpochInfo.epoch = epochObj.id
    vaultEpochInfo.amount = BIGDECIMAL_ZERO
  }
  if (type === VAULTTYPE_DEPOSITED) {
    vaultEpochInfo.amount = vaultEpochInfo.amount.plus(amountDec);
  } else {
    vaultEpochInfo.amount = vaultEpochInfo.amount.minus(amountDec);
  }

  const vaultMemberInfoId = `${os.toHexString()}-${vault.toHexString()}-${member.toHexString}`
  let vaultMemberInfo = VaultMemberInfo.load(vaultMemberInfoId)
  if (vaultMemberInfo === null) {
    vaultMemberInfo = new VaultMemberInfo(vaultMemberInfoId) 
    vaultMemberInfo.os = osId
    vaultMemberInfo.member = memberId
    vaultMemberInfo.vault = vaultId
    vaultMemberInfo.epoch = epoch
    vaultMemberInfo.amount = BIGDECIMAL_ZERO
  }
  if (type === VAULTTYPE_DEPOSITED) {
    vaultMemberInfo.amount = vaultMemberInfo.amount.plus(amountDec);
  } else {
    vaultMemberInfo.amount = vaultMemberInfo.amount.minus(amountDec);
  }

  const vaultMemberEpochInfoId = `${os.toHexString()}-${vault.toHexString()}-${member.toHexString()}`
  let vaultMemberEpochInfo = VaultMemberEpochInfo.load(vaultMemberEpochInfoId)
  if (vaultMemberEpochInfo === null) {
    vaultMemberEpochInfo = new VaultMemberEpochInfo(vaultMemberEpochInfoId) 
    vaultMemberEpochInfo.os = osId
    vaultMemberEpochInfo.vault = vaultId
    vaultMemberEpochInfo.member = memberId
    vaultMemberEpochInfo.epoch = epoch
    vaultMemberEpochInfo.amount = BIGDECIMAL_ZERO
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