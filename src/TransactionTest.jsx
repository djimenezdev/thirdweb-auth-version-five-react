import {
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { nftContract } from "./thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { decodeLogs } from "./helpers";
import nftABI from "./nftABI.json";

const TransactionTest = () => {
  const activeAccount = useActiveAccount();
  const [uri, setURI] = useState("");
  const [tokenId, setTokenId] = useState("0");

  const mintNFT = async () => {
    const mintTx = prepareContractCall({
      contract: nftContract,
      method: "function mint() external",
      params: [],
    });
    const receipt = await sendAndConfirmTransaction({
      transaction: mintTx,
      account: activeAccount,
    });
    console.log(receipt);
    decodeLogs(nftABI, receipt.logs);
  };

  const tokenURI = async () => {
    const uri = await readContract({
      contract: nftContract,
      method: "function tokenURI(uint256 id) public returns (string memory)",
      params: [tokenId],
    });
    setURI(uri);
  };

  return (
    <div className="transactionTest">
      <h3>TransactionTest</h3>
      <button onClick={mintNFT}>Mint NFT</button>
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={tokenURI}>Get Token URI</button>
      <p>Token URI: {uri}</p>
    </div>
  );
};
export default TransactionTest;
