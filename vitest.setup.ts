import { useEffect } from "react";
import { useRecoilValue } from "recoil";

// For FeedIn library in Description.tsx
class CustomIntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [];
  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return [];
  }

  unobserve() {
    return null;
  }
}
window.IntersectionObserver = CustomIntersectionObserver;
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Recoil Mockのため
export const RecoilObserver = ({ node, onChange }: any) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
