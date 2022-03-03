import React, { useContext } from 'react';
import { Web3Context } from "../../../contexts/web3/context";


export function Connect() {
  const { initWeb3 } = useContext(Web3Context);
  
  return (
    <div>
      <button onClick={initWeb3}>connect</button>
    </div>
  );
}
