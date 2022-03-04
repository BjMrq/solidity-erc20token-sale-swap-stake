import React, {useContext, useState} from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contexts/web3/context";
import { toUnit } from "../../../utils/token";
import { Button } from "../../shared/button";

const SatiSaleDiv = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`

const LabelDiv = styled.div`
  min-width: 50vw;
`

const RateP = styled.div`
  margin-top: 10px;
  font-size: 20px;
`
const LabelP = styled.div`

`

const InputDiv = styled.div`
  min-width: 50vw;
  display: flex;
  height: 8vh;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
`

const BuyingInput = styled.input`
  height: 35px;
  border-radius: 6px 0 0 6px;
  padding: 9px;
  border: solid 1px #E5E5E5;
  outline: 0;
  font: normal 13px/100% Verdana, Tahoma, sans-serif;
  background: #FFFFFF;
  -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;
  &:hover {
    border-color: #C9C9C9;
  }
  &:focus {
    border-color: #C9C9C9;
  } 
`



export function SatiSale() {
  const [buyingSati, setBuyingAmount] = useState("")
  const { toastContractSend , contracts: {satiSaleContract}, currentAccount} = useContext(Web3Context);


  const buySati = async () => await toastContractSend(satiSaleContract.methods.buyTokens(currentAccount), {value: toUnit(buyingSati)})
  
  return (
    <SatiSaleDiv>
      <LabelDiv>
        <LabelP>Buy Sati with Ether:</LabelP>
        <RateP>(fixed 1ETH/100STI rate)</RateP>
      </LabelDiv>
      <InputDiv>
        <BuyingInput type="number" step=".001" onChange={({target: {value}}) => setBuyingAmount(String(value))}/>
        <Button style={{borderRadius: "0px 6px 6px 0px", height: "35px"}} onClick={buySati}>Buy</Button>
      </InputDiv>
    </SatiSaleDiv>
  );
}
