require('dotenv').config();
import axios from 'axios';
import Web3 from 'web3';

// API endpoint for retrieving transactions
const apiEndpoint = 'https://api.bscscan.com/api';

// BscScan API key
const apiKey = process.env.BSCSCAN_API_KEY;

// BscScan address for the PancakeSwap factory contract
const factoryAddress = '0xBCfCcbde45cE874adCB698cC183deBcF17952812';

// function to retrieve transactions for the PancakeSwap factory contract
async function getFactoryTransactions() {
  try {
    const response = await axios.get(apiEndpoint, {
      params: {
        module: 'account',
        action: 'txlist',
        address: factoryAddress,
        apiKey: apiKey,
      },
    });

    // filter the response to only include transactions with a "createPair" event
    const transactions = response.data.result.filter(tx =>
      tx.input.includes('createPair')
    );

    // extract the newly added liquidity pools from the "createPair" events
    const newPools = transactions.map(tx => {
      const input = tx.input;
      const tokenA = '0x' + input.slice(34, 74);
      const tokenB = '0x' + input.slice(98, 138);
      return [tokenA, tokenB];
    });

    console.log('Newly added liquidity pools:', newPools);
  } catch (error) {
    console.error(error);
  }
}

// call the function to retrieve transactions
export default getFactoryTransactions;

if (txName.startsWith('addLiquidity')) {
  let tokenToBuy;
  let tokenA = path.tokenA;
  let tokenB = path.tokenB;

  if (tokensToMonitor.includes(tokenA.toLowerCase())) {
    tokenToBuy = tokenA;
  } else if (tokensToMonitor.includes(tokenB.toLowerCase())) {
    tokenToBuy = tokenB;
  }

  if (tokenToBuy) {
    //send notification function
    console.log('Token to buy: ', tokenToBuy)
    const verifiedToken = await verifyToken(tokenToBuy);

    if (verifiedToken) {
      const path = [tokenToBuy, WBNB_ADDRESS];

      const nonce = await provider.getTransactionCount(WALLET_ADDRESS);

      let overLoads: any = {
        gasLimit: targetGasLimit,
        gasPrice: targetGasPriceInWei,
        nonce,
      };

      let buyTx = await contract.swapExactETHForTokensSupportingFeeOnTransferTokens({
        ...overLoads,
        amountOutMin: 0,
        path,
        bnbAmount: BNB_BUY_AMOUNT,
      })

      if (buyTx.success) {
        // get the transaction receipt to check if the transaction was successful
        const receipt = await provider.getTransactionReceipt(buyTx.data);

        if (receipt && receipt.status === 1) {
          overLoads['nonce'] = nonce + 1;
          console.log('Transaction successful');
          // approve the transaction
          try {
            const MAX_INT = ethers.constants.MaxUint256;
            const approveTx = await contract.approveContract(tokenToBuy)
            const tx = await approveTx.callStatic.approve(PANCAKESWAP_ROUTER_ADDRESS, MAX_INT, overLoads);

            console.log("**".repeat(20));
            console.log("******APPROVE TRANSACTION********", tx.hash)
            return { success: true, data: `${tx.hash}` };
          } catch (error) {
            console.log('Error approving transaction:', error);
          }

          console.log("WAITING FOR SELLING TOKENS")
        }
      } else {
        console.log('Transaction failed');
      }
    }
  }
} else if (txName.startsWith('addLiquidityETH')) {
  let tokenToBuy = path.token

  if (tokenToBuy) {
    //send notification function with message
    /**
     * message format
     * await sendNotification(messae)
     */

    const verifiedToken = await verifyToken(tokenToBuy);

    if (verifiedToken) {
      const path = [tokenToBuy, WBNB_ADDRESS];

      const nonce = await provider.getTransactionCount(WALLET_ADDRESS);

      let overLoads: any = {
        gasLimit: targetGasLimit,
        gasPrice: targetGasPriceInWei,
        nonce,
      };

      let buyTx = await contract.swapExactETHForTokensSupportingFeeOnTransferTokens({
        ...overLoads,
        amountOutMin: 0,
        path,
        bnbAmount: BNB_BUY_AMOUNT,
      })

      if (buyTx.success) {
        // get the transaction receipt to check if the transaction was successful
        const receipt = await provider.getTransactionReceipt(buyTx.data);

        if (receipt && receipt.status === 1) {
          overLoads['nonce'] = nonce + 1;
          console.log('Transaction successful');
          // approve the transaction
          try {
            const MAX_INT = ethers.constants.MaxUint256;
            const approveTx = await contract.approveContract(tokenToBuy)
            const tx = await approveTx.callStatic.approve(PANCAKESWAP_ROUTER_ADDRESS, MAX_INT, overLoads);

            console.log("**".repeat(20));
            console.log("******APPROVE TRANSACTION********", tx.hash)
            return { success: true, data: `${tx.hash}` };
          } catch (error) {
            console.log('Error approving transaction:', error);
          }

          console.log("WAITING FOR SELLING TOKENS")
        }
      } else {
        console.log('Transaction failed');
      }
    }
  }
}
