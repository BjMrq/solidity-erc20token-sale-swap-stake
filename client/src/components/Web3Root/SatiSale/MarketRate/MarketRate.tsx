import React, { useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { PossibleSwapToken } from "../../../../contracts/types";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { SatiSaleContent } from "../SatiSaleContent";
import { TokenSelectModal } from "./TokenSelectModal/TokenSelectModal";

// import { AddMetamask } from "../../../shared/AddMetamask/AddMetamask";

// import { WebsocketClient, DefaultLogger } from "binance";
// import socket from "socket.io-client";

// const binance = new WebsocketClient({
//   api_key: '',
//   api_secret: '',
//   beautify: true,
// }, {...DefaultLogger});


const TokenDiv = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`



// This could be the origin of the list of base token selection  then acces result in dict with any that 

export function MarketRate() { 

  const { contracts: {swapContracts}} = useContext(Web3Context);

  const [sellTokenSelectionModalOpen, setSellTokenSelectionModalOpen] = useState(false)
  const [buyTokenSelectionModalOpen, setBuyTokenSelectionModalOpen] = useState(false)
  
  const [sellingAmount, setSellingAmount] = useState("")
  const [selectedSellToken, setSelectedSellToken] = useState<PossibleSwapToken>(tokenLogos.WBTC.name)
  const [selectedBuyToken, setSelectedBuyToken] = useState<PossibleSwapToken>(tokenLogos.STI.name)
  
  const [possibleBuyToken] = useState<PossibleSwapToken[]>([tokenLogos.STI.name, tokenLogos.STI.name])

  const hasMoreThanOneChoice = (choices: any[]) => choices.length > 1

  const selectSellToken = (tokenName: PossibleSwapToken) => {
    setSelectedSellToken(tokenName)
    setSellTokenSelectionModalOpen(false)
  }

  const selectBuyToken = (tokenName: PossibleSwapToken) => {
    setSelectedBuyToken(tokenName)
    setBuyTokenSelectionModalOpen(false)
  }


  useEffect(()=> {
    console.log(swapContracts.filter(contract => contract.pairName.includes(selectedSellToken)));
  }, [swapContracts, selectedSellToken])

  //TODO use effect on both token that try to find matching contract and set it

  const swapTokens= ()=>{
    console.log("Swapping", sellingAmount);
  }
  //TODO module sell and buy pseudo input out


  // REFACTOR modal to be reused for token to buy selection, extract data and token list and pass it to style only components
  return (
    <SatiSaleContent 
      saleTitle={"Swap tokens for STI at market price using oracles"}
      callToAction={{display: "Swap", callback: swapTokens}}
    >
      <TokenDiv>
        <TokenPseudoInput 
          inputLabel="Sell"
          multipleTokenChoice={true}
          onTokenClick={() => setSellTokenSelectionModalOpen(true)}
          tokenToDisplay={tokenLogos[selectedSellToken]}
          inputValue={sellingAmount}
          setInputValue={setSellingAmount}
        />
      </TokenDiv>
      <TokenDiv>
        <TokenPseudoInput 
          inputLabel="For"
          multipleTokenChoice={hasMoreThanOneChoice(possibleBuyToken)}
          onTokenClick={() => hasMoreThanOneChoice(possibleBuyToken) && setBuyTokenSelectionModalOpen(true)}
          tokenToDisplay={tokenLogos[selectedBuyToken]}
          inputValue={"0.0"}
          inputDisabled={true}
        />
      </TokenDiv>
      
      <TokenSelectModal
        tokenType={"sell"}
        swapContractListToExtractTokensFrom={swapContracts}
        selectTokenCallback={selectSellToken}
        setTokenSelectionModalOpen={setSellTokenSelectionModalOpen} 
        tokenSelectionModalOpen={sellTokenSelectionModalOpen}
      />
      <TokenSelectModal
        tokenType={"buy"}
        swapContractListToExtractTokensFrom={swapContracts.filter(contract => contract.pairName.includes(selectedSellToken))}
        selectTokenCallback={selectBuyToken}
        selectedPairToken={selectedSellToken}
        setTokenSelectionModalOpen={setBuyTokenSelectionModalOpen} 
        tokenSelectionModalOpen={buyTokenSelectionModalOpen}
      />
    </SatiSaleContent>
  );
}
