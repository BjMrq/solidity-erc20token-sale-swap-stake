import React, {useContext} from 'react';
import { Web3Context } from "../../../contexts/web3/context";
import { AddMetamask } from "../../shared/AddMetamask/AddMetamask";



export function AddSatiMetamask() {
  const { contracts: {satiTokenContract} } = useContext(Web3Context);
  
  return (
    <AddMetamask displayText="Add Sati" tokenContract={satiTokenContract}/>
  );
}