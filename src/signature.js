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
  chainId: 137, // Polygon
  verifyingContract: "0x9d958BB2A3dAfe580b2A74c82AdC08Cf87B422dD",
};
