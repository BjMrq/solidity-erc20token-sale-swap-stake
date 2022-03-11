import React, { useState } from 'react';
import styled from "styled-components";
import { bordered } from "../../../../style/input-like";
import { Button } from "../../../../style/tags/button";
import { ReactComponent as ETHLogo } from './crypto-logos/eth.svg';
import { ReactComponent as WBTCLogo } from './crypto-logos/wbtc.svg';
import Modal from 'react-modal';
import {  lightColor, mainColor } from "../../../../style/colors";
import {  border, borderRadius } from "../../../../style/characteristics";
// import { WebsocketClient, DefaultLogger } from "binance";
// import socket from "socket.io-client";

// const binance = new WebsocketClient({
//   api_key: '',
//   api_secret: '',
//   beautify: true,
// }, {...DefaultLogger});

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    backgroundColor: mainColor,
    borderRadius: borderRadius,
    color: lightColor,
    border: border
  },
};

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

const TokenSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  background-color: transparent;
  margin: 0;
  padding: 5px;
  font-size: 1.5rem;
  font-style: oblique;
  ${bordered}
  cursor: pointer
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

const SwapTitle= styled.div`
  width: 70%;
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

const TokenToSellListElement = styled.div`
 width: 100%;
 justify-content: left;
 font-size: 24px;
 margin: 6px
`

const tokenSelectedStyle ={
  ETH: {logo: <ETHLogo style={{height: "20px", width: "25%", margin: "auto"}}/>, name: "ETH"},
  wBTC: {logo: <WBTCLogo style={{height: "20px", width: "25%", margin: "auto"}}/>, name: "wBTC"},
} as const

type PossibleSellToken = keyof typeof tokenSelectedStyle

export function MarketRate() {  
  const [sellingAmount, setSellingAmount] = useState("")
  const [selectedSellToken, setSelectedSellToken] = useState<PossibleSellToken>(tokenSelectedStyle.ETH.name)
  const [tokenSelectionModalOpen, setTokenSelectionModalOpen] = useState(false)

  const selectNewTokenToSell = (tokenName: PossibleSellToken) => {
    setSelectedSellToken(tokenName)
    setTokenSelectionModalOpen(false)
  }

  const swapTokens= ()=>{
    console.log("Swaping", sellingAmount);
  }

  return (
    <MarketSaleContentDiv>
      <SwapTitle>Swap tokens for STI at market price using oracles</SwapTitle>
      <TokenToPayDiv>
        <PayP>Pay:</PayP>
        <TokenPseudoInputDiv>
          <TokenSelect onClick={() => setTokenSelectionModalOpen(true)}>
            {tokenSelectedStyle[selectedSellToken].logo}{tokenSelectedStyle[selectedSellToken].name}<DownArrow/>
          </TokenSelect>

          <PayAmountInput type="text" placeholder="0.0" value={sellingAmount} onChange={({target: {value}}) => setSellingAmount(value.replace(/[^0-9.]/g, ''))}/>
        </TokenPseudoInputDiv>
      </TokenToPayDiv>
        Receive:
      <div style={{width: "100%"}}>
        <Button style={{ height: "35px"}} onClick={swapTokens}>Swap</Button>
      </div>

      
      <Modal
        isOpen={tokenSelectionModalOpen}
        onRequestClose={() => setTokenSelectionModalOpen(false)}
        style={modalStyle}
        contentLabel="Example Modal"
      >
        <h2>Select token to sell</h2>
        {Object.values(tokenSelectedStyle).map((token) => {
          return <TokenToSellListElement onClick={() => selectNewTokenToSell(token.name)} key={token.name}>{token.logo}{token.name}</TokenToSellListElement>
        })}
      </Modal>
    </MarketSaleContentDiv>
  );
}
