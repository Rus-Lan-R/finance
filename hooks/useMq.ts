import { useEffect, useState } from "react";

const useMq = () => {
  const queries = {
    mobile: "(max-width: 767px)",
    tablet: "(max-width: 1023px)",
    laptop: "(max-width: 1439px)",
    desktop: "(min-width: 1440px)",
  };

  const mediaQueryLists = Object.values(queries).map((q) =>
    window.matchMedia(q)
  );

  const getValue = () => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);

    return Object.keys(queries)[index];
  };

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach((mql) => mql.addListener(handler));
    return () =>
      mediaQueryLists.forEach((mql) => mql.removeListener(handler));
  }, []);

  return value;
};

export default useMq;
