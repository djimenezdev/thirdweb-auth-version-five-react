import {
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { nftContract } from "./thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { decodeLogs, metaMint } from "./helpers";

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
    decodeLogs(receipt.logs);
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
      <div className="transactionTestUI">
        <div className="transactionTestUI__left">
          <h3>Mint NFT ---------------&gt;</h3>
          <div className="tokenIdContainer">
            <label htmlFor="tokenIdInput">Minted Token ID:</label>
            <input
              className="tokenIdInput"
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <p>Token URI: {uri}</p>
          </div>
          <h3>Gasless NFT Mint ---------------&gt;</h3>
        </div>
        <div className="transactionTestUI__right">
          <button className="transactionTestButton tokenMint" onClick={mintNFT}>
            Mint NFT
          </button>
          <button
            className="transactionTestButton tokenIdSubmit"
            onClick={tokenURI}
          >
            Get Token URI
          </button>
          <button
            className="transactionTestButton gaslessMint"
            onClick={() => metaMint(activeAccount)}
          >
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  );
};
export default TransactionTest;
