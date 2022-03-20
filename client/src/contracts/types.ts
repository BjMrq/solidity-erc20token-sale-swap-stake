import { PromiEvent, TransactionReceipt } from "web3-core/types";
import { AbiItem } from "web3-utils";
import { ERC20 } from "./types/ERC20";
import { ERC20TokensSwap } from "./types/ERC20TokensSwap";
import { PayableTx } from "./types/types";
import { tokenLogos } from "./crypto-logos";

export type SellTokenLogos = typeof tokenLogos;
export type PossibleSwapToken = keyof SellTokenLogos;

export type EthereumAvailableGuard = <TCallback extends (...args: any) => any>(
  web3Callback: TCallback
) => (...callbackArgs: any[]) => ReturnType<TCallback>;

export type AbiWithNetworks = {
  networks: Record<string, { address: string }>;
  abi: AbiItem[];
};
export type DeployedNetwork = "1337";

export type ERC20TokenInfo = {
  name: PossibleSwapToken;
  contract: ERC20;
};

export type SwapContractInfo = {
  pairName: string;
  swapContract: ERC20TokensSwap;
  baseToken: ERC20TokenInfo;
  quoteToken: ERC20TokenInfo;
};

export type VoidCall = () => Promise<void> | void;

export type ToastContractSend = (
  contractFunctionToSend: {
    send: (transactionOptions: PayableTx) => PromiEvent<TransactionReceipt>;
  },
  transactionOptions?: PayableTx | undefined
) => Promise<TransactionReceipt>;

export type AddTokenToWallet = (tokenInfo: ERC20) => Promise<void>;

export type Web3ContextFunctions = {
  initWeb3: VoidCall;
  addTokenToWallet: AddTokenToWallet;
  toastContractSend: ToastContractSend;
};
