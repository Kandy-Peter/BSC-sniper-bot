require('dotenv').config()
import { ethers, providers } from 'ethers'
const streamingMempoolData = async () => {
    try {
        const _wsprovider = new ethers.providers.WebSocketProvider(process.env.WSS_URL!);
        _wsprovider.on('pending', async (txHash: string) => {
            try {
                let receipt = await _wsprovider.getTransaction(txHash);
                receipt?.hash && _process(receipt);
            } catch (error) {
                console.error(`Error`, error);
            }
        });
        const _process = async (receipt: providers.TransactionResponse) => {
            let {
                value: targetAmountInWei,
                to: router,
                gasPrice: targetGasPriceInWei,
                gasLimit: targetGasLimit,
                hash: targetHash,
                from: targetFrom,
            } = receipt
            try {
                console.info(`
                TargetAmountInWei: ${targetAmountInWei}
                Target Transaction Hash: ${targetHash}
                Target Address: ${targetFrom},
                Target Gas Price: ${(targetGasPriceInWei?.div(1e9).toString())} Gwei
                Router: ${router}
                target Gas Limit: ${targetGasLimit}`)
            } catch (error) {
                console.log("Error processing mempool data: ", error)
            }
        }
    } catch (error) {
        console.log("Error streaming mempool data: ", error)
    }
}

export default streamingMempoolData