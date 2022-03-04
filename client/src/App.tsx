import React from 'react';
import { Toast } from "./components/Toast/Toast";
import { Web3Root } from "./components/Web3Root/Web3Root";
import Web3ContextProvider from "./contexts/web3/context";
import styled from "styled-components";
import { Whitepaper } from "./components/Whitepaper/Whitepaper";

const AppBody = styled.div`
  text-align: center;
  background-color: #282c34;
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  color: white;
  padding: 20px
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`

const Panel = styled.div`
  min-width: 50vw;
  min-height: 100vh;
`

function App() { 

  return ( 
    <Web3ContextProvider><AppBody>
      <Panel><Web3Root/></Panel>
      <Panel><Whitepaper/></Panel>
      <Toast />
    </AppBody></Web3ContextProvider>
  );
}

export default App;
