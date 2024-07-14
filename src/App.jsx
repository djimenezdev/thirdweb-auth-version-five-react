import {
  ConnectButton,
  useActiveWalletConnectionStatus,
  useIsAutoConnecting,
} from "thirdweb/react";
import SignData from "./SignData";
import environment from "./environment";
import GetUnits from "./GetUnits";
import { polygon, polygonAmoy } from "thirdweb/chains";
import {
  client,
  coinbase,
  inAppWalletInit,
  metaMask,
  supportedTokens,
  trustWallet,
  walletConnectInit,
} from "./thirdweb";
import TransactionTest from "./TransactionTest";
import { get, post } from "./helpers";
import { useEffect, useState } from "react";
import { signLoginPayload } from "thirdweb/auth";
import BuyCrypto from "./BuyCrypto";

const wallets = [
  metaMask,
  coinbase,
  trustWallet,
  walletConnectInit,
  inAppWalletInit,
];

function App() {
  const [isAutoConnectingTracker, setIsAutoConnectingTracker] = useState({
    isAutoConnecting: false,
    counter: 1,
  });
  const isAutoConnecting = useIsAutoConnecting();
  const connectionStatus = useActiveWalletConnectionStatus();

  useEffect(() => {
    setIsAutoConnectingTracker((prev) => {
      if (prev.isAutoConnecting === isAutoConnecting) {
        return prev;
      } else {
        console.log({
          isAutoConnecting,
          counter: prev.counter + 1,
        });
        return {
          isAutoConnecting,
          counter: prev.counter + 1,
        };
      }
    });
  }, [isAutoConnecting]);

  useEffect(() => {
    metaMask.subscribe("disconnect", async () => {
      await post({
        url: window.location.origin + "/api" + "/logout",
      });
      console.log("Metamask disconnected");
    });
    // need to use accounts changed to handle account change
    metaMask.subscribe("accountsChanged", async () => {
      console.log("Metamask accounts changed");
    });

    coinbase.subscribe("accountsChanged", async () => {
      console.log("Coinbase accounts changed");
    });

    /* coinbase.subscribe("disconnect", async () => {
      console.log("Coinbase disconnecting");
      await post({
        url: window.location.origin + "/api/" + "/logout",
      });
      console.log("Coinbase disconnected");
    }); */

    trustWallet.subscribe("disconnect", async () => {
      await post({
        url: window.location.origin + "/api" + "/logout",
      });
      console.log("Trust Wallet disconnected");
    });

    walletConnectInit.subscribe("disconnect", async () => {
      await post({
        url: window.location.origin + "/api" + "/logout",
      });
      console.log("Wallet Connect disconnected");
    });
  }, []);

  // janky solution for coinbase disconnecting causing refresh
  useEffect(() => {
    // defined janky functions
    const loginStatus = async () => {
      let status = await get({
        url: window.location.origin + "/api" + "/isLoggedIn",
      });
      return status;
    };

    const logOutIfDisconnected = async () => {
      await post({
        url: window.location.origin + "/api" + "/logout",
      });
    };

    (async () => {
      const status = await loginStatus();
      if (
        isAutoConnectingTracker.counter === 3 &&
        connectionStatus === "disconnected" &&
        status
      ) {
        logOutIfDisconnected();
      }
    })();
  }, [isAutoConnectingTracker, connectionStatus]);

  return (
    <div className="connect__container bg-black text-white">
      <ConnectButton
        client={client}
        wallets={wallets}
        theme={"dark"}
        connectModal={{ size: "wide" }}
        showAllWallets={false}
        recommendedWallets={[wallets[0]]}
        chain={environment.VITE_ACTIVE_CHAIN === "137" ? polygon : polygonAmoy}
        /* detailsModal={{
          payOptions: {
            buyWithCrypto: false,
            buyWithFiat: false,
          },
        }} */
        // add supported tokens for dapp configs in thirdweb.js - native token is already supported by default ofc
        supportedTokens={supportedTokens}
        onConnect={async (wallet) => {
          console.log("connected");
          const activeAccount = wallet.getAccount();
          let isLoggedIn = await get({
            url: window.location.origin + "/api" + "/isLoggedIn",
          });
          if (activeAccount && polygon) {
            // check if user is logged in via /isLoggedIn endpoint
            if (!isLoggedIn) {
              console.log("Not logged in");
              // get payload to sign
              const messagePayload = await get({
                url: window.location.origin + "/api" + "/login",
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
                url: window.location.origin + "/api" + "/login",
                params: signatureWithPayload,
              });

              // verify user is logged in
              isLoggedIn = await get({
                url: window.location.origin + "/api" + "/isLoggedIn",
              });
              console.log("Now logged in: ", isLoggedIn);
            } else {
              console.log("Logged in");
            }
          }
        }}
        onDisconnect={async () => {
          await post({
            url: window.location.origin + "/api" + "/logout",
          });
        }}
      />
      {connectionStatus === "connected" &&
      isAutoConnectingTracker.counter === 3 ? (
        <>
          <SignData />
          <GetUnits />
          <TransactionTest />
          <BuyCrypto />
        </>
      ) : isAutoConnectingTracker.counter < 3 ? (
        <p style={{ color: "black" }}>Connecting...</p>
      ) : null}
    </div>
  );
}

export default App;
