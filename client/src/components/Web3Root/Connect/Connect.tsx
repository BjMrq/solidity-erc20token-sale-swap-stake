import React, { useContext } from 'react';
import { Web3Context } from "../../../contexts/web3/context";
import { Button } from "../../shared/button";
import styled from "styled-components";


const ConnectDiv = styled.div`
  min-height: 30vh;
`

export function Connect() {
  const { initWeb3 } = useContext(Web3Context);
  
  return (
    <ConnectDiv>
      <Button onClick={initWeb3}>Connect to access</Button>
    </ConnectDiv>
  );
}

