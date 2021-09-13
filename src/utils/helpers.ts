import { ethereum, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const DEFAULT_DECIMALS = 3;

export function toDecimal(
  value: BigInt,
  decimals: number = DEFAULT_DECIMALS,
): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<number>decimals)
    .toBigDecimal();

  return value.divDecimal(precision);
}

export function generateId(fields: any): string {
  for (var i = 0; i < fields.length; i ++) {
    fields[i] = fields[i].toHexString()
  }
  return fields.join("-")
}

export function generateEventId(event: ethereum.Event): string {
  return `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
}
