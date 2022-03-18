import React, {useContext} from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contexts/web3/context";
import { ERC20 } from "../../../contracts/types/ERC20";
import { Button } from "../../../style/tags/button";
import { ReactComponent as MetamaskLogo } from './metamask.svg';


const AddWalletDiv = styled.div`
  width: 100%;
  padding-bottom: 20px;
  display: flex;
  justify-content: flex-end;
`

const MetamaskLogoDiv = styled.div`
  height: 20px;
  width: 20px;
  padding-right: 6px;
`

export function AddMetamask({tokenContract, displayText}: {tokenContract: ERC20, displayText: string}) {
  const { addTokenToWallet } = useContext(Web3Context);

  const addTokenToMetamask = async () => addTokenToWallet({
    address: tokenContract.options.address,
    decimals: await tokenContract.methods.decimals().call(),
    symbol: await tokenContract.methods.symbol().call(),
  })
  
  return (
    <AddWalletDiv>
      <Button style={{display: "flex", padding: "6px", height: "35px", fontSize: "14px", alignSelf: "flex-end"}}
        onClick={addTokenToMetamask}><MetamaskLogoDiv><MetamaskLogo/></MetamaskLogoDiv>{displayText && displayText}</Button>
    </AddWalletDiv>
  );
}