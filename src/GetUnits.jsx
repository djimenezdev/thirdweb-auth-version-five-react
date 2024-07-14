import { useState } from "react";
import { getUnits } from "./helpers";

const GetUnits = () => {
  const [num, setNum] = useState("0");
  const decimals = 6;

  const formatUnits = (number) => {
    const decimalIndex = num.indexOf(".");

    if (decimalIndex > -1) {
      const decimalSplit = num.split(".");
      if (decimalSplit[1].length > decimals) {
        number = decimalSplit[0] + "." + decimalSplit[1].slice(0, decimals);
      }
    }

    const units = getUnits(number, decimals);
    return units.toString();
  };

  return (
    <div className="units">
      <input type="text" value={num} onChange={(e) => setNum(e.target.value)} />
      <p className="units__value scroll-x-hidden">
        Units: {Number(num) ? formatUnits(num) : 0}
      </p>
      <p>Decimals: {decimals}</p>
    </div>
  );
};
export default GetUnits;
