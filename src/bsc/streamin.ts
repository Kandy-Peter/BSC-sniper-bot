import {
  constants,
  Contract,
  ethers,
  providers,
  utils,
  Wallet,
} from 'ethers';

import {
  WSS_INFURA_URL,
  WALLLET_PRIVATE_KEY,
  BSCSCAN_API_KEY,
  BSCSCAN_API_ENDPOINT,
  FACTORY_ADDRESS,
  PANCAKESWAP_ROUTER_ADDRESS,
  TOKEN_ADDRESS,
  WALLET_ADDRESS,
  INFURA_URL,
} from '../utils/constant';

import { ABI } from '../abi/pancakeswap';

const SUPPORTED_ROUTERS = ['0x10ed43c718714eb63d5aa57b78b54704e256024e'];
const TOKENS_TO_MONITOR = [''];

const streamingMempoolData = async () => {

  const wsProvider = new providers.WebSocketProvider(WSS_INFURA_URL);
  const pancakeSwap = new ethers.utils.Interface(ABI);
  const provider = new providers.JsonRpcProvider(INFURA_URL);
  const signer = new Wallet(WALLLET_PRIVATE_KEY, provider);

  const contract = new Contract(
    PANCAKESWAP_ROUTER_ADDRESS,
    ABI,
    signer
  );

  const monitor = async () => {
    wsProvider.on('pending', async (txHash: string) => {
      try {
        const receipt = await wsProvider.getTransaction(txHash);
        console.log(receipt)
  
        receipt?.hash && process(receipt);
      } catch (error) {
        console.log('Error retrieving transaction receipt:', error);
      }
    });
  }

  const process = async (receipt: providers.TransactionResponse) => {
    if (!receipt || !receipt.hash) {
      console.log('No receipt found')
      return;
    }
    let {
      to: router,
      gasPrice: targetGasPriceInWei,
      gasLimit: targetGasLimit,
      hash: targetHash,
      from: targetFrom,
    } = receipt;

    console.log(receipt)

    if (router && SUPPORTED_ROUTERS.some((router) => router?.toLowerCase() === receipt.to?.toLowerCase())) {
      let targetGasPrice = utils.formatUnits(targetGasPriceInWei!.toString());

      try {
        const txData = pancakeSwap.parseTransaction({
          data: receipt.data,
          value: receipt.value,
        });

        // destructuring the transaction data
        let {
          name: txName,
          args: [amountIn, amountOutMin, path, to, deadline],
        } = txData;

        let targetToken = path[path.length - 1];

        if (!path) {
          return;
        }

        console.log('*************STREAMING PROCESS STARTED***************');
        console.info({
          targetHash,
          targetFrom,
          targetGasPrice,
          txName,
          path,
        })
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  monitor();
}

export default streamingMempoolData;
