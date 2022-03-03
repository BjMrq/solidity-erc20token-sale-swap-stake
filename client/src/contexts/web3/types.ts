import { AbiItem } from "web3-utils";

export type EthereumAvailableGuard = <TCallback extends (...args: any) => any>(web3Callback: TCallback) => (...callbackArgs: any[]) => ReturnType<TCallback>

export type AbiWithNetworks = {networks: Record<string, {address: string}>, abi: AbiItem[]};
export type DeployedNetwork = "1337"

export type Web3ContextFunctions = {
  initWeb3: InitWeb3
}

export type InitWeb3 = () => Promise<void>