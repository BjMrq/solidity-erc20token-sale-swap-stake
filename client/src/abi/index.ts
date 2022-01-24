/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import satiTokenAbi from "contracts/SatiToken.json";
import satiTokenSaleAbi from "contracts/SatiTokenSale.json";
import kYCValidationAbi from "contracts/KYCValidation.json";
import { SatiToken } from "../types/contracts/SatiToken";
import { SatiTokenSale } from "../types/contracts/SatiTokenSale";
import { KYCValidation } from "../types/contracts/KYCValidation";
import { web3 } from "utils/web3";

export const satiToken = new web3.eth.Contract(
  satiTokenAbi.abi as AbiItem[],
  satiTokenAbi.networks["5777"].address
) as any as SatiToken;

export const satiTokenSale = new web3.eth.Contract(
  satiTokenSaleAbi.abi as AbiItem[],
  satiTokenSaleAbi.networks["5777"].address
) as any as SatiTokenSale;

export const kYCValidation = new web3.eth.Contract(
  kYCValidationAbi.abi as AbiItem[],
  kYCValidationAbi.networks["5777"].address
) as any as KYCValidation;
