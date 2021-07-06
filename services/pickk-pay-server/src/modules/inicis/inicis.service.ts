import { HttpService, Inject, Injectable } from '@nestjs/common';
import { IniapiRefundResult } from 'inicis';

import { IniapiClient } from './clients';
import { InicisCancelDto } from './dtos';
import { InicisCancelFailedException } from './exceptions';

@Injectable()
export class InicisService {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  async cancel(dto: InicisCancelDto) {
    const params = new IniapiClient().getCancelParams(dto);

    const { data: result } = await this.httpService
      .post<IniapiRefundResult>(
        'https://iniapi.inicis.com/api/v1/refund',
        params,
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
}
