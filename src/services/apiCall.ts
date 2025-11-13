import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";

type RequestWrapperType = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  params?: unknown;
  headers?: AxiosRequestConfig['headers'];

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
      withCredentials:true
    });

    if(data?.status != 200 ){
      console.log("error this is api:- ", url);
      return data
    }

    return data;
  } catch (e) {
    // const error = e as AxiosError;
    // throw error.message || "Something went wrong";
    return e as AxiosResponse;
  }
};

export default requestWrapper;
