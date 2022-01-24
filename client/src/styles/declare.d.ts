interface Window {
  ethereum: {
    enable: () => Promise<void>;
    request: (options: { method: string }) => Promise<void>;
    sendAsync: (
      payload: any,
      callback: (err: any, result: any) => void
    ) => void;
  };
  web3: {};
}
