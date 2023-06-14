import React from "react";

export default function useOutsideClick(callback) {
  const ref: any = React.useRef();

  React.useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) callback();
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [ref, callback]);

  return ref;
}
