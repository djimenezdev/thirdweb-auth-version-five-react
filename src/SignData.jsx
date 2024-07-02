import { useActiveAccount } from "thirdweb/react";
import { getListingData } from "./helpers";
import { domain, listingType } from "./signature";
// import { signLoginPayload } from "thirdweb/auth";

// eslint-disable-next-line react/prop-types
function SignData() {
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
