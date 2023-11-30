export const elemlist = [
  { jp: "降水量", en: "pc" },
  { jp: "気温", en: "te" },
  { jp: "湿度", en: "hu" },
  { jp: "日照時間", en: "su" },
  { jp: "風速", en: "wi" },
  { jp: "気圧", en: "pr" },
  { jp: "海面気圧", en: "np" },
  { jp: "積雪", en: "sn" },
];

export const elemEnToJp: { [key: string]: string } = {
  pc: "降水量",
  te: "気温",
  hu: "湿度",
  su: "日照時間",
  wi: "風速",
  pr: "気圧",
  np: "海面気圧",
  sn: "積雪",
};

export const getElemType = (elem: string): string => {
  let zeroCount = 0;
  for (let i = 0; i < elem.length; i++) {
    if (elem[i] === "0") {
      zeroCount++;
    }
  }
  // 富士山
  if (elem === "10001011") {
    return "F";
  }
  if (zeroCount > 4) {
    return "E";
  }
  if (zeroCount > 3) {
    return "D";
  }
  if (elem.charAt(elem.length - 2) === "0") {
    return "C";
  }
  if (elem.charAt(elem.length - 1) === "0") {
    return "B";
  }
  return "A";
};
