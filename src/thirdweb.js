import { createThirdwebClient, getContract } from "thirdweb";
import environment from "./environment";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";

export const client = createThirdwebClient({
  clientId: environment.VITE_THIRDWEB_CLIENT_KEY,
});

export const metaMask = createWallet("io.metamask");
export const coinbase = createWallet("com.coinbase.wallet", {
  walletConfig: {
    options: "eoaOnly",
  },
});
export const trustWallet = createWallet("com.trustwallet.app");
export const walletConnectInit = walletConnect();
export const inAppWalletInit = inAppWallet({
  auth: {
    options: ["email", "google", "phone", "apple"],
  },
});

// Supported tokens for the app - sending/purchasing
// native token is always supported
export const supportedTokens = {
  137: [
    {
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      name: "USD Coin",
      symbol: "USDC",
      icon: "https://vlasm6lnpzeazirr.public.blob.vercel-storage.com/usdc-drXUpTiPhyrfrKtBELdn9iP4hb4RnW.png",
    },
  ],
};

export const nftContract = getContract({
  client,
  chain: environment.VITE_ACTIVE_CHAIN === "137" ? polygon : polygonAmoy,
  address: environment.VITE_TOKEN_ADDRESS,
});
