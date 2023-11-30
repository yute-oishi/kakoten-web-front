export const getYesterday = () => {
  const today = new Date();
  const n = today.getHours() < 6 ? 2 : 1;
  today.setHours(0, 0, 0, 0);
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - n);
  return yesterday;
};

export const getBeforeDay = (date: Date, num: number) => {
  let targetDate = new Date(date);
  targetDate.setDate(targetDate.getDate() - num);
  return targetDate;
};

export const dateToString = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export const addSpaceDate = (input: string): string => {
  const year = input.slice(0, 4);
  const month = input.slice(4, 6);
  const day = input.slice(6);
  return `${year} ${month} ${day}`;
};

export const getObsCode = (input: string): string => {
  return input.slice(0, 5);
};

export const getDate = (input: string): string => {
  return input.slice(5, 13);
};

// date1 + n日 が, date2より前か後かを返す。
// falseの場合は前者が前、trueの場合は全者が後。
export const dateDiff = (date1: Date, date2: Date, n: number): boolean => {
  var newDate1 = new Date(date1);
  newDate1.setDate(newDate1.getDate() + n);
  if (newDate1.getTime() <= date2.getTime()) {
    return false; // 前者が前
  } else {
    return true; // 全者が後
  }
};

export const addDays = (date: Date, n: number) => {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + n);
  return newDate;
};
