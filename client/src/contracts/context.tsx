/* eslint-disable @typescript-eslint/no-unused-vars */
import PropTypes, { InferProps } from "prop-types";
import React, {
  createContext,
  ReactElement, useEffect, useRef, useState
} from "react";
import { toast, ToastContentProps } from "react-toastify";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core/types";
import { errorColor, successColor } from "../style/colors";
import { stringFromHexadecimalNumber } from "../utils";
import { dummyErrorParser } from "../utils/error-parser";
import ERC20TokenAbi from "./abis/ERC20.json";
import SwapAbi from "./abis/ERC20TokensSwap.json";
import FaucetAbi from "./abis/Faucet.json";
import SatiAbi from "./abis/SatiToken.json";
import SatiSaleAbi from "./abis/SatiTokenSale.json";
import SwapContractFactoryAbi from "./abis/SwapContractFactory.json";
import { AbiWithNetworks, AddTokenToWallet, DeployedNetwork, EthereumAvailableGuard, PossibleSwapToken, SwapContractInfo, ToastContractSend, VoidCall, Web3ContextFunctions } from "./types";
import { ERC20 } from "./types/ERC20";
import { ERC20TokensSwap } from "./types/ERC20TokensSwap";
import { Faucet } from "./types/Faucet";
import { SatiToken } from "./types/SatiToken";
import { SatiTokenSale } from "./types/SatiTokenSale";
import { SwapContractFactory } from "./types/SwapContractFactory";


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
    satiTokenContract: {} as SatiToken,
    swapContracts: [] as SwapContractInfo[]
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
  const [currentChainId, setCurrentChainId] = useState("");

  const initWeb3: VoidCall = ifEthereumAvailableDo(async () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  })

  const addTokenToWallet: AddTokenToWallet = ifEthereumAvailableDo( async (erc20Token: ERC20) => 
  {
    const tokenSymbol = await erc20Token.methods.symbol().call();

    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: erc20Token.options.address,
          decimals: await erc20Token.methods.decimals().call(),
          symbol: tokenSymbol,
          image: `https://raw.githubusercontent.com/BjMrq/solidity-erc20token-sale-swap-stake/main/client/src/contracts/crypto-logos/${tokenSymbol}.svg`
        }
  
      },
    })
  }
  )

  //@ts-expect-error since chainIdToCheck can not directly access the abi but it is what we are testing
  const areContractsDeployedOnChain = (chainIdToCheck: string): chainIdToCheck is DeployedNetwork => Boolean(FaucetAbi.networks[chainIdToCheck])

  const buildSwapPairInfo = (factorySwapContract: SwapContractFactory) => async (pairName: string): Promise<SwapContractInfo> => {
    const [baseTokenName, quoteTokenName] = pairName.split("/") as [PossibleSwapToken, PossibleSwapToken]
    const {
      swapContractAddress,
      baseTokenAddress,
      quoteTokenAddress
    } = await factorySwapContract.methods.deployedSwapContractsRegistry(pairName).call()

    return {
      pairName, 
      swapContract: new web3InstanceRef.current.eth.Contract(
        SwapAbi.abi as AbiWithNetworks["abi"],
        swapContractAddress
      ) as unknown as ERC20TokensSwap,
      baseToken: {
        name: baseTokenName,
        contract: new web3InstanceRef.current.eth.Contract(
          ERC20TokenAbi.abi as AbiWithNetworks["abi"],
          baseTokenAddress
        ) as unknown as ERC20
      },
      quoteToken: {
        name: quoteTokenName,
        contract: new web3InstanceRef.current.eth.Contract(
          ERC20TokenAbi.abi as AbiWithNetworks["abi"],
          quoteTokenAddress
        ) as unknown as ERC20
      }
    }
  }

  const loadSwapContacts = async (factorySwapContract: SwapContractFactory): Promise<SwapContractInfo[]> => await Promise.all((await factorySwapContract.methods.getAllSwapPairs().call()).map(buildSwapPairInfo(factorySwapContract)))


  const loadContractsIfDeployedOnChain = async (chainId: DeployedNetwork): Promise<void> => {
    
    const faucetContract = new web3InstanceRef.current.eth.Contract(
      FaucetAbi.abi as AbiWithNetworks["abi"],
      FaucetAbi.networks[chainId].address
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
      swapContracts: await loadSwapContacts(factorySwapContract)
    })
    
  }

  useEffect(() => {

    if(areContractsDeployedOnChain(currentChainId)) loadContractsIfDeployedOnChain(currentChainId)
  
  }, [currentChainId]) 


  const listenForWeb3Changes = () => {
    window.ethereum.on("accountsChanged", function ([mainAccount]: string[]) {
      console.info("accountsChanged", mainAccount);
      setMainAccount(mainAccount || "")
    });

    window.ethereum.on('chainChanged', function(chainIdHex: string){
      const chainId = stringFromHexadecimalNumber(chainIdHex)
      console.info('chainChanged',chainIdHex, chainId)
      setCurrentChainId(chainId)
    });
  }


  useEffect(() => {
    ifEthereumAvailableDo((async () => {
      setCurrentChainId(String(await web3InstanceRef.current.eth.net.getId()))

      setMainAccount((await web3InstanceRef.current.eth.getAccounts())[0])
      
      listenForWeb3Changes()
    }))();
  }, []);


  const TransactionSuccessToast = ({ data }: ToastContentProps<TransactionReceipt>, transactionDisplayName: string) => (
    <div>
      <div>{transactionDisplayName} succeeded</div>
      <a target="_blank" style= {{color: "#23379d", textDecoration: "none", fontSize: "1.2rem"}} href={`https://kovan.etherscan.io/tx/${data?.transactionHash}`}>🔎 view on etherscan</a>
    </div>
  ) as ReactElement
  
  const toastContractSend: ToastContractSend = async (contractFunctionToSend, transactionOptions = {}, transactionDisplayName = "Transaction") => 
    toast.promise(
      async () => contractFunctionToSend.send({ from: mainAccount, ...transactionOptions }),
      {
        pending: {
          render(){
            return `${transactionDisplayName} pending..`
          },
          icon: true,
        
        },
        success: {
          render({data, closeToast, toastProps}: ToastContentProps<TransactionReceipt>){
            console.info(data);
            return TransactionSuccessToast({closeToast, toastProps, data}, transactionDisplayName)
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
        contractsDeployedOnCurrentChain: areContractsDeployedOnChain(currentChainId),
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
