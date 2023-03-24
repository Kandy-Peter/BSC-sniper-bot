import streamingMempoolData from "./bsc/streamin";
import { verifyToken } from "./utils/helpers";

const main = async () => {
  try {
    console.log("********PROCESS STARTED********");
    await streamingMempoolData();
  } catch (error) {
    console.log("Error streaming mempool data: ", error);
  }
}

main();