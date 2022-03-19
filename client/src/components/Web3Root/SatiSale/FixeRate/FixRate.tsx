import React, { useContext, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { Button } from "../../../../style/tags/button";
import { Input } from "../../../../style/tags/input";
import { toUnit } from "../../../../utils/token";

const FixSaleContentDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
`

const RateP = styled.div`
  margin-top: 10px;
  font-size: 20px;
`

const InputDiv = styled.div`
  display: flex;
  height: 8vh;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
`


export function FixRate() {
  const [buyingSatiAmount, setBuyingAmount] = useState("")
  const { toastContractSend , contracts: {satiSaleContract}, currentAccount} = useContext(Web3Context);


  const buySati = async () => await toastContractSend(satiSaleContract.methods.buyTokens(currentAccount), {value: toUnit(buyingSatiAmount)})
  
  return (
    <FixSaleContentDiv>
      <div>Buy Sati with Ether:</div>
      <RateP>(fixed TODO 1ETH/100STI rate)</RateP>
      <InputDiv>
        <Input style={{borderRadius:"6px 0 0 6px", borderRightWidth: "0"}} type="text" placeholder="0.0" value={buyingSatiAmount} onChange={({target: {value}}) => setBuyingAmount(value.replace(/[^0-9.]/g, ''))}/>
        <Button style={{borderRadius: "0px 6px 6px 0px", borderRightWidth: "0.1px"}} onClick={buySati}>Buy</Button>
      </InputDiv>
    </FixSaleContentDiv>
  );
}
