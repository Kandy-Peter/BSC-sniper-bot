require('dotenv').config()

export const PANCAKESWAP_ROUTER_ADDRESS = process.env.PANCAKESWAP_ROUTER_ADDRESS
export const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS
export const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS
export const WSS_URL = process.env.WSS_URL
export const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY
export const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS
export const BSCSCAN_API_ENDPOINT = process.env.BSCSCAN_API_ENDPOINT
export const JSON_RPC = process.env.JSON_RPC
export const WBNB_ADDRESS = process.env.WBNB_ADDRESS
export const RUGCHECKER_CONTRACT_ADDRESS = process.env.RUGCHECKER_CONTRACT_ADDRESS
export const BNB_BUY_AMOUNT = 0.00001 * 1e18
export const TOKENS_TO_MONITOR = [
  '0x55d398326f99059fF775485246999027B3197955',
  '0x991bb6093Fa735D27CD1444b2ad8FdD95876FeD5',
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
]