import React, { Fragment, useContext } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../contracts/context";
import { ReactComponent as STILogo } from '../../contracts/crypto-logos/STI.svg';
import { AddSatiMetamask } from "./AddSatiMetamask/AddSatiMetamask";
import { Connect } from "./Connect/Connect";
import { Faucet } from "./Faucet/Faucet";
import { NotDeployed } from "./NotDeployed/NotDeployed";
import { SatiSale } from "./SatiSale/SatiSale";


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
 padding-bottom: 12px
`


const TopDivSale = styled.div`
  height: 12vh;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
`


export function Web3Root() {
  const { connected, contractsDeployedOnCurrentChain} = useContext(Web3Context);

  return (
    <FlexDiv>
      <TopDivSale>
        <STILogo style={{height: "70px", marginRight: "20px"}}></STILogo>
        <h2>Sati token sale</h2>
      </TopDivSale>
      {connected 
        ? 
        contractsDeployedOnCurrentChain
          ? 
          <Fragment>
            
            <SatiSale/>
            <BottomDiv>
              <Faucet/>
              <AddSatiMetamask/>
            </BottomDiv>
          </Fragment> 
          :        
          <NotDeployed/> 
        :
        <Connect/>}
    </FlexDiv>
  );
}

