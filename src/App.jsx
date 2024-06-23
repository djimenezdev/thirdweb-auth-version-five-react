import { createThirdwebClient, defineChain } from "thirdweb";
import Web3Provider from "./Web3Provider";
import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";
import SignData from "./SignData";
import environment from "./environment";
// import { get, post } from "./helpers";

const client = createThirdwebClient({
  clientId: environment.VITE_THIRDWEB_CLIENT_KEY,
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.trustwallet.app"),
  walletConnect({
    projectId: environment.VITE_WALLET_CONNECT_ID,
  }),
  inAppWallet({
    auth: {
      options: ["email", "google", "phone"],
    },
  }),
];

const polygon = defineChain({
  id: 137,
});

function App() {
  return (
    <Web3Provider>
      <div className="connect__container">
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"dark"}
          connectModal={{ size: "wide" }}
          showAllWallets={false}
          recommendedWallets={[wallets[0], wallets[1]]}
          chain={polygon}
          /* auth={{
            getLoginPayload: async (params) => {
              return get({
                url: environment.VITE_API_URL + "/login",
                params: {
                  address: params.address,
                  chainId: polygon.id.toString(),
                },
              });
            },
            doLogin: async (params) => {
              await post({
                url: environment.VITE_API_URL + "/login",
                params,
              });
            },
            isLoggedIn: async () => {
              return await get({
                url: environment.VITE_API_URL + "/isLoggedIn",
              });
            },
            doLogout: async () => {
              await post({
                url: environment.VITE_API_URL + "/logout",
              });
            },
          }} */
        />
        <SignData polygon={polygon} />
      </div>
    </Web3Provider>
  );
}

export default App;
