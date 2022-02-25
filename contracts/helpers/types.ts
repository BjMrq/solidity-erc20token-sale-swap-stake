type PossibleNetwork = "development" | "ganache_local" | "kovan";
type PossibleSwapTokensNames = "LINK" | "BAT";

type SwapTokenAddressInfo = {
  name: PossibleSwapTokensNames;
  tokenAddress: string;
  priceFeedAddress: string;
};

type AllSwapTokenAddressInfo = Record<
  PossibleNetwork,
  {
    ETH: Pick<SwapTokenAddressInfo, "priceFeedAddress">;
    ERCTokens: SwapTokenAddressInfo[];
  }
>;
