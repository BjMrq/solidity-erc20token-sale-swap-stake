import React from 'react';
import { Toast } from "./components/Toast/Toast";
import { Web3Root } from "./components/Web3Root/Web3Root";
import Web3ContextProvider from "./contexts/web3/context";
import { Whitepaper } from "./components/Whitepaper/Whitepaper";
import styled from "styled-components";
import { GlobalStyle } from "./style/general";
"styled-components";
import { QueryClient, QueryClientProvider } from 'react-query'
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})


const AppBody = styled.div`
  text-align: center;
  display: flex;
  height: 100%;
  width: 96%;
  padding: 0 2%;
  color: white;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
`

const Panel = styled.div`
  width: 50%;
  margin-top: 0;
 @media screen and (max-width: 1200px) { 
    width: 100%;
 }
`

function App() { 

  return ( 
    <Web3ContextProvider>
      <GlobalStyle/>
      <QueryClientProvider client={queryClient}>
        <AppBody>
          <Panel><Web3Root/></Panel>
          <Panel><Whitepaper/></Panel>
          <Toast />
        </AppBody>
      </QueryClientProvider>
    </Web3ContextProvider>
  );
}

export default App;
