import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, isAxiosError } from 'axios';
import { cascadeError } from '../configs/cascade-error';

@Injectable()
export class HttpService {
  async post<T, V>(
    url: string,
    body: V,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> {
    try {
      const { data } = await axios.post(url, body, config);
      return <T>data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data
          ? <T>error.response.data
          : <T>{ codResp: 'E006', resp: 'Internal Server Error' };
      } else {
        throw cascadeError(error, 'post');
      }
    }
  }
}
