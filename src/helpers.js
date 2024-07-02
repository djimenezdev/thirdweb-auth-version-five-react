import { Interface } from "ethers";
import { parseUnits } from "ethers";
import { checksumAddress } from "thirdweb/utils";
import { v7 as uuidv7 } from "uuid";
import { events } from "./signature";

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
    body: JSON.stringify(params ?? {}),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export const signatureMessageFormat = (payload) => {
  return `${payload.domain} wants you to sign in with your Ethereum account: ${payload.address}
        
Please ensure that the domain above matches the URL of the current website.

Version: ${payload.version}
Chain ID: ${payload.chain_id}
Nonce: ${payload.nonce}
Issued At: ${payload.issued_at}
Expiration Time: ${payload.expiration_time}
Not Before: ${payload.invalid_before}
  `;
};

export const getUnits = (num, decimals = 6) => {
  return parseUnits(num.toString(), decimals);
};

export const decodeLogs = (abi, logs) => {
  const interfaceContract = new Interface(abi);

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
