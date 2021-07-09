import { PartialType } from '@nestjs/mapped-types';

import { Payment } from '@payments/entities';

export class UpdatePaymentDto extends PartialType(Payment) {}
