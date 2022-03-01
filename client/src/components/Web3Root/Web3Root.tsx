import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../contexts/web3";
import { Connect } from "./Connect/Connect";
import { Faucet } from "./Faucet/Faucet";
import { NotDeployed } from "./NotDeployed/NotDeployed";



export function Web3Root() {
  const { connected, contractsDeployedOnCurrentChain} = useContext(Web3Context);
  
  return (
    <Fragment>
      {connected ? contractsDeployedOnCurrentChain ? <Faucet/> : <NotDeployed/> :<Connect/>}
    </Fragment>
  );
}

