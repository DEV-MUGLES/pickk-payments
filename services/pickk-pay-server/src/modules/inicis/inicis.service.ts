import {
  HttpService,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IniapiGetTransactionResult, IniapiRefundResult } from 'inicis';
import * as qs from 'querystring';

import { IniapiClient } from './clients';
import { InicisCancelDto } from './dtos';
import {
  InicisCancelFailedException,
  InicisGetTransactionFailedException,
} from './exceptions';

@Injectable()
export class InicisService {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  async cancel(dto: InicisCancelDto) {
    const params = new IniapiClient().getCancelParams(dto);

    const { data: result } = await this.httpService
      .post<IniapiRefundResult>(
        'https://iniapi.inicis.com/api/v1/refund',
        qs.stringify(params),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            charset: 'utf-8',
          },
        },
      )
      .toPromise();

    const { resultCode, resultMsg } = result;
    if (resultCode !== '00') {
      throw new InicisCancelFailedException(resultMsg);
    }
  }

  async getTransaction(
    tid: string,
    oid: string,
  ): Promise<IniapiGetTransactionResult> {
    const params = new IniapiClient().getGetTransactionParams(tid, oid);

    const { data: result } = await this.httpService
      .post<IniapiGetTransactionResult>(
        'https://iniapi.inicis.com/api/v1/extra',
        qs.stringify(params),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            charset: 'utf-8',
          },
        },
      )
      .toPromise();

    const { resultCode, resultMsg, status } = result;
    if (resultCode !== '00') {
      throw new InicisGetTransactionFailedException(resultMsg);
    }
    if (status === '9') {
      throw new NotFoundException('KG이니시스: 거래를 찾을 수 없습니다.');
    }

    return result;
  }
}
