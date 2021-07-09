import { SetMetadata } from '@nestjs/common';

export const IS_SUPER_SECRET_KEY = 'isSuperSecret';
export const SuperSecret = () => SetMetadata(IS_SUPER_SECRET_KEY, true);
