import React, { useState } from 'react';
import styled from "styled-components";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { PossibleSellToken } from "../../../../contracts/types";
import { bordered } from "../../../../style/input-like";
import { Button } from "../../../../style/tags/button";
import { SellTokenSelectModal } from "./SellTokenSelectModal/SellTokenSelectModal";
// import { AddMetamask } from "../../../shared/AddMetamask/AddMetamask";

// import { WebsocketClient, DefaultLogger } from "binance";
// import socket from "socket.io-client";

// const binance = new WebsocketClient({
//   api_key: '',
//   api_secret: '',
//   beautify: true,
// }, {...DefaultLogger});


const MarketSaleContentDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
`

const TokenToPayDiv = styled.div`
  width: 76%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 600px) { 
    width: 96%;
 }
`

const SwapTitle= styled.div`
  width: 70%;
`

const TokenPseudoInputDiv = styled.div`
  display: flex;
  margin: 20px auto;
  padding: 10px;
  width: 100%;
  height: 40px;
  background-color: #FFFFFF;
  color: #000000;
  border-radius: 6px;
`

const PayP = styled.div`
  width: 100%;
  font-size: 1.5rem;
  text-align: left
`

const PayAmountInput = styled.input`
  width: 70%;
  border: none;
  background-color: transparent;
  resize: none;
  outline: none;
  text-align: right;
  font-size: 1.5rem;
  &:hover {
    border: none;
    background-color: transparent;
    resize: none;
    outline: none;
  }
  &:focus {
    border: none;
    background-color: transparent;
    resize: none;
    outline: none;
  } 
`

const TokenSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  background-color: transparent;
  margin: 0;
  padding: 4px;
  font-size: 75%;
  font-style: oblique;
  font-weight: 600;
  ${bordered}
  cursor: pointer
`


const DownArrowDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
`

const TokenNameDiv = styled.div`
  width: 55%;
`

const DownArrow = styled.i`
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  margin: auto;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`


// This could be the origin of the list of base token selection  then acces result in dict with any that 

export function MarketRate() { 
  const [tokenSelectionModalOpen, setTokenSelectionModalOpen] = useState(false)
  
  const [sellingAmount, setSellingAmount] = useState("")
  const [selectedBaseToken, setSelectedBaseToken] = useState<PossibleSellToken>(tokenLogos.WBTC.name)

  const selectNewTokenToSell = (tokenName: PossibleSellToken) => {
    setSelectedBaseToken(tokenName)
    setTokenSelectionModalOpen(false)
  }

  const swapTokens= ()=>{
    console.log("Swaping", sellingAmount);
  }

  return (
    <MarketSaleContentDiv>
      <SwapTitle>Swap tokens for STI at market price using oracles</SwapTitle>
      <TokenToPayDiv>
        <PayP>Sell:</PayP>
        <TokenPseudoInputDiv>
          <TokenSelect onClick={() => setTokenSelectionModalOpen(true)}>
            {tokenLogos[selectedBaseToken].logo}<TokenNameDiv>{tokenLogos[selectedBaseToken].name}</TokenNameDiv><DownArrowDiv>
              <DownArrow/></DownArrowDiv>
          </TokenSelect>

          <PayAmountInput type="text" placeholder="0.0" value={sellingAmount} onChange={({target: {value}}) => setSellingAmount(value.replace(/[^0-9.]/g, ''))}/>
        </TokenPseudoInputDiv>
      </TokenToPayDiv>
        For:
      <div style={{width: "100%"}}>
        <Button style={{ height: "35px"}} onClick={swapTokens}>Swap</Button>
      </div>

      
      <SellTokenSelectModal
        selectNewTokenToSell={selectNewTokenToSell}
        setTokenSelectionModalOpen={setTokenSelectionModalOpen} 
        tokenSelectionModalOpen={tokenSelectionModalOpen}
      />
    </MarketSaleContentDiv>
  );
}
