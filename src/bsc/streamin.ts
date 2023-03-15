require('dotenv').config();
import { ethers } from 'ethers'

const streamingMempoolData = async () => {
  const wssUrl = process.env.WSS_URL;
  console.log(wssUrl);
  const customWsProvider = new ethers.providers.WebSocketProvider(wssUrl);

  customWsProvider.on('pending', async (txHash) => {
    customWsProvider.getTransaction(txHash).then((tx) => {
      const { from, gasLimit, gasPrice, hash, nonce, to, value } = tx;
      const gasLimitNumber= ethers.utils.formatUnits(gasLimit, 'gwei');
      const gasPriceNumber = ethers.utils.formatUnits(gasPrice, 'gwei');
      const valueNumber = ethers.utils.formatUnits(value, 'gwei');
      const gasFee = Number(gasLimitNumber) * Number(gasPriceNumber);
      const totalValue = Number(valueNumber) + Number(gasFee);

      console.log(`
        Transaction hash: ${hash}
        From: ${from}
        To: ${to}
        Value: ${valueNumber} Gwei
        Gas limit: ${gasLimitNumber} Gwei
        Gas price: ${gasPriceNumber} Gwei
        Gas fee: ${gasFee} Gwei
        Total value: ${totalValue} Gwei
        none: ${nonce}
      `);
    })
  })

  // customWsProvider._websocket.on("error", async (e: any) => {
  //   console.log(`Unable to connect to ${e.subdomain} retrying in 3s...`);
  //   setTimeout(streamingMempoolData, 3000);
  // });

  customWsProvider._websocket.on("close", async (code: any) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    customWsProvider._websocket.terminate();
    setTimeout(streamingMempoolData, 3000);
  });
}

export default streamingMempoolData;
