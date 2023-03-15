import streamingMempoolData from "./bsc/streamin";

const main = async () => {
  try {
    await streamingMempoolData();
  } catch (error) {
    console.log("Error streaming mempool data: ", error);
  }
}

main();