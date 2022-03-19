import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useQuery } from 'react-query';
import styled from "styled-components";
// import { Web3Context } from "../../../../contexts/web3/context";
import { ReactComponent as BATLogo } from '../../../../contracts/crypto-logos/BAT.svg';
import { ReactComponent as BNBLogo } from '../../../../contracts/crypto-logos/BNB.svg';
import { ReactComponent as DAILogo } from '../../../../contracts/crypto-logos/DAI.svg';
import { ReactComponent as LINKLogo } from '../../../../contracts/crypto-logos/LINK.svg';
import { ReactComponent as MATICLogo } from '../../../../contracts/crypto-logos/MATIC.svg';
import { ReactComponent as STILogo } from '../../../../contracts/crypto-logos/STI.svg';
import { ReactComponent as TRXLogo } from '../../../../contracts/crypto-logos/TRX.svg';
import { ReactComponent as USDCLogo } from '../../../../contracts/crypto-logos/USDC.svg';
import { ReactComponent as WBTCLogo } from '../../../../contracts/crypto-logos/WBTC.svg';
import { ReactComponent as WLTCLogo } from '../../../../contracts/crypto-logos/WLTC.svg';
import { borderRadius } from "../../../../style/characteristics";
import { backGroundColor, lightColor } from "../../../../style/colors";
import { bordered } from "../../../../style/input-like";
import { Button } from "../../../../style/tags/button";
// import { AddMetamask } from "../../../shared/AddMetamask/AddMetamask";

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
    maxHeight: "80vh",
    width: '400px',
    backgroundColor: backGroundColor,
    borderRadius: borderRadius,
    color: lightColor,
    border: "none"
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

const TokenToSellListElement = styled.div`
  display: flex;
  width: 100%;
  justify-content: left;
  font-size: 24px;
  margin: 6px
  height: 40px;
  justify-content: space-between;
`

const QuoteTokenLogo = styled.div`
  width: 10%;
  margin-right: 20px;
  /* height: 80vh; */
  /* overflow-y: scroll; */
`

// This could be the origin of the list of base token selection  then acces result in dict with any that 
const tokenSelectedStyle ={
  BAT: {logo: <BATLogo style={{maxHeight: "90%"}}/>, name: "BAT"},
  BNB: {logo: <BNBLogo style={{maxHeight: "90%"}}/>, name: "BNB"},
  DAI: {logo: <DAILogo style={{maxHeight: "90%"}}/>, name: "DAI"},
  LINK: {logo: <LINKLogo style={{maxHeight: "90%"}}/>, name: "LINK"},
  MATIC: {logo: <MATICLogo style={{maxHeight: "90%"}}/>, name: "MATIC"},
  STI: {logo: <STILogo style={{maxHeight: "90%"}}/>, name: "STI"},
  TRX: {logo: <TRXLogo style={{maxHeight: "90%"}}/>, name: "TRX"},
  USDC: {logo: <USDCLogo style={{maxHeight: "90%"}}/>, name: "USDC"},
  WBTC: {logo: <WBTCLogo style={{maxHeight: "90%"}}/>, name: "WBTC"},
  WLTC: {logo: <WLTCLogo style={{maxHeight: "90%"}}/>, name: "WLTC"},
} as const

type PossibleBaseToken = keyof typeof tokenSelectedStyle

export function MarketRate() { 
  // const { contracts: {factorySwapContract}} = useContext(Web3Context);
  
  const { data: possibleSwapPairs } = useQuery<string[]>('swapPairs', () => [])

  
  const [sellingAmount, setSellingAmount] = useState("")
  const [tokenSelectionModalOpen, setTokenSelectionModalOpen] = useState(false)
  const [selectedBaseToken, setSelectedBaseToken] = useState<PossibleBaseToken>(tokenSelectedStyle.WLTC.name)

  const getPossibleBaseTokenFromPairs = (possiblePairs: string[] | undefined): PossibleBaseToken[] => Array.from(new Set((possiblePairs || []).reduce((allSwapPairs, currentSwapPair) => [...allSwapPairs, ...currentSwapPair.split("/")],[] as string[]))) as PossibleBaseToken[] 

  const selectNewTokenToSell = (tokenName: PossibleBaseToken) => {
    setSelectedBaseToken(tokenName)
    setTokenSelectionModalOpen(false)
  }

  const swapTokens= ()=>{
    console.log("Swaping", sellingAmount);
  }

  useEffect(() => {
    (async () => {

      // if(possibleSwapPairs)

      // // reduce instead with build object with swapPair as ke?
      //   console.log(await Promise.all(possibleSwapPairs.map(async (pairName) => {
      //     const [baseTokenName, quoteTokenName] = pairName.split("/")

      //     const swapTokenInfo = await factorySwapContract.methods.deployedSwapContractsRegistry(pairName).call()

      //     //do this ion context ?
      //     // build ERC20 Tokens contract in this function instead of address the token contract
      //     return {
      //       pairName, 
      //       swapContractAddress: swapTokenInfo.swapContractAddress,
      //       baseToken: {
      //         name: baseTokenName,
      //         address: swapTokenInfo.baseTokenAddress
      //       },
      //       quoteToken: {
      //         name: quoteTokenName,
      //         address: swapTokenInfo.quoteTokenAddress
      //       }
      //     }
      //   })));
    }
    )();   
  }, [])
  


  return (
    <MarketSaleContentDiv>
      <SwapTitle>Swap tokens for STI at market price using oracles</SwapTitle>
      <TokenToPayDiv>
        <PayP>Sell:</PayP>
        <TokenPseudoInputDiv>
          <TokenSelect onClick={() => setTokenSelectionModalOpen(true)}>
            {tokenSelectedStyle[selectedBaseToken].logo}<TokenNameDiv>{tokenSelectedStyle[selectedBaseToken].name}</TokenNameDiv><DownArrowDiv>
              <DownArrow/></DownArrowDiv>
          </TokenSelect>

          <PayAmountInput type="text" placeholder="0.0" value={sellingAmount} onChange={({target: {value}}) => setSellingAmount(value.replace(/[^0-9.]/g, ''))}/>
        </TokenPseudoInputDiv>
      </TokenToPayDiv>
        For:
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
        {getPossibleBaseTokenFromPairs(possibleSwapPairs).map((token) => 
          <TokenToSellListElement onClick={() => selectNewTokenToSell(token)} key={token}>
            <QuoteTokenLogo>{tokenSelectedStyle[token].logo}</QuoteTokenLogo>
            {token}
          </TokenToSellListElement>
        )}
      </Modal>
    </MarketSaleContentDiv>
  );
}
