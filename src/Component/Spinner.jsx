import React from "react";

function Spinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="w-9 h-9 border-4 border-t-4 border-red-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
