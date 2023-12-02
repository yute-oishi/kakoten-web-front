// recoil用のatom定義
import { atom } from "recoil";
import { Page, Obs, ObsForDataState } from "@/modules/types";

export const isSidebarOpenState = atom<boolean>({
  key: "isSideBarOpen",
  default: false,
});

export const obsListState = atom<{ [key: string]: Obs }>({
  key: "obsList",
  default: {},
});

export const pageState = atom<Page>({
  key: "page",
  default: "main",
});

export const historyState = atom<Obs[]>({
  key: "history",
  default: [],
});

export const singlePageState = atom<Obs>({
  key: "single",
  default: {
    type: "",
    elems: "",
    kjName: "",
    pref: "",
    obsCode: "",
  },
});

export const multiPageState = atom<[Obs, Date][]>({
  key: "multi",
  default: [],
});

export const climateDataState = atom<ObsForDataState>({
  key: "climateData",
  default: {},
});
