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

export const getHeaders = (token: string): Headers => {
  const headers = new Headers();
  headers.append("x-api-key", token);
  return headers;
};
