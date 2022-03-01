import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Web3Context } from "../../../contexts/web3";
// import { faucetContract } from "../../../contracts/instances";


export function Faucet() {
  const { currentAccount , faucetContract} = useContext(Web3Context);
  
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("")
  
  //TODO error handling
  const makeItRain = async (formEvent: ChangeEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    console.log("RAINING!", beneficiaryAddress);
    await faucetContract.methods.makeItRain(beneficiaryAddress).send({ from: currentAccount })
   
  }

  useEffect(() => {
    (async () => {
      // console.log("In Faucet",faucetContract._address, await web3instance.eth.getBalance(faucetContract._address));
    })();
  }, [currentAccount, faucetContract])


  return (
    <div>
      <h2>Faucet</h2>
      <form action="" onSubmit={makeItRain}>
        <label htmlFor="beneficiaryAddress" >Get some ETh to play around :</label>
        <br/><br/>
        <input type="string" style={{float: "left"}} id="beneficiaryAddress" onChange={({target: {value}}) => setBeneficiaryAddress(String(value))}/>
        <input type="submit" style={{float: "left"}} />
        <br/>
      </form> 
      
    </div>
  );
}
