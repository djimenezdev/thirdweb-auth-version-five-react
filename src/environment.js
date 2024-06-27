export default {
  VITE_THIRDWEB_CLIENT_KEY: import.meta.env.VITE_THIRDWEB_CLIENT_KEY || "",
  VITE_WALLET_CONNECT_ID: import.meta.env.VITE_WALLET_CONNECT_ID || "",
  VITE_API_URL: import.meta.env.VITE_API_URL || "",
  VITE_ACTIVE_CHAIN: import.meta.env.VITE_ACTIVE_CHAIN || "80002",
  VITE_TOKEN_ADDRESS:
    import.meta.env.VITE_TOKEN_ADDRESS ||
    "0x8991b1afd32c2A47018011a14f915B2e0D0e0549",
};
