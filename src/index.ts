import streamingMempoolData from "./bsc/streamin";
import getFactoryTransactions from "./bsc/addLiquidity";

const main = async () => {
  try {
    await streamingMempoolData();
  } catch (error) {
    console.log("Error streaming mempool data: ", error);
  }
}

main();