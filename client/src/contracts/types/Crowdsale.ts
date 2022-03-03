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

export type TokensPurchased = ContractEventLog<{
  purchaser: string;
  beneficiary: string;
  value: string;
  amount: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;

export interface Crowdsale extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Crowdsale;
  clone(): Crowdsale;
  methods: {
    /**
     */
    toUnit(): NonPayableTransactionObject<string>;

    /**
     */
    wallet(): NonPayableTransactionObject<string>;

    /**
     */
    rate(): NonPayableTransactionObject<string>;

    /**
     */
    weiRaised(): NonPayableTransactionObject<string>;

    /**
     * low level token purchase ***DO NOT OVERRIDE*** This function has a non-reentrancy guard, so it shouldn't be called by another `nonReentrant` function.
     * @param beneficiary Recipient of the token purchase
     */
    buyTokens(beneficiary: string): PayableTransactionObject<void>;
  };
  events: {
    TokensPurchased(cb?: Callback<TokensPurchased>): EventEmitter;
    TokensPurchased(
      options?: EventOptions,
      cb?: Callback<TokensPurchased>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "TokensPurchased", cb: Callback<TokensPurchased>): void;
  once(
    event: "TokensPurchased",
    options: EventOptions,
    cb: Callback<TokensPurchased>
  ): void;
}