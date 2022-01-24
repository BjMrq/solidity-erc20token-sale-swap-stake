import styled from "styled-components";

import { button } from "./button";
import { errorColor, lightColor, mainColor, successColor } from "./colors";

export const ErrorFeedBack = styled.div`
  color: ${errorColor};
  margin-top: 6px;
  text-align: center;
`;

export const SuccessFeedBack = styled.div`
  color: ${successColor};
  margin-top: 6px;
  text-align: center;
`;

export const Label = styled.label`
  margin: 16px 0 8px 0;
`;

export const FormTitle = styled.div`
  text-align: center;
  color: ${mainColor};
  width: 100%;
  height: 100%;
  font-size: 1.5em;
  font-weight: bold;
  padding: 14px 0;
  background: ${lightColor};
  ${({ active }: { active: boolean }) =>
    active &&
    `
    background: white;
  `}
`;

export const InputButton = styled.input.attrs(
  ({ value }: { value: string }) => ({
    type: "submit",
    value,
  })
)`
  ${button}
  margin-top: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
`;
