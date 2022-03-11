import React, {  Fragment, useContext } from 'react';
import { Web3Context } from "../../contexts/web3/context";
import { Connect } from "./Connect/Connect";
import { Faucet } from "./Faucet/Faucet";
import { NotDeployed } from "./NotDeployed/NotDeployed";
import styled from "styled-components";
import { SatiSale } from "./SatiSale/SatiSale";
import { AddWallet } from "./AddWallet/AddWallet";

const FlexDiv = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
`;


const BottomDiv = styled.div`
 display: flex;
 align-self: end;
 flex: auto;
`


const TopDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`


export function Web3Root() {
  const { connected, contractsDeployedOnCurrentChain} = useContext(Web3Context);

  return (
    <FlexDiv>
      <TopDiv>
        <h2>Sati token sale</h2>
      </TopDiv>
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

