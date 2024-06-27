import { createThirdwebClient, getContract } from "thirdweb";
import environment from "./environment";
import { polygon, sepolia } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: environment.VITE_THIRDWEB_CLIENT_KEY,
});

export const nftContract = getContract({
  client,
  chain: environment.VITE_ACTIVE_CHAIN === "137" ? polygon : sepolia,
  address: environment.VITE_TOKEN_ADDRESS,
});
