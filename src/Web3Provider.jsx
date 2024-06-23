import { ThirdwebProvider } from "thirdweb/react";

// eslint-disable-next-line react/prop-types
const Web3Provider = ({ children }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
export default Web3Provider;
