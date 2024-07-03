import { ConnectButton } from "thirdweb/react";
import SignData from "./SignData";
import environment from "./environment";
import GetUnits from "./GetUnits";
import { polygon, polygonAmoy } from "thirdweb/chains";
import {
  client,
  coinbase,
  inAppWalletInit,
  metaMask,
  trustWallet,
  walletConnectInit,
} from "./thirdweb";
import TransactionTest from "./TransactionTest";
import { get, post } from "./helpers";
import { useEffect } from "react";
import { signLoginPayload } from "thirdweb/auth";

const wallets = [
  metaMask,
  coinbase,
  trustWallet,
  walletConnectInit,
  inAppWalletInit,
];

function App() {
  useEffect(() => {
    metaMask.subscribe("disconnect", async () => {
      await post({
        url: window.location.origin + "/logout",
      });
      console.log("Metamask disconnected");
    });
    // need to use accounts changed to handle account change
    metaMask.subscribe("accountsChanged", async () => {
      console.log("Metamask accounts changed");
    });

    coinbase.subscribe("disconnect", async () => {
      console.log("Coinbase disconnecting");
      await post({
        url: window.location.origin + "/logout",
      });
      console.log("Coinbase disconnected");
    });

    trustWallet.subscribe("disconnect", async () => {
      await post({
        url: window.location.origin + "/logout",
      });
      console.log("Trust Wallet disconnected");
    });

    walletConnectInit.subscribe("disconnect", async () => {
      await post({
        url: window.location.origin + "/logout",
      });
      console.log("Wallet Connect disconnected");
    });
  }, []);

  return (
    <div className="connect__container">
      <ConnectButton
        client={client}
        wallets={wallets}
        theme={"dark"}
        connectModal={{ size: "wide" }}
        showAllWallets={false}
        recommendedWallets={[wallets[0]]}
        chain={environment.VITE_ACTIVE_CHAIN === "137" ? polygon : polygonAmoy}
        onConnect={async (wallet) => {
          console.log("connected");
          const activeAccount = wallet.getAccount();
          let isLoggedIn = await get({
            url: window.location.origin + "/isLoggedIn",
          });
          if (activeAccount && polygon) {
            // check if user is logged in via /isLoggedIn endpoint
            if (!isLoggedIn) {
              console.log("Not logged in");
              // get payload to sign
              const messagePayload = await get({
                url: window.location.origin + "/login",
                params: {
                  address: activeAccount.address,
                  // eslint-disable-next-line react/prop-types
                  chainId: polygon.id.toString(),
                },
              });

              // sign payload
              const signatureWithPayload = await signLoginPayload({
                payload: messagePayload,
                account: activeAccount,
              });

              // send signed payload to /login endpoint to generate jwt
              await post({
                url: window.location.origin + "/login",
                params: signatureWithPayload,
              });

              // verify user is logged in
              isLoggedIn = await get({
                url: window.location.origin + "/isLoggedIn",
              });
              console.log("Now logged in: ", isLoggedIn);
            } else {
              console.log("Logged in");
            }
          }
        }}
        onDisconnect={async () => {
          await post({
            url: window.location.origin + "/logout",
          });
        }}
      />
      <SignData />
      <GetUnits />
      <TransactionTest />
    </div>
  );
}

export default App;
