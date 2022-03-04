import { PromiEvent, TransactionReceipt } from "web3-core/types";
import { AbiItem } from "web3-utils";
import { PayableTx } from "../../types/types";

export type EthereumAvailableGuard = <TCallback extends (...args: any) => any>(web3Callback: TCallback) => (...callbackArgs: any[]) => ReturnType<TCallback>

export type AbiWithNetworks = {networks: Record<string, {address: string}>, abi: AbiItem[]};
export type DeployedNetwork = "1337"

export type VoidCall = () => Promise<void> | void

export type ToastContractSend = (contractFunctionToSend: {
  send: (transactionOptions: PayableTx) => PromiEvent<TransactionReceipt>;
}, transactionOptions?: PayableTx | undefined) => Promise<TransactionReceipt>


export type Web3ContextFunctions = {
  initWeb3: VoidCall
  addSatiToWallet: VoidCall
  toastContractSend: ToastContractSend
}