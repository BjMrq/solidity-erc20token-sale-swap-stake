import { toWei } from "web3-utils";

export const numberOfToken = (amountWithoutDecimal: string): string =>
  toWei(amountWithoutDecimal, "ether");
