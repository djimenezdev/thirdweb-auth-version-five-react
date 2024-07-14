import environment from "./environment";

export const listingType = {
  Listing: [
    { name: "owner", type: "address" },
    { name: "tokenID", type: "uint256" },
    { name: "buyNowPrice", type: "uint256" },
    { name: "listedAt", type: "uint256" },
    { name: "isForSaleUntil", type: "uint256" },
    { name: "floorPrice", type: "uint256" },
    { name: "nonce", type: "string" },
  ],
};

export const domain = {
  name: "SureRT Marketplace",
  version: "1.0",
  chainId: Number(environment.VITE_ACTIVE_CHAIN), // Polygon
  verifyingContract: "0x9d958BB2A3dAfe580b2A74c82AdC08Cf87B422dD",
};

export const events = {
  NFT_MINTED: {
    name: "NftMinted",
    hash: "0xf2b290a76feb54be358b555507421d765609171aefa0646f109a653228ff81b8",
  },
  APPROVAL: {
    name: "Approval",
    hash: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
  },
  APPROVAL_ALL: {
    name: "ApprovalForAll",
    hash: "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31",
  },
  TRANSFER: {
    name: "Transfer",
    hash: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  },
};

export const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

export const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint48" },
  { name: "data", type: "bytes" },
];
