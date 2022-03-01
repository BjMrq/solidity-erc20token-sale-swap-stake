/* eslint-disable @typescript-eslint/no-unused-vars */
import PropTypes, { InferProps } from "prop-types";
import React, {
  createContext,
  ReactElement, useEffect, useRef, useState
} from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Faucet } from "../contracts/types/Faucet";
import FaucetAbi from "../contracts/abis/Faucet.json";
import { stringFromHexadecimalNumber } from "../utils";

type EthereumAvailableGuard = <TCallback extends (...args: any) => any>(web3Callback: TCallback) => (...callbackArgs: any[]) => ReturnType<TCallback>

type AbiWithNetworks = {networks: Record<string, {address: string}>, abi: AbiItem[]};
export type DeployedNetwork = "1337"


//State
const initialInfoState = {
  connected: false,
  currentAccount: "",
  contractsDeployedOnCurrentChain: false
};

const initialContractState = {
  faucetContract: {} as Faucet
}

const initialWeb3Instance = {
  web3Instance: new Web3()
}

//Functions
type InitWeb3 = () => Promise<void>

type Web3ContextFunctions = {
  initWeb3: InitWeb3
}

//Merge
type Web3ContextState = typeof initialInfoState & typeof initialContractState & typeof initialWeb3Instance;

type Web3ContextType = Web3ContextState & Web3ContextFunctions;

//Context
export const Web3Context = createContext<Web3ContextType>(
  //@ts-expect-error since we are not defining functions
  {...initialInfoState, ...initialContractState} as Web3ContextState
);


const useEffectOnlyOnUpdate = (callback: any, dependencies: any[]) => {
  const didMount = React.useRef(false);

  React.useEffect(() => {

    (async () => {
     
      if (didMount.current) {
        callback(dependencies);
      } else {
        didMount.current = true;
      }
    }
    )();
  }, [callback, dependencies]);
};


//Provider
export default function Web3ContextProvider({
  children,
}: InferProps<typeof Web3ContextProvider.propTypes>): ReactElement {
  const ifEthereumAvailableDo: EthereumAvailableGuard = (web3Callback: any) => (...callbackArgs: any[]) => {
    try {
      if(window.ethereum !== undefined) return web3Callback(...callbackArgs);
      console.error("Ethereum is not available on the window");
    } catch {
      console.error("There where a problem with web3");
    }
  }

  const [web3ContractsState, setWeb3ContractsState] = useState<typeof initialContractState>(initialContractState);
  const [mainAccount, setMainAccount] = useState("");

  const web3InstanceRef = useRef(ifEthereumAvailableDo(() => new Web3(window.ethereum))());
  const [chainId, setChainId] = useState("");

  const initWeb3 = ifEthereumAvailableDo(async () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  })

  //@ts-expect-error since chainIdToCheck can not directly access the abi but it is what we are testing
  const areContractsDeployedOnChain = (chainIdToCheck: string): chainIdToCheck is DeployedNetwork => Boolean(FaucetAbi.networks[chainIdToCheck])


  const loadContractsIfDeployedOnChain = (): void => {
 
    if(areContractsDeployedOnChain(chainId)){
      const faucetContract = new web3InstanceRef.current.eth.Contract(
        FaucetAbi.abi as AbiWithNetworks["abi"],
        FaucetAbi.networks[chainId].address
      ) as unknown as Faucet
  
      setWeb3ContractsState({
        faucetContract: faucetContract
      })
    }
  }

  useEffect(() => {

    loadContractsIfDeployedOnChain()
  
  }, [chainId]) 


  const listenForWeb3Changes = () => {
    window.ethereum.on("accountsChanged", function ([mainAccount]: string[]) {
      console.info("accountsChanged", mainAccount);
      setMainAccount(mainAccount || "")
    });

    window.ethereum.on('chainChanged', function(chainIdHex: string){
      const chainId = stringFromHexadecimalNumber(chainIdHex)
      console.info('chainChanged',chainIdHex, chainId)
      setChainId(chainId)
    });
  }


  useEffect(() => {
    ifEthereumAvailableDo((async () => {
      setChainId(String(await web3InstanceRef.current.eth.net.getId()))

      setMainAccount((await web3InstanceRef.current.eth.getAccounts())[0])
      
      listenForWeb3Changes()
    }))();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3Instance: web3InstanceRef.current,
        connected: Boolean( mainAccount),
        contractsDeployedOnCurrentChain: areContractsDeployedOnChain(chainId),
        currentAccount: mainAccount,
        ...web3ContractsState,
        initWeb3
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
