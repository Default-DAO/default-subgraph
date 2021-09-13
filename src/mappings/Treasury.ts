import { 
  VaultOpened,
  VaultFeeChanged,
  Deposited,
  Withdrawn
} from '../../generated/templates/Treasury/Treasury';
import { Vault } from '../../generated/schema'
import {
  generateId,
} from '../utils/helpers';

export function handleVaultOpened(event: VaultOpened): void { 
  const {os, vault, name, symbol, token, decimals, fee} = event.params

  let vaultSchema = new Vault(vault.toHexString())
  vaultSchema.os = os.toHexString()
  vaultSchema.name = name
  vaultSchema.symbol = symbol
  vaultSchema.token = token.toHexString()
  vaultSchema.decimals = decimals
  vaultSchema.fee = fee
  
  vaultSchema.save()
}

export function handleVaultFeeChanged(event: VaultFeeChanged): void {  
  
}

export function handleDeposited(event: Deposited): void {  
  
}

export function handleWithdrawn(event: Withdrawn): void {  
  
}