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
