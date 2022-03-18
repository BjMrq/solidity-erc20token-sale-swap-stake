import Web3 from "web3"
import { AbiWithNetworks } from "../contexts/web3/types"
import { BaseContract } from "./types/types"

export const buildContractInstanceFromAbi = async <TContract extends BaseContract>(web3: Web3, chainId: string, contractName: string) => {
  const contractAbi = await import(`../../contracts/abis/${contractName}.json`)

  return new web3.eth.Contract(
    contractAbi.abi as AbiWithNetworks["abi"],
    contractAbi.networks[chainId].address
  ) as unknown as TContract
}