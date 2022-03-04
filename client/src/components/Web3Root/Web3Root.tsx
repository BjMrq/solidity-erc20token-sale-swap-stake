import React, {  Fragment, useContext } from 'react';
import { Web3Context } from "../../contexts/web3/context";
import { Connect } from "./Connect/Connect";
import { Faucet } from "./Faucet/Faucet";
import { NotDeployed } from "./NotDeployed/NotDeployed";
import styled from "styled-components";
import { SatiSale } from "./SatiSale/SatiSale";
import { AddWallet } from "./AddWallet/AddWallet";

const FlexDiv = styled.div`
  min-width: 50vw;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
`;

const SaleTitle = styled.h2`
  min-width: 50vw;
  min-height: 10vh;
`

const BottomDiv = styled.div`
 display: flex;
 align-self: end;
 flex: auto;
`

export function Web3Root() {
  const { connected, contractsDeployedOnCurrentChain} = useContext(Web3Context);

  return (
    <FlexDiv>
      <SaleTitle>Sati token sale</SaleTitle>
      {connected 
        ? 
        contractsDeployedOnCurrentChain
          ? 
          <Fragment>
            <SatiSale/>
            <BottomDiv>
              <Faucet/>
              <AddWallet/>
            </BottomDiv>
          </Fragment> 
          :        
          <NotDeployed/> 
        :
        <Connect/>}
    </FlexDiv>
  );
}

