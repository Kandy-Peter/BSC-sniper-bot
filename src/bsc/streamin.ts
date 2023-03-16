require('dotenv').config();
import { ethers } from 'ethers'
import { readFileSync } from 'fs';
import { WSS_URL, ABI, WALLET_ADDRESS } from '../utils/constant';

const streamingMempoolData = async () => {
  const customWsProvider = new ethers.providers.WebSocketProvider(WSS_URL);

  customWsProvider.on('pending', async (txHash) => {
    customWsProvider.getTransaction(txHash).then((tx) => {
      const { from, gasLimit, gasPrice, hash, nonce, to, value } = tx;
      const gasLimitNumber= ethers.utils.formatUnits(gasLimit, 'gwei');
      const gasPriceNumber = ethers.utils.formatUnits(gasPrice, 'gwei');
      const valueNumber = ethers.utils.formatUnits(value, 'gwei');
      const gasFee = Number(gasLimitNumber) * Number(gasPriceNumber);
      const totalValue = Number(valueNumber) + Number(gasFee);

      if (!from || !to || !value) {
        console.log('Transaction is not a transfer')
      }

      console.info(`
        Transaction hash: ${hash}
        From: ${from}
        To: ${to}
        Value: ${valueNumber} Gwei
        Gas limit: ${gasLimitNumber} Gwei
        Gas price: ${gasPriceNumber} Gwei
        Gas fee: ${gasFee} Gwei
        Total value: ${totalValue} Gwei
        nonce: ${nonce}
      `);
    })
  })

  customWsProvider._websocket.on("close", async (code: any) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    customWsProvider._websocket.terminate();
    setTimeout(streamingMempoolData, 3000);
  });

  const addLiquitidy = async () => {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, customWsProvider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      wallet
    );

    const tx = await contract.addLiquidity(
      process.env.TOKEN_ADDRESS,
      process.env.TOKEN_AMOUNT,
      process.env.TOKEN_AMOUNT,
      process.env.BNB_AMOUNT,
      process.env.DEADLINE,
      {
        gasLimit: process.env.GAS_LIMIT,
        gasPrice: process.env.GAS_PRICE,
      }
    );

    console.log("Transaction hash: ", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction receipt: ", receipt);

    const balance = await contract.balanceOf(wallet.address);
    console.log("Balance: ", balance.toString());
  }

  
}

export default streamingMempoolData;
