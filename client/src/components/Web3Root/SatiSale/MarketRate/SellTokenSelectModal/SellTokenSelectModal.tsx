import React, { useContext, useMemo } from 'react';
import Modal from 'react-modal';
import styled from "styled-components";
import { Web3Context } from "../../../../../contracts/context";
import { ERC20TokenInfo, PossibleSellToken, SwapContractInfo } from "../../../../../contracts/types";
import { ERC20 } from "../../../../../contracts/types/ERC20";
import { borderRadius } from "../../../../../style/characteristics";
import { backGroundColor, lightColor } from "../../../../../style/colors";
import { scrollbar } from "../../../../../style/scrollbar";
import { SellToken } from "./SellToken/SellToken";

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    overflow: "hidden",
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: "80vh",
    width: '400px',
    maxWidth: "94vw",
    backgroundColor: backGroundColor,
    borderRadius: borderRadius,
    color: lightColor,
    border: "none",
    padding: "0"
  },
};

const TokenSelectContainer = styled.div`
 ${scrollbar}
 overflow-x: hidden;
 max-height: 70vh;
 width: 84%;
 background-color: ${backGroundColor};
 padding: 10px 8%;
`

const ModalTitle = styled.div`
  width: 100%;
  font-size: 2rem;
  text-align: center;
  height: 60px;
  font-weight: bold;
  padding-top: 36px;
`


type SellTokenInfo = {
  name: PossibleSellToken,
  contract: ERC20
}

export function SellTokenSelectModal({
  tokenSelectionModalOpen, 
  setTokenSelectionModalOpen, 
  selectNewTokenToSell
}:{
  tokenSelectionModalOpen: boolean, 
  setTokenSelectionModalOpen: (valueToSet: boolean) => void,
  selectNewTokenToSell: (tokenName: PossibleSellToken) => void
}) {

  const { contracts: {swapContracts}} = useContext(Web3Context);

  const allPossibleSellTokens = useMemo(() => tokenSelectionModalOpen ? Object.values(swapContracts.reduce((possibleSellTokens, swapContract: SwapContractInfo) => {

    if(!Boolean(possibleSellTokens[swapContract.baseToken.name])) possibleSellTokens[swapContract.baseToken.name] = swapContract.baseToken
    if(!Boolean(possibleSellTokens[swapContract.quoteToken.name])) possibleSellTokens[swapContract.quoteToken.name] = swapContract.quoteToken


    return possibleSellTokens;
  }, {} as Record<PossibleSellToken, SellTokenInfo>)) : [], [tokenSelectionModalOpen])

  
  return (
    <Modal
      isOpen={tokenSelectionModalOpen}
      onRequestClose={() => setTokenSelectionModalOpen(false)}
      style={modalStyle}
    >
      <ModalTitle>Select token to sell</ModalTitle>
      <TokenSelectContainer>
        {allPossibleSellTokens.map((sellToken: ERC20TokenInfo) => 
          (<SellToken
            key={sellToken.name} 
            tokenName={sellToken.name} 
            tokenContract={sellToken.contract}
            selectNewTokenToSell={selectNewTokenToSell}
          />
          )
        )}
      </TokenSelectContainer>
    </Modal>
  )
}