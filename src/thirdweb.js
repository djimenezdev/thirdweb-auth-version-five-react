import { createThirdwebClient, getContract } from "thirdweb";
import environment from "./environment";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";

export const client = createThirdwebClient({
  clientId: environment.VITE_THIRDWEB_CLIENT_KEY,
});

export const metaMask = createWallet("io.metamask");
export const coinbase = createWallet("com.coinbase.wallet");
export const trustWallet = createWallet("com.trustwallet.app");
export const walletConnectInit = walletConnect();
export const inAppWalletInit = inAppWallet({
  auth: {
    options: ["email", "google", "phone"],
  },
});

export const nftContract = getContract({
  client,
  chain: environment.VITE_ACTIVE_CHAIN === "137" ? polygon : polygonAmoy,
  address: environment.VITE_TOKEN_ADDRESS,
});
