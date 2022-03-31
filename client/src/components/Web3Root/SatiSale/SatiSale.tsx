import React, { useState } from 'react';
import styled from "styled-components";
import { backGroundColor, lightMainColor, lightSecondColor, mainColor, secondColor } from "../../../style/colors";
import { FixRate } from "./FixeRate/FixRate";
import { MarketRate } from "./MarketRate/MarketRate";

const SatiSaleCard = styled.div`
  height: 58vh;
  border-radius: 6px;
  box-shadow: 14px 20px 10px rgba(0, 0, 0, 0.4);
  padding: 8% 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
  @media screen and (max-width: 1200px) { 
      padding: 6% 10%;
  }
`

const SaleTypesDiv = styled.div`
  display: flex;
  justify-content: space-around;
  font-weight: bold;
`

const CardDiv = styled.div`
  width: 80%;
  @media screen and (max-width: 600px) { 
    width: 98%;
 }

 border-radius: 6px;

  background: linear-gradient(132deg, ${lightMainColor}, ${mainColor}, ${secondColor}, ${lightSecondColor});

  background-size: 300% 300%;
  
  -webkit-animation: GradientMove 60s ease infinite;
  -moz-animation: GradientMove 60s ease infinite;
  animation: GradientMove 60s ease infinite;

  @-webkit-keyframes GradientMove {
      0%{background-position:43% 0%}
      50%{background-position:58% 100%}
      100%{background-position:43% 0%}
  }
  @-moz-keyframes GradientMove {
      0%{background-position:43% 0%}
      50%{background-position:58% 100%}
      100%{background-position:43% 0%}
  }
  @keyframes GradientMove {
      0%{background-position:43% 0%}
      50%{background-position:58% 100%}
      100%{background-position:43% 0%}
  }
`

const SaleTypeDiv = styled.div<{active: boolean, saleType: keyof typeof saleTypes}>`
  background-color: ${({active}) => active ? "transparent" : backGroundColor};
  border-radius: ${({saleType}) => saleType === "fixed" ? "0 0 6px 0" : "0 0 0 6px"};
  width: 100%;
  padding: 20px;
`


const saleTypes = {
  fixed: "fixed",
  market: "market"
} as const

export function SatiSale() {
  const [saleType, setSaleType] = useState<keyof typeof saleTypes>(saleTypes.market)
  
  return (
    <CardDiv>
      <SaleTypesDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.market)} active={ saleType === saleTypes.market} saleType={saleType}>Market Rate</SaleTypeDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.fixed)} active={ saleType === saleTypes.fixed} saleType={saleType}>Fix Rate</SaleTypeDiv>
      </SaleTypesDiv>
      <SatiSaleCard>
        {saleType === saleTypes.market && <MarketRate/>}
        {saleType === saleTypes.fixed && <FixRate/>}
      </SatiSaleCard>
    </CardDiv>
  );
}
