import React, { useState} from 'react';
import styled from "styled-components";
import { backGroundColor, mainColor } from "../../../style/colors";
import { FixRate } from "./FixeRate/FixRate";
import { MarketRate } from "./MarketRate/MarketRate";


const SatiSaleCard = styled.div`
  background-color: ${mainColor};
  height: 58vh;
  border-radius: 6px;
  box-shadow: 1px 8px 12px rgba(0, 0, 0, 0.4);
  padding: 5%;
`

const SaleTypesDiv = styled.div`
  display: flex;
  justify-content: space-around;
`

const CardDiv = styled.div`
  width: 80%;
`

const SaleTypeDiv = styled.div<{active: boolean}>`
  background-color: ${({active}) => active ? mainColor : backGroundColor};
  border-radius: 6px 6px 0 0;
  width: 100%;
  padding: 16px;
  margin:  ${({active}) => active ? "0 0 -5px 0" : "0 0 0 0"};;
`

const saleTypes = {
  fixed: "fixed",
  market: "market"
}

export function SatiSale() {
  const [saleType, setSaleType] = useState(saleTypes.market)
  
  return (
    <CardDiv>
      <SaleTypesDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.market)} active={ saleType === saleTypes.market}>Market Rate</SaleTypeDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.fixed)} active={ saleType === saleTypes.fixed}>Fix Rate</SaleTypeDiv>
      </SaleTypesDiv>
      <SatiSaleCard>
        {saleType === saleTypes.market && <MarketRate/>}
        {saleType === saleTypes.fixed && <FixRate/>}
      </SatiSaleCard>
    </CardDiv>
  );
}
