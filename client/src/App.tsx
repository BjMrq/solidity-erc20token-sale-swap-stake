import React from 'react';
import { Toast } from "./components/Toast/Toast";
import './App.css';
import { Web3Root } from "./components/Web3Root/Web3Root";
import Web3ContextProvider from "./contexts/web3/context";


function App() { 

  return ( 
    <Web3ContextProvider><div className="App">
      <header className="App-body">
        <Web3Root/>
        <Toast />
      </header>
    </div></Web3ContextProvider>
  );
}

export default App;
