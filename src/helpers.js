import { Interface, parseUnits } from "ethers";
import {
  estimateGas,
  getAddress,
  getContract,
  prepareTransaction,
  readContract,
} from "thirdweb";
import { checksumAddress } from "thirdweb/utils";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { v7 as uuidv7 } from "uuid";
import { EIP712Domain, ForwardRequest, events } from "./signature";
import environment from "./environment";
import { client } from "./thirdweb";
import nftABI from "./nftABI.json";

export const getListingData = async () => {
  // function returns a set address for the listing data
  // random tokenId - generate a random number between 1 and 300 that is a whole number
  // random buyNowPrice - generate a random number between 1 and 1000 that is a whole number
  // listed at - get the current date and convert into unix timestamp that is ethereum supported
  // isForSaleUntil - a random date in the future max 30 days into future and convert into unix timestamp that is ethereum supported
  // nonce - use uuid npm package to generate a random nonce
  // return the data as an object using those key names

  const owner = checksumAddress("0x2A6B13F73d04bCe2d5E19de8FD0E2866E5654fc6");
  const tokenID = Math.floor(Math.random() * 300) + 1;
  const buyNowPrice = Math.floor(Math.random() * 1000) + 1;
  const listedAt = Math.floor(Date.now() / 1000);
  // return random data 1 day minimum to 30 days max in future from now
  // Get a random number between 1 and 30 for the number of days in the future
  const daysInFuture = Math.floor(Math.random() * 30) + 1;

  // Get the current date and time
  const now = new Date();

  // Calculate the future date by adding the random number of days
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + daysInFuture);

  // Convert the future date to a timestamp in seconds
  const isForSaleUntil = Math.floor(futureDate.getTime() / 1000);

  const nonce = uuidv7();
  return {
    owner,
    tokenID,
    buyNowPrice,
    listedAt,
    isForSaleUntil,
    floorPrice: 0,
    nonce,
  };
};

export async function get({ url, params, headers }) {
  const response = await fetch(url + "?" + new URLSearchParams(params), {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function post({ url, params, headers }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(params ?? {}, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    ),
    credentials: "include",
  });

  return await response.json();
}

export const getUnits = (num, decimals = 6) => {
  return parseUnits(num.toString(), decimals);
};

export const decodeLogs = (logs) => {
  const interfaceContract = new Interface(nftABI);

  Object.values(events).forEach((event) => {
    logs.forEach((log) => {
      if (event.hash !== log.topics[0]) return;
      const decodedLog = interfaceContract.decodeEventLog(
        event.name,
        log.data,
        log.topics
      );
      console.log(decodedLog.toObject());
    });
  });
};

const mintTransactionData = () => {
  const mintInterface = new Interface(nftABI);
  const mintData = mintInterface.encodeFunctionData("mint", []);
  const transaction = prepareTransaction({
    to: environment.VITE_TOKEN_ADDRESS,
    chain: environment.VITE_ACTIVE_CHAIN === "137" ? polygon : polygonAmoy,
    client: client,
    data: mintData,
  });
  return transaction;
};

const estimateGasCost = async (transaction, signer) => {
  return await estimateGas({ transaction, account: signer });
};

const getAccountForwarderNonce = async (signer) => {
  const forwarderContract = getContract({
    chain: environment.VITE_ACTIVE_CHAIN === "137" ? polygon : polygonAmoy,
    client: client,
    address: environment.VITE_FORWARDER_ADDRESS,
  });
  const getNonce = await readContract({
    contract: forwarderContract,
    method: "function nonces(address) view returns (uint256)",
    params: [signer.address],
  });
  return getNonce;
};

const getMetaTxTypeData = () => {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "DJimenezdev Mint",
      version: "1",
      chainId: environment.VITE_ACTIVE_CHAIN,
      verifyingContract: environment.VITE_FORWARDER_ADDRESS,
    },
    primaryType: "ForwardRequest",
  };
};

const buildRequest = async (signer) => {
  // need to prepareTransaction to pass to estimateGasCost
  const transactionForGasEstimation = mintTransactionData();
  const gasCost = await estimateGasCost(transactionForGasEstimation, signer); // returns bigInt gwei
  // fetch nonce from forwarder
  const nonce = await getAccountForwarderNonce(signer);
  console.log(nonce);
  // deadline of 3 minutes
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 180);
  const mintInterface = new Interface(nftABI);
  const mintData = mintInterface.encodeFunctionData("mint", []);

  const request = {
    from: getAddress(signer.address),
    to: environment.VITE_TOKEN_ADDRESS,
    value: BigInt(0),
    gas: gasCost,
    nonce: nonce,
    deadline: deadline,
    data: mintData,
  };
  return request;
};

const buildTypedData = (request) => {
  const typeData = getMetaTxTypeData();
  return { ...typeData, message: request };
};

export const metaMint = async (signer) => {
  /* 
  * Create a function to be called here that estimates gas cost for a mint. Need 
  to know estimate for signature create a function to be called here 

  * Create a function that puts together the signature request details

  * Create a function to be called here that generates signature that takes passed in 
    thirdweb signer and signature request details

  * Use post function to send request to meta mint and get a receipt in return that will 
    be console logged
  */
  const builtRequest = await buildRequest(signer);
  const builtTypedData = buildTypedData(builtRequest);
  const signature = await signer.signTypedData(builtTypedData);
  const forwarderReq = {
    ...builtRequest,
    signature,
  };

  const response = await fetch(environment.VITE_OZ_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify(forwarderReq),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json()); /* post({
    url: environment.VITE_OZ_WEBHOOK_URL,
    params: forwarderReq,
  }); */
  console.log(response);
};
