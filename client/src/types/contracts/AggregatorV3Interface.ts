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

export interface AggregatorV3Interface extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): AggregatorV3Interface;
  clone(): AggregatorV3Interface;
  methods: {
    decimals(): NonPayableTransactionObject<string>;

    description(): NonPayableTransactionObject<string>;

    version(): NonPayableTransactionObject<string>;

    getRoundData(_roundId: number | string | BN): NonPayableTransactionObject<{
      roundId: string;
      answer: string;
      startedAt: string;
      updatedAt: string;
      answeredInRound: string;
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
    }>;

    latestRoundData(): NonPayableTransactionObject<{
      roundId: string;
      answer: string;
      startedAt: string;
      updatedAt: string;
      answeredInRound: string;
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
    }>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
