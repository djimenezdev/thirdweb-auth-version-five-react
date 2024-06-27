import Web3Provider from "./Web3Provider";
import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";
import SignData from "./SignData";
import environment from "./environment";
import GetUnits from "./GetUnits";
import { polygon, sepolia } from "thirdweb/chains";
import { client } from "./thirdweb";
import TransactionTest from "./TransactionTest";
import { post } from "./helpers";

const metaMask = createWallet("io.metamask");
const coinbase = createWallet("com.coinbase.wallet");
const trustWallet = createWallet("com.trustwallet.app");
const walletConnectInit = walletConnect();
const inAppWalletInit = inAppWallet({
  auth: {
    options: ["email", "google", "phone"],
  },
});

metaMask.subscribe("disconnect", async () => {
  await post({
    url: environment.VITE_API_URL + "/logout",
  });
  console.log("Metamask disconnected");
});

coinbase.subscribe("disconnect", async () => {
  await post({
    url: environment.VITE_API_URL + "/logout",
  });
  console.log("Coinbase disconnected");
});

trustWallet.subscribe("disconnect", async () => {
  await post({
    url: environment.VITE_API_URL + "/logout",
  });
  console.log("Trust Wallet disconnected");
});

walletConnectInit.subscribe("disconnect", async () => {
  await post({
    url: environment.VITE_API_URL + "/logout",
  });
  console.log("Wallet Connect disconnected");
});

const wallets = [
  metaMask,
  coinbase,
  trustWallet,
  walletConnectInit,
  inAppWalletInit,
];

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
          recommendedWallets={[wallets[0]]}
          chain={environment.VITE_ACTIVE_CHAIN === "137" ? polygon : sepolia}
          onDisconnect={async () => {
            await post({
              url: environment.VITE_API_URL + "/logout",
            });
          }}
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
        <GetUnits />
        <TransactionTest />
      </div>
    </Web3Provider>
  );
}

export default App;
