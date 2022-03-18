/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;
export type Rate = ContractEventLog<{
  scaledPrice: string;
  timeStamp: string;
  0: string;
  1: string;
}>;
export type SwapRateInfo = ContractEventLog<{
  exchangeType: string;
  sellingAmount: string;
  buyingAmount: string;
  0: string;
  1: string;
  2: string;
}>;
export type SwapTransferInfo = ContractEventLog<{
  beneficiary: string;
  amountSent: string;
  amountReceived: string;
  0: string;
  1: string;
  2: string;
}>;

export interface SatiEthSwap extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): SatiEthSwap;
  clone(): SatiEthSwap;
  methods: {
    getScaledRate(
      _scalingDecimal: number | string | BN
    ): NonPayableTransactionObject<string>;

    /**
     * Returns the address of the current owner.
     */
    owner(): NonPayableTransactionObject<string>;

    /**
     * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
     */
    renounceOwnership(): NonPayableTransactionObject<void>;

    satiToken(): NonPayableTransactionObject<string>;

    /**
     * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
     */
    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    getAskPrice(
      _weiAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    swapBaseForQuoteToken(
      _ERC20TokenAmount: number | string | BN
    ): PayableTransactionObject<void>;

    getBidPrice(
      _satiAmount: number | string | BN
    ): NonPayableTransactionObject<string>;

    swapQuoteForBaseToken(
      _satiTokenAmount: number | string | BN
    ): PayableTransactionObject<void>;
  };
  events: {
    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    Rate(cb?: Callback<Rate>): EventEmitter;
    Rate(options?: EventOptions, cb?: Callback<Rate>): EventEmitter;

    SwapRateInfo(cb?: Callback<SwapRateInfo>): EventEmitter;
    SwapRateInfo(
      options?: EventOptions,
      cb?: Callback<SwapRateInfo>
    ): EventEmitter;

    SwapTransferInfo(cb?: Callback<SwapTransferInfo>): EventEmitter;
    SwapTransferInfo(
      options?: EventOptions,
      cb?: Callback<SwapTransferInfo>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;

  once(event: "Rate", cb: Callback<Rate>): void;
  once(event: "Rate", options: EventOptions, cb: Callback<Rate>): void;

  once(event: "SwapRateInfo", cb: Callback<SwapRateInfo>): void;
  once(
    event: "SwapRateInfo",
    options: EventOptions,
    cb: Callback<SwapRateInfo>
  ): void;

  once(event: "SwapTransferInfo", cb: Callback<SwapTransferInfo>): void;
  once(
    event: "SwapTransferInfo",
    options: EventOptions,
    cb: Callback<SwapTransferInfo>
  ): void;
}
