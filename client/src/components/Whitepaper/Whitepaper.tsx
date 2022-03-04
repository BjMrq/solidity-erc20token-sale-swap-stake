import React, { Fragment } from 'react';
import styled from "styled-components";

const WhitePaperText = styled.p`
  line-height: 1.5;
  padding: 0 35px;
  text-align: start;
`

const WhitePaperTitle = styled.h2`
 margin-bottom: 80px;
`

export function Whitepaper() {
  

  return (
    <Fragment>
      <WhitePaperTitle>Whitepaper</WhitePaperTitle>
      <WhitePaperText>
        Sati is a token on the Ethereum blockchain that offers auto static rewards on every
transaction du to an innovative protocol. Hold $STI before it launch and you'll receive
ETH automatically in your wallet as a reward when
Sati token is released! The reward is calculated with the amount of $STI you hold and the time you have hold on to it.
The Sati development and tokenomic is in the hands of a fully reliable and
experienced team. This is not financial advise but do not miss this opportunity!
      </WhitePaperText>
      <WhitePaperText>2022 Q1: Sati sale</WhitePaperText>
      <WhitePaperText>2022 Q2: Sati swap</WhitePaperText>
    </Fragment>
  );
}
