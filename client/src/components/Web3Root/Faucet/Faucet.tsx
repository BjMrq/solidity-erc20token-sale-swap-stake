import React, { useContext, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contracts/context";
import { Button } from "../../../style/tags/button";

const FacetDiv = styled.div`
  width: 100%;
  text-align: left;
  align-self: self-end;
  padding-left: 20px;
  padding-bottom: 0;
`

const FaucetCatchP = styled.div`
  font-size: 20px
`;

export function Faucet() {
  const [showButton, setShowButton] = useState(false)
  const { toastContractSend , contracts: {faucetContract}} = useContext(Web3Context);

  const makeItRain = async () => {
    await toastContractSend(faucetContract.methods.makeItRain(), {}, "Faucet distribution")
  }

  return (
    <FacetDiv onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}>
      <FaucetCatchP >Psss.. no ETH?</FaucetCatchP>
      {showButton && <Button style={{marginBottom: "20px"}} onClick={makeItRain}>Make it rain</Button>}
    </FacetDiv>
  );
}
