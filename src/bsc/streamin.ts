import {
  Contract,
  ethers,
  providers,
  Wallet,
} from 'ethers';

import {
  WSS_URL,
  WALLET_PRIVATE_KEY,
  PANCAKESWAP_ROUTER_ADDRESS,
  WALLET_ADDRESS,
  JSON_RPC,
  WBNB_ADDRESS,
  BNB_BUY_AMOUNT,
  TOKENS_TO_MONITOR
} from '../utils/constant';

import { sendNotification } from '../telegram/telegram';

import { ABI } from '../abi/pancakeswap';
import { verifyToken, swapExactEth, swapExactTokensForETH } from '../utils/helpers';

const streamingMempoolData = async () => {

  const wsProvider = new providers.WebSocketProvider(WSS_URL);
  const pancakeSwap = new ethers.utils.Interface(ABI);
  const provider = new providers.JsonRpcProvider(JSON_RPC);
  const signer = new Wallet(WALLET_PRIVATE_KEY, provider);

  const contract = new Contract(
    PANCAKESWAP_ROUTER_ADDRESS,
    ABI,
    signer
  );

  const monitor = async () => {
    wsProvider.on('pending', async (txHash: string) => {
      try {
        const receipt = await wsProvider.getTransaction(txHash);
        // console.log('receipt: ', receipt)
  
        receipt?.hash && process(receipt);
      } catch (error) {
        console.log('Error retrieving transaction receipt');
      }
    });
  }

  const process = async (receipt: providers.TransactionResponse) => {
    try {
      if (receipt?.to.toLowerCase() ==  PANCAKESWAP_ROUTER_ADDRESS.toLowerCase()) {
  
        let {
          value: targetAmountInWei,
          to: router,
          gasPrice: targetGasPriceInWei,
          gasLimit: targetGasLimit,
          hash: targetHash,
          from: targetFrom,
        } = receipt;

          let tokensToMonitor = TOKENS_TO_MONITOR.map((token: string) => token.toLowerCase());
    
          try {
             // decode the transaction data
            const txData = pancakeSwap.parseTransaction({ data: receipt.data });

            let {
              name: txName,
              args: [path],
            } = txData;
    
            if (!path)return;

            // let targetToken = path[path.length - 1];
            if (router.toLowerCase() !== PANCAKESWAP_ROUTER_ADDRESS.toLowerCase()) return;
            console.info({
              txName,
              path,
              targetFrom,
              targetHash,
              targetGasPriceInWei,
            })

            // BUY TOKEN********
            // Add liquidity transaction*******
            
            let tokenToBuy

            // Get the transaction name

            if (txName.startsWith('addLiquidity')) {
              console.log('path: ',path)
              let tokenA = path.tokenA;
              let tokenB = path.tokenB;
          
              if (tokensToMonitor.includes(tokenA.toLowerCase())) {
                tokenToBuy = tokenA;
              } else if (tokensToMonitor.includes(tokenB.toLowerCase())) {
                tokenToBuy = tokenB;
              }
            } else if (txName.startsWith('addLiquidityETH')) {
              tokenToBuy = path.token;
              console.log('path: ',path)
            }

            if (tokenToBuy) {
              let message = `TOKEN CAUGHT: ${tokenToBuy} \n
              Transaction hash: ${targetHash} \n
              Transaction from: ${targetFrom} \n
              Transaction gas price: ${targetGasPriceInWei} \n
              Transaction gas limit: ${targetGasLimit} \n
              Transaction amount: ${targetAmountInWei} \n
              Processed at: ${new Date().toLocaleString()}`;

              await sendNotification(message);

              const verifiedToken = await verifyToken(tokenToBuy);
          
              if (verifiedToken) {
                const path = [tokenToBuy, WBNB_ADDRESS];
                const nonce = await provider.getTransactionCount(WALLET_ADDRESS);
          
                let overLoads: any = {
                  gasLimit: targetGasLimit,
                  gasPrice: targetGasPriceInWei,
                  nonce,
                };

                let buyTx = await swapExactEth(
                  0,
                  path,
                  BNB_BUY_AMOUNT,
                  overLoads
                );

                if (buyTx.success) {
                  const receipt = await provider.getTransactionReceipt(buyTx.data);
          
                  if (receipt && receipt.status === 1) {
                    overLoads['nonce'] = nonce + 1;
                    console.log('Transaction successful');
          
                    try {
                      const MAX_INT = ethers.constants.MaxUint256;
                      const approveTx = await contract.approveContract(tokenToBuy);
                      const tx = await approveTx.callStatic.approve(PANCAKESWAP_ROUTER_ADDRESS, MAX_INT, overLoads);
          
                      console.log("**".repeat(20));
                      console.log("******APPROVE TRANSACTION********", tx.hash);
                      return { success: true, data: `${tx.hash}` };
                    } catch (error) {
                      console.log('Error approving transaction:', error);
                    }
          
                    console.log("WAITING FOR SELLING TOKENS");
                    console.log("**".repeat(20));
                    console.log("**********START SELLING TOKENS**********");
                    const amountIn = ethers.utils.parseUnits(BNB_BUY_AMOUNT.toString(), 'ether');

                    const sellTx = await swapExactTokensForETH(
                      amountIn,
                      0,
                      path,
                      overLoads
                    );

                    if (sellTx.success) {
                      const receipt = await provider.getTransactionReceipt(sellTx.data);
              
                      if (receipt && receipt.status === 1) {
                        overLoads['nonce'] = nonce + 1;
                        console.log('Transaction successful');
                      } else {
                        console.log('Transaction failed');
                      }
                    }
                  }
                } else {
                  console.log('Transaction failed');
                }
              }
            }
          }
          catch (error) {
            console.log('Error processing transaction:', error);
          }
      }  
    } catch (error) {
      console.log('Error processing mempool data: ', error)
    }
  }
  monitor();
}

export default streamingMempoolData;
