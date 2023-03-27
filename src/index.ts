import streamingMempoolData from "./bsc/streamin";
import { sendNotification } from "./telegram/telegram";

const main = async () => {
  try {
    console.log("********PROCESS STARTED********");
    const time = new Date().toLocaleString();
    
    const message = `🚀🚀 Ka_sniper_bot is running 🚀🚀 \n\n🕒 Time: ${time}`;
    await sendNotification(message);
    await streamingMempoolData();
  } catch (error) {
    console.log("Error streaming mempool data: ", error);
  }
}

main();
