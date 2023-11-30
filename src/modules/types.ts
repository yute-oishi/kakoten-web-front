export interface Obs {
  elems: string;
  type: string;
  kjName: string;
  pref: string;
  obsCode: string;
}

export type Page = "main" | "single" | "multi";

export interface EachHourData {
  time: string;
  [key: string]: number | string;
}

export interface FetchData {
  ob: string;
  dt: string;
  data: any;
}

export interface ObsForDataState {
  [key: string]: {
    "01": {
      [key: string]: number;
    };
    "02": {
      [key: string]: number;
    };
    "03": {
      [key: string]: number;
    };
    "04": {
      [key: string]: number;
    };
    "05": {
      [key: string]: number;
    };
    "06": {
      [key: string]: number;
    };
    "07": {
      [key: string]: number;
    };
    "08": {
      [key: string]: number;
    };
    "09": {
      [key: string]: number;
    };
    "10": {
      [key: string]: number;
    };
    "11": {
      [key: string]: number;
    };
    "12": {
      [key: string]: number;
    };
    "13": {
      [key: string]: number;
    };
    "14": {
      [key: string]: number;
    };
    "15": {
      [key: string]: number;
    };
    "16": {
      [key: string]: number;
    };
    "17": {
      [key: string]: number;
    };
    "18": {
      [key: string]: number;
    };
    "19": {
      [key: string]: number;
    };
    "20": {
      [key: string]: number;
    };
    "21": {
      [key: string]: number;
    };
    "22": {
      [key: string]: number;
    };
    "23": {
      [key: string]: number;
    };
    "24": {
      [key: string]: number;
    };
  };
}

export const getHoursJson = (): EachHourData[] => {
  return [
    { time: "01:00" },
    { time: "02:00" },
    { time: "03:00" },
    { time: "04:00" },
    { time: "05:00" },
    { time: "06:00" },
    { time: "07:00" },
    { time: "08:00" },
    { time: "09:00" },
    { time: "10:00" },
    { time: "11:00" },
    { time: "12:00" },
    { time: "13:00" },
    { time: "14:00" },
    { time: "15:00" },
    { time: "16:00" },
    { time: "17:00" },
    { time: "18:00" },
    { time: "19:00" },
    { time: "20:00" },
    { time: "21:00" },
    { time: "22:00" },
    { time: "23:00" },
    { time: "24:00" },
  ];
};
