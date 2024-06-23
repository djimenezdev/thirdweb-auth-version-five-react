import { useActiveAccount } from "thirdweb/react";
import { get, getListingData, post } from "./helpers";
import { domain, listingType } from "./signature";
// import { signLoginPayload } from "thirdweb/auth";
import { useEffect } from "react";
import environment from "./environment";
import { signLoginPayload } from "thirdweb/auth";

// eslint-disable-next-line react/prop-types
function SignData({ polygon }) {
  const activeAccount = useActiveAccount();
  const sign = async () => {
    const listingData = await getListingData();
    const signatureStructure = {
      domain,
      primaryType: "Listing",
      message: listingData,
      types: listingType,
    };
    const signature = await activeAccount.signTypedData(signatureStructure);
    console.log(signature);
  };

  // in a use effect if wallet is connected
  // call is logged in endpoint to check if user is logged in
  // if user is logged in then were done
  // if user is not logged in then call endpoint to get login payload and then sign the payload

  useEffect(() => {
    (async () => {
      let isLoggedIn = await get({
        url: environment.VITE_API_URL + "/isLoggedIn",
      });
      if (activeAccount && polygon) {
        // check if user is logged in via /isLoggedIn endpoint
        if (!isLoggedIn) {
          console.log("Not logged in");
          // get payload to sign
          const messagePayload = await get({
            url: environment.VITE_API_URL + "/login",
            params: {
              address: activeAccount.address,
              // eslint-disable-next-line react/prop-types
              chainId: polygon.id.toString(),
            },
          });
          // sign payload

          /* const formattedMessage = signatureMessageFormat(messagePayload);

          const signedPayload = await activeAccount.signMessage({
            message: formattedMessage,
          }); */

          const signatureWithPayload = await signLoginPayload({
            payload: messagePayload,
            account: activeAccount,
          });

          // send signed payload to /login endpoint to generate jwt
          await post({
            url: environment.VITE_API_URL + "/login",
            params: signatureWithPayload,
          });

          // verify user is logged in
          isLoggedIn = await get({
            url: environment.VITE_API_URL + "/isLoggedIn",
          });
          console.log("Now logged in: ", isLoggedIn);
        } else {
          console.log("Logged in");
        }
      } else {
        console.log("No active account");
        if (isLoggedIn) {
          await post({
            url: environment.VITE_API_URL + "/logout",
          });
        }
      }
    })();
  }, [activeAccount, polygon]);

  return (
    <>
      {activeAccount && (
        <div className="signData__container" onClick={sign}>
          SignData
        </div>
      )}
    </>
  );
}

export default SignData;
