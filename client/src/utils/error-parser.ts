import * as R from "ramda";
import { capitalize } from ".";

const ifErrorIncludeReturnMessage = (includedMessage: string, returnedMessage?: string) => ([(error: Error) => Boolean(error.stack?.includes(includedMessage)), R.always(capitalize(returnedMessage || includedMessage))] as [R.SafePred<Error>, () => string]);

export const dummyErrorParser =  R.cond([
  ifErrorIncludeReturnMessage("invalid address"),
  ifErrorIncludeReturnMessage("invalid signature"),
  ifErrorIncludeReturnMessage("Lock time has not expired"),
  ifErrorIncludeReturnMessage("User denied transaction signature", "Transaction rejected"),
  ifErrorIncludeReturnMessage("Faucet is dry"),
  [R.T, R.always("Something went wrong, please contact client services")]
]) as (error:Error) => string;