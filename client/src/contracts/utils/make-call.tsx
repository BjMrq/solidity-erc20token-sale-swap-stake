import { ReactElement } from "react";
import { toast } from "react-toastify";
import { ToastContentProps } from "react-toastify/dist/types";
import { PromiEvent, TransactionReceipt } from "web3-core/types";
import { dummyErrorParser } from "../../utils/error-parser";

const TransactionSuccessToast = ({ data }: ToastContentProps<TransactionReceipt>) => (
  <div>
    <div>Transaction succeeded</div>
    <a target="_blank" style= {{color: "#23379d", textDecoration: "none", fontSize: "1.2rem"}} href={`https://kovan.etherscan.io/tx/${data?.transactionHash}`}>🔎 view on etherscan</a>
  </div>
) as ReactElement

export const toastContractCall = async (contractFunctionToCall: PromiEvent<TransactionReceipt>) => 
  toast.promise(
    async () => contractFunctionToCall,
    {
      pending: {
        render(){
          return "Transaction pending.."
        },
        icon: true,
      
      },
      success: {
        render({data, closeToast, toastProps}: ToastContentProps<TransactionReceipt>){
          //TODO create a link to scan, review toast size and display time
          // https://kovan.etherscan.io/tx/0xc8ed5fce86c7ce0af18db5f7ef835fead4b7b6fcf20f3a8d38416d53115216e0
          console.log("Success", data);
          return TransactionSuccessToast({closeToast, toastProps, data})
        }
      },
      error: {
        render({data}: {data: Error}){
          return dummyErrorParser(data)
        }
      }
    }
  )
