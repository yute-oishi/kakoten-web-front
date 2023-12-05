import React from "react";
import { useInView } from "react-intersection-observer";

/**
 * 子コンポーネントをフェードインアニメーション化する
 * @param marginRoot どれだけスクロールされるとフェードインするか
 * @param children フェードイン化するコンポーネント
 */
const FeedIn = ({
  marginRoot = "-100px",
  children,
}: {
  marginRoot?: string;
  children: React.ReactNode;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: marginRoot,
  });

  const animationStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: inView
      ? "opacity 2.1s ease-in-out, transform 1s ease-in-out"
      : "opacity 1.6s ease-in-out, transform 0.5s ease-in-out",
  };

  return (
    <div ref={ref} style={animationStyle}>
      {children}
    </div>
  );
};

export default FeedIn;
