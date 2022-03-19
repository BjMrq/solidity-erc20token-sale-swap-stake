import React, { useContext } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contracts/context";
import { Button } from "../../../style/tags/button";


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

