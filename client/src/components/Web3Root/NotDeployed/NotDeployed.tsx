import React from 'react';
import styled from "styled-components";


const NotDeployedDiv = styled.div`
  min-height: 40vh;
`

export function NotDeployed() {
  return (
    <NotDeployedDiv>
      <h4>Contracts are only deployed on Kovan, please change chain</h4>
    </NotDeployedDiv>
  );
}
