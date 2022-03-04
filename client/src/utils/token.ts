import { fromWei, toWei } from "web3-utils";

export const toUnit = (tokenAmount: string | number): string =>
  toWei(String(tokenAmount), "ether");

export const toToken = (unitAmount: string | number): string =>
  fromWei(String(unitAmount), "ether");
