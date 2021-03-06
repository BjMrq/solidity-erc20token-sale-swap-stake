/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface MockV3AggregatorContract
  extends Truffle.Contract<MockV3AggregatorInstance> {
  "new"(
    _roundId: number | BN | string,
    _answer: number | BN | string,
    _startedAt: number | BN | string,
    _updatedAt: number | BN | string,
    _answeredInRound: number | BN | string,
    meta?: Truffle.TransactionDetails
  ): Promise<MockV3AggregatorInstance>;
}

type AllEvents = never;

export interface MockV3AggregatorInstance extends Truffle.ContractInstance {
  decimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  description(txDetails?: Truffle.TransactionDetails): Promise<string>;

  version(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getRoundData(
    _roundId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

  latestRoundData(
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

  methods: {
    decimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    description(txDetails?: Truffle.TransactionDetails): Promise<string>;

    version(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getRoundData(
      _roundId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;

    latestRoundData(
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN; 2: BN; 3: BN; 4: BN }>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
