/* eslint-disable @typescript-eslint/no-unused-vars */
import PropTypes, { InferProps } from "prop-types";
import React, {
  createContext,
  ReactElement, useEffect, useRef, useState
} from "react";
import Web3 from "web3";
import { Faucet } from "../../contracts/types/Faucet";
import {SatiTokenSale} from "../../contracts/types/SatiTokenSale";
import FaucetAbi from "../../contracts/abis/Faucet.json";
import SatiAbi from "../../contracts/abis/SatiToken.json";
import SatiSaleAbi from "../../contracts/abis/SatiTokenSale.json";
import { stringFromHexadecimalNumber } from "../../utils";
import { EthereumAvailableGuard, AbiWithNetworks, DeployedNetwork, Web3ContextFunctions, VoidCall, ToastContractSend } from "./types";
import { ToastContentProps, toast } from "react-toastify";
import { dummyErrorParser } from "../../utils/error-parser";
import { TransactionReceipt } from "web3-core/types";
import { errorColor, successColor } from "../../style/colors";


//State
const initialWeb3ContextState = {
  connected: false,
  currentAccount: "",
  contractsDeployedOnCurrentChain: false,
  web3Instance: new Web3(),
  contracts : {faucetContract: {} as Faucet, satiSaleContract: {} as SatiTokenSale}
};


//Merge
type Web3ContextState = typeof initialWeb3ContextState;

type Web3ContextType = Web3ContextState & Web3ContextFunctions;

//Context
export const Web3Context = createContext<Web3ContextType>(
  //@ts-expect-error since we are not defining functions
  initialWeb3ContextState as Web3ContextState
);


const ifEthereumAvailableDo: EthereumAvailableGuard = (web3Callback: any) => (...callbackArgs: any[]) => {
  try {
    if(window.ethereum !== undefined) return web3Callback(...callbackArgs);
    console.error("Ethereum is not available on the window");
  } catch {
    console.error("There where a problem with web3");
  }
}

//Provider
export default function Web3ContextProvider({
  children,
}: InferProps<typeof Web3ContextProvider.propTypes>): ReactElement {
  
  const [web3ContractsState, setWeb3ContractsState] = useState<Web3ContextState["contracts"]>(initialWeb3ContextState.contracts);
  const [mainAccount, setMainAccount] = useState("");

  const web3InstanceRef = useRef(ifEthereumAvailableDo(() => new Web3(window.ethereum))());
  const [chainId, setChainId] = useState("");

  const initWeb3: VoidCall = ifEthereumAvailableDo(async () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  })

  const addSatiToWallet: VoidCall = ifEthereumAvailableDo( () => 
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          //@ts-expect-error since chainId can not directly access the abi
          address: SatiAbi.networks[chainId].address,
          symbol: "STI", 
          decimals: 18,
        },
      },
    })
  )

  //@ts-expect-error since chainIdToCheck can not directly access the abi but it is what we are testing
  const areContractsDeployedOnChain = (chainIdToCheck: string): chainIdToCheck is DeployedNetwork => Boolean(FaucetAbi.networks[chainIdToCheck])


  const loadContractsIfDeployedOnChain = (): void => {
 
    if(areContractsDeployedOnChain(chainId)){
      const faucetContract = new web3InstanceRef.current.eth.Contract(
        FaucetAbi.abi as AbiWithNetworks["abi"],
        FaucetAbi.networks[chainId].address
      ) as unknown as Faucet

      const satiSaleContract = new web3InstanceRef.current.eth.Contract(
        SatiSaleAbi.abi as AbiWithNetworks["abi"],
        SatiSaleAbi.networks[chainId].address
      ) as unknown as SatiTokenSale
  
      setWeb3ContractsState({
        faucetContract: faucetContract,
        satiSaleContract: satiSaleContract
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


  const TransactionSuccessToast = ({ data }: ToastContentProps<TransactionReceipt>) => (
    <div>
      <div>Transaction succeeded</div>
      <a target="_blank" style= {{color: "#23379d", textDecoration: "none", fontSize: "1.2rem"}} href={`https://kovan.etherscan.io/tx/${data?.transactionHash}`}>🔎 view on etherscan</a>
    </div>
  ) as ReactElement
  
  const toastContractSend: ToastContractSend = async (contractFunctionToSend, transactionOptions) => 
    toast.promise(
      async () => contractFunctionToSend.send({ from: mainAccount, ...transactionOptions }),
      {
        pending: {
          render(){
            return "Transaction pending.."
          },
          icon: true,
        
        },
        success: {
          render({data, closeToast, toastProps}: ToastContentProps<TransactionReceipt>){
            return TransactionSuccessToast({closeToast, toastProps, data})
          },
          style: {backgroundColor: successColor},
        },
        error: {
          render({data}: {data: Error}){
            return dummyErrorParser(data)
          },
          style: {backgroundColor: errorColor},
        }
      }
    )

  return (
    <Web3Context.Provider
      value={{
        web3Instance: web3InstanceRef.current,
        connected: Boolean( mainAccount),
        contractsDeployedOnCurrentChain: areContractsDeployedOnChain(chainId),
        currentAccount: mainAccount,
        contracts: web3ContractsState,
        initWeb3,
        addSatiToWallet,
        toastContractSend
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

Web3ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
