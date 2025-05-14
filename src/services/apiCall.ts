import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";

type RequestWrapperType = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  params?: unknown;
  headers?: AxiosRequestHeaders;
};

const requestWrapper = async <TResponse>({
  url,
  method,
  headers,
  ...rest
}: RequestWrapperType): Promise<AxiosResponse<any, any>> => {
  try {
    const data = await axios({
      method: method,
      url: url,
      ...rest,
      headers: {
        ...headers,
      },
    });
    return data;
  } catch (e) {
    const error = e as AxiosError;
    throw error.message || "Something went wrong";
  }
};

export default requestWrapper;
