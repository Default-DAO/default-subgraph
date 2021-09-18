import { ethereum, BigDecimal, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { DEFAULT_DECIMALS } from './constants'

export function toDecimal(
  value: BigInt,
  decimals: number = DEFAULT_DECIMALS,
): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal();

  return value.divDecimal(precision);
}

export function generateId(fields: Array<string>): string {
  return fields.join('-')
}

export function generateEventId(event: ethereum.Event): string {
  return generateId([event.transaction.hash.toHex(), event.logIndex.toString()])
}