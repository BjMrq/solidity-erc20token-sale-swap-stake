import React, {useContext} from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contexts/web3/context";
import { Button } from "../../shared/button";
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

export function AddWallet() {
  const { addSatiToWallet} = useContext(Web3Context);
  
  return (
    <AddWalletDiv>
      <Button style={{display: "flex", padding: "6px", height: "35px", alignSelf: "flex-end"}}
        onClick={addSatiToWallet}><MetamaskLogoDiv><MetamaskLogo/></MetamaskLogoDiv>Add Sati</Button>
    </AddWalletDiv>
  );
}