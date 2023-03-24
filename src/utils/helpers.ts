import { BigNumber, Contract, providers, utils, Wallet } from "ethers";
import axios from "axios";
import { ABI } from "../abi/pancakeswap";
import {
	WALLET_PRIVATE_KEY,
	PANCAKESWAP_ROUTER_ADDRESS,
	JSON_RPC,
	BSCSCAN_API_KEY,
	WALLET_ADDRESS
} from "../utils/constant";

const signer = new Wallet(WALLET_PRIVATE_KEY, new providers.JsonRpcProvider(JSON_RPC));

// const rug_checker_url = `https://therugcheck.com/bsc/?address=${tokenAddress}`

export const lowerCaseValue = (str: string) => {
	return str.toLowerCase();
};

export const checkToken = async (tokenAddress: string) => {
	const rug_checker_url = `https://therugcheck.com/bsc/?address=${tokenAddress}`;

	try {
		const response = await axios.get(rug_checker_url);
		const data = response.data;
		console.log(data);
		return data;
	} catch (error) {
		console.log("Error: ", error);
	}
};
	

export const checkTokenTax = async (swapRouter: string, swapPath: string[], amount: string) => {
	try {
		if(checkToken(swapRouter)) {
			const contract = new Contract(
				PANCAKESWAP_ROUTER_ADDRESS,
				ABI,
				signer
			);
			const tx = await contract.getAmountsOut(amount, swapPath);
			console.log(tx);
			return tx;
		}
	} catch (error) {
		console.log("Error: ", error);
	}
};

export const verifyToken = async (tokenAddress: string) => {
	try {
		const response = await axios.get(`https://api.bscscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${BSCSCAN_API_KEY}`);
		const data = response.data;
		const { status } = data;
		if (status === '1') {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
	}
}

// SwapExactETHForTokens on buy

export const swapExactEth = async (amountOutMin: number, swapPath: string[], bnbAmount: number, overLoads: any) => {
	try {
		const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

		const contract = new Contract(
			PANCAKESWAP_ROUTER_ADDRESS,
			ABI,
			signer
		);

		const tx = await contract.callStatic.swapExactETHForTokensSupportingFeeOnTransferTokens(
			amountOutMin,
			swapPath,
			WALLET_ADDRESS,
			deadline,
			overLoads
		);

		console.log("**".repeat(20));
		console.log("******BUY TRANSACTION**********", tx.hash)
		return { success: true, data: `${tx.hash}` };
	} catch (error) {
		console.log("Error SwapExactETHForTokens: ", error);
	}
};

// swapExactTokensForETH on sell

export const swapExactTokensForETH = async (amountIn: BigNumber, amountOutMin: number, swapPath: string[], overLoads: any) => {
	try {
		const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

		const contract = new Contract(
			PANCAKESWAP_ROUTER_ADDRESS,
			ABI,
			signer
		);

		const tx = await contract.callStatic.swapExactTokensForETHSupportingFeeOnTransferTokens(
			amountIn,
			amountOutMin,
			swapPath,
			WALLET_ADDRESS,
			deadline,
			overLoads
		);

		console.log("**".repeat(20));
		console.log("******SELL TRANSACTION**********", tx.hash)
		return { success: true, data: `${tx.hash}` };
	} catch (error) {
		console.log("Error swapExactTokensForETHSupportingFeeOnTransferTokens: ", error);
	}
}
