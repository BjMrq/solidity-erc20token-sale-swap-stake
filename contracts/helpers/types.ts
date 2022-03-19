import { ERC20Instance } from "../types";

export type PossibleNetwork = "development" | "ganache" | "rinkeby";

export type SwapTokenAddressInfo = {
  name: string;
  erc20Token: ERC20Instance;
  priceFeedAddress: string;
};

export type AllSwapTokenAddressInfo = Record<
  PossibleNetwork,
  {
    ERCTokens: SwapTokenAddressInfo[];
  }
>;
