import { LessThan } from 'typeorm';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  startId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  get idFilter() {
    if (!this.startId) {
      return {};
    }
    return { id: LessThan(this.startId) };
  }

  get pageFilter() {
    if (this.offset === undefined) {
      return {};
    }
    return {
      skip: this.offset,
      take: this.limit || 20,
    };
  }
}
