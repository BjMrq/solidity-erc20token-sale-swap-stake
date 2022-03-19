import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Web3Context } from "../../../../../../contracts/context";
import { tokenLogos } from "../../../../../../contracts/crypto-logos";
import { PossibleSellToken } from "../../../../../../contracts/types";
import { ERC20 } from "../../../../../../contracts/types/ERC20";
import { toToken } from "../../../../../../utils/token";
import { AddMetamask } from "../../../../../shared/AddMetamask/AddMetamask";

const TokenToSellListElement = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 24px;
  margin: 20px 0;
  height: 40px;
  justify-content: space-between;
  font-size: 1.5rem;
`

const AddTokenWalletDiv = styled.div`
  width: 10%;
`

const ClickableToken = styled.div`
    cursor: pointer;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`




const SellTokenLogo = styled.div`
  text-align: right;
  width: 13%;
  padding-right: 20px;
  /* margin-right: 20px; */
  /* height: 80vh; */
  /* overflow-y: scroll; */
`

const TokenName = styled.div`
  font-weight: bold;
  text-align: right;
  padding-right: 20px;
  width: 37%;
  `

const TokenBalance = styled.div`
  width: 50%;
  text-align: right;
  `



export function SellToken({tokenName, tokenContract, selectNewTokenToSell}: {tokenName: PossibleSellToken, tokenContract: ERC20, selectNewTokenToSell: (tokenName: PossibleSellToken) => void}) {
  const { currentAccount} = useContext(Web3Context);
  const [tokenBalance, setTokenBalance] = useState("0")

  useEffect(() => {
    (async () => {
      setTokenBalance(await tokenContract.methods.balanceOf(currentAccount).call())
    }
    )();
  }, [])


  return (
    <TokenToSellListElement >
      <ClickableToken onClick={() => selectNewTokenToSell(tokenName)}>
        <TokenBalance>{toToken(tokenBalance)}</TokenBalance>
        <TokenName>{tokenName}</TokenName>
        <SellTokenLogo>{tokenLogos[tokenName].logo}</SellTokenLogo>
      </ClickableToken>
      <AddTokenWalletDiv>
        <AddMetamask tokenContract={tokenContract} ></AddMetamask>
      </AddTokenWalletDiv>
    </TokenToSellListElement>
  )
}