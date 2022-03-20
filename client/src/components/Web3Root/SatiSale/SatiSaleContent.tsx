import React, { Fragment } from 'react';
import styled from "styled-components";
import { Button } from "../../../style/tags/button";


const SaleTitle= styled.div`
  justify-self: start;
  width: 100%;
  font-size: 1.5rem;
  margin: 14px 0;
`

export function SatiSaleContent({saleTitle, children, callToAction}: 
{saleTitle: string, children: JSX.Element | JSX.Element[], callToAction: {display: string, callback: () => void}}) {

  return (
    <Fragment>
      <SaleTitle>{saleTitle}</SaleTitle>
      {children}
      <div style={{width: "100%"}}>
        <Button onClick={callToAction.callback}>{callToAction.display}</Button>
      </div>
    </Fragment>
  )
} 