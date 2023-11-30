import React from "react";

const useMedia = (query: string) => {
  const [matches, setMatches] = React.useState(
    window.matchMedia(query).matches
  );

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleResize = () => {
      setMatches(mediaQueryList.matches);
    };

    mediaQueryList.addEventListener("change", handleResize);

    return () => {
      mediaQueryList.removeEventListener("change", handleResize);
    };
  }, [query]);

  return matches;
};

export default useMedia;
