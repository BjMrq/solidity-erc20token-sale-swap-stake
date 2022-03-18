/* eslint-disable @typescript-eslint/no-unused-vars */
import PropTypes, { InferProps } from "prop-types";
import React, {
  createContext,
  ReactElement, useEffect, useRef, useState
} from "react";
import Web3 from "web3";
import { Faucet } from "../../contracts/types/Faucet";
import { SatiTokenSale } from "../../contracts/types/SatiTokenSale";
import { SatiToken } from "../../contracts/types/SatiToken";
import FaucetAbi from "../../contracts/abis/Faucet.json";
import SatiAbi from "../../contracts/abis/SatiToken.json";
import SatiSaleAbi from "../../contracts/abis/SatiTokenSale.json";
import SwapContractFactoryAbi from "../../contracts/abis/SwapContractFactory.json";
import { stringFromHexadecimalNumber } from "../../utils";
import { EthereumAvailableGuard, AbiWithNetworks, DeployedNetwork, Web3ContextFunctions, VoidCall, ToastContractSend, AddTokenToWallet } from "./types";
import { ToastContentProps, toast } from "react-toastify";
import { dummyErrorParser } from "../../utils/error-parser";
import { TransactionReceipt } from "web3-core/types";
import { errorColor, successColor } from "../../style/colors";
import { SwapContractFactory } from "../../contracts/types/SwapContractFactory";


//State
const initialWeb3ContextState = {
  connected: false,
  currentAccount: "",
  contractsDeployedOnCurrentChain: false,
  web3Instance: new Web3(),
  contracts : {
    faucetContract: {} as Faucet, 
    satiSaleContract: {} as SatiTokenSale, 
    factorySwapContract: {} as SwapContractFactory,
    satiTokenContract: {} as SatiToken
  },
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

  const addTokenToWallet: AddTokenToWallet = ifEthereumAvailableDo( (tokenInfo) => 
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          ...tokenInfo,
          image: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/eth.svg"
        }
      },
    })
  )

  //@ts-expect-error since chainIdToCheck can not directly access the abi but it is what we are testing
  const areContractsDeployedOnChain = (chainIdToCheck: string): chainIdToCheck is DeployedNetwork => Boolean(FaucetAbi.networks[chainIdToCheck])


  const loadContractsIfDeployedOnChain = async (): Promise<void> => {
 
    if(areContractsDeployedOnChain(chainId)){
      // const faucetContract = new web3InstanceRef.current.eth.Contract(
      //   FaucetAbi.abi as AbiWithNetworks["abi"],
      //   FaucetAbi.networks[chainId].address
      // ) as unknown as Faucet
      const contractName = "Faucet"

      const contractAbi = await import(`../../contracts/abis/${contractName}.json`)

      const faucetContract =  new web3InstanceRef.current.eth.Contract(
        contractAbi.abi as AbiWithNetworks["abi"],
        contractAbi.networks[chainId].address
      ) as unknown as Faucet

      const satiTokenContract = new web3InstanceRef.current.eth.Contract(
        SatiAbi.abi as AbiWithNetworks["abi"],
        SatiAbi.networks[chainId].address
      ) as unknown as SatiToken

      const satiSaleContract = new web3InstanceRef.current.eth.Contract(
        SatiSaleAbi.abi as AbiWithNetworks["abi"],
        SatiSaleAbi.networks[chainId].address
      ) as unknown as SatiTokenSale

      const factorySwapContract = new web3InstanceRef.current.eth.Contract(
        SwapContractFactoryAbi.abi as AbiWithNetworks["abi"],
        SwapContractFactoryAbi.networks[chainId].address
      ) as unknown as SwapContractFactory
  
      setWeb3ContractsState({
        satiTokenContract,
        faucetContract,
        satiSaleContract,
        factorySwapContract,
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
        addTokenToWallet,
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
