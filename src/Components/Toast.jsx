import React from "react";

const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 bg-black/80 text-white px-3 md:px-4 py-2 rounded shadow z-50 text-sm md:text-base">
      {toast}
    </div>
  );
};

export default Toast;
