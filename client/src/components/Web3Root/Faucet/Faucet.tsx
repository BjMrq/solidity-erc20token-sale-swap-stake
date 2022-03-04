import React, { useContext, useState } from 'react';
import { Web3Context } from "../../../contexts/web3/context";
import { Button } from "../../shared/button";
import styled from "styled-components";

const FacetDiv = styled.div`
  width: 100%;
  text-align: left;
  align-self: self-end;
  padding-left: 20px;
  padding-bottom: 0;
`

const FaucetCatchP = styled.p`
  font-size: 20px
`;

export function Faucet() {
  const [showButton, setShowButton] = useState(false)
  const { toastContractSend , contracts: {faucetContract}} = useContext(Web3Context);

  const makeItRain = async () => {
    await toastContractSend(faucetContract.methods.makeItRain())
  }

  return (
    <FacetDiv onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}>
      <FaucetCatchP >Psss.. no ETH?</FaucetCatchP>
      {showButton && <Button style={{marginBottom: "20px"}} onClick={makeItRain}>Make it rain</Button>}
    </FacetDiv>
  );
}
