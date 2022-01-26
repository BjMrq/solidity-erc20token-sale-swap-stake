import { toWei } from "web3-utils";

export const token = (amountWithoutDecimal: string | number): string =>
  toWei(String(amountWithoutDecimal), "ether");
