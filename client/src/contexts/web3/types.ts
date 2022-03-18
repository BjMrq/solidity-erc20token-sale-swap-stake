import { PromiEvent, TransactionReceipt } from "web3-core/types";
import { AbiItem } from "web3-utils";
import { ERC20 } from "../../contracts/types/ERC20";
import { PayableTx } from "../../contracts/types/types";


export type EthereumAvailableGuard = <TCallback extends (...args: any) => any>(web3Callback: TCallback) => (...callbackArgs: any[]) => ReturnType<TCallback>

export type AbiWithNetworks = {networks: Record<string, {address: string}>, abi: AbiItem[]};
export type DeployedNetwork = "1337"

export type VoidCall = () => Promise<void> | void

export type ToastContractSend = (contractFunctionToSend: {
  send: (transactionOptions: PayableTx) => PromiEvent<TransactionReceipt>;
}, transactionOptions?: PayableTx | undefined) => Promise<TransactionReceipt>

export type AddTokenToWallet = (tokenInfo: ERC20) => Promise<void> 

export type Web3ContextFunctions = {
  initWeb3: VoidCall
  addTokenToWallet: AddTokenToWallet
  toastContractSend: ToastContractSend
}