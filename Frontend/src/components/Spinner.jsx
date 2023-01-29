import React from "react";
import RingLoader from "react-spinners/RingLoader";

const Spinnerr = ({ message, message2 }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <RingLoader color="blue" className="m-5" />
      <p className="text-lg text-center px-2">{message}</p>
      {message2 ? <p className="text-lg text-center px-2">{message2}</p> : ""}
    </div>
  );
};

export default Spinnerr;
