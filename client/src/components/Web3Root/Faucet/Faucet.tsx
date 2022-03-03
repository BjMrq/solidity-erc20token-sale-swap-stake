import React, { useContext } from 'react';
import { Web3Context } from "../../../contexts/web3/context";
import { toastContractCall } from "../../../contracts/utils/make-call";


export function Faucet() {
  const { currentAccount , contracts: {faucetContract}} = useContext(Web3Context);

  const makeItRain = async () => {
    await toastContractCall(faucetContract.methods.makeItRain().send({ from: currentAccount }))

  }

  return (
    <div>
      <h2>Faucet</h2>
      <button onClick={makeItRain}>Get 0.01 Eth</button>
    </div>
  );
}
