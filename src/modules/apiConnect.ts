import { SetterOrUpdater } from "recoil";
import { codePref } from "./pref";
import { FetchData, Obs, ObsForDataState } from "./types";

/**
 * GETリクエスト送信
 * @param {boolean} autoLogout trueの場合、認証エラー(401 or 403)の場合、自動的にログアウトをする
 */
export const apiGet = async (
  url: string,
  headers: Headers
): Promise<{ statusCode: number; body: any }> => {
  try {
    const response = await fetch(url, {
      mode: "cors",
      method: "GET",
      headers: headers,
      credentials: "include",
    });
    if (response.status !== 200) {
      return { statusCode: response.status, body: "Error Ocurred" };
    }
    const body = (await response.json()) as any;
    return { statusCode: response.status, body: body };
  } catch (error) {
    return { statusCode: 400, body: error };
  }
};

/**
 * ヘッダを設定する
 */
export const getHeaders = (token: string): Headers => {
  const headers = new Headers();
  headers.append("x-api-key", token);
  return headers;
};

/**
 * 全観測地リストを取得し、Recoil状態にセットする。
 */
export const getObsList = async (
  setObsList: SetterOrUpdater<{
    [key: string]: Obs;
  }>
) => {
  const response = await fetch(
    "https://www.jma.go.jp/bosai/amedas/const/amedastable.json",
    {
      mode: "cors",
      method: "GET",
      headers: new Headers(),
    }
  );
  const res = { body: await response.json() };
  if (!("body" in res)) {
    return;
  } else {
    const obs = res.body;
    const keeps: (keyof Obs)[] = ["type", "elems", "kjName"];
    const result: { [key: string]: Obs } = {};
    Object.keys(obs).forEach((key) => {
      if (obs[key] && typeof obs[key] === "object") {
        result[key] = {
          type: "",
          elems: "",
          kjName: "",
          pref: "",
          obsCode: key,
        };
        keeps.forEach((subKey) => {
          if (obs[key][subKey] !== undefined) {
            result[key][subKey] = obs[key][subKey];
          }
          const prefCode = parseInt(key.slice(0, 2));
          if (prefCode < 31) {
            result[key]["pref"] = "北海道";
          } else if (prefCode > 90) {
            result[key]["pref"] = "沖縄";
          } else {
            result[key]["pref"] = codePref[prefCode.toString()];
          }
        });
      }
    });
    setObsList(result);
    localStorage.setItem("obsList", JSON.stringify(result));
  }
};

export const getClimateData = async (query: string) => {
  const res = await apiGet(
    "https://kako-ten.com/prod/past?obsDates=" + query,
    getHeaders("u1DbqLqMcx3OvChTFiT3raFYpomNn1et9hZWnJzm")
  );
  if (res.statusCode === 200 && "body" in res && res.body) {
    const newData: ObsForDataState = {};
    Object.values(res.body as { [key: string]: FetchData }).map(
      (value: FetchData) => {
        const newKey = value.ob + value.dt;
        newData[newKey] = value.data;
      }
    );
    return newData;
  }
};

export const sendEmail = async (
  name: string,
  email: string,
  message: string
) => {
  const url = "https://kako-ten.com/prod/email";
  const data = {
    name: name,
    email: email,
    message: message,
  };
  const headers = new Headers();
  headers.append("x-api-key", "u1DbqLqMcx3OvChTFiT3raFYpomNn1et9hZWnJzm");
  headers.append("Content-Type", "application/json");
  await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: JSON.stringify(data),
  });
};
