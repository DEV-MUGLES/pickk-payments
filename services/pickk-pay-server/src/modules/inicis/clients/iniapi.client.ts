import {
  IniapiRefundRequestParams,
  IniapiPartialRefundRequestParams,
  IniapiVacctRefundRequestParams,
} from 'inicis';

import { InicisCancelDto } from '@inicis/dtos/inicis-cancel.dto';

export class IniapiClient {
  public getCancelParams(
    cancelDto: InicisCancelDto,
  ):
    | IniapiRefundRequestParams
    | IniapiPartialRefundRequestParams
    | IniapiVacctRefundRequestParams {
    return null;
  }
}
