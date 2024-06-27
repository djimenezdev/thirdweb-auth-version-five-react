import { useState } from "react";
import { getUnits } from "./helpers";

const GetUnits = () => {
  const [num, setNum] = useState("0");

  const formatUnits = (number) => {
    const decimalIndex = num.indexOf(".");

    if (decimalIndex > -1) {
      const decimalSplit = num.split(".");
      if (decimalSplit[1].length > 6) {
        number = decimalSplit[0] + "." + decimalSplit[1].slice(0, 6);
      }
    }

    const units = getUnits(number, 6);
    return units.toString();
  };

  return (
    <div className="units">
      <input type="text" value={num} onChange={(e) => setNum(e.target.value)} />
      <p>Units: {Number(num) ? formatUnits(num) : "NaN"}</p>
    </div>
  );
};
export default GetUnits;
