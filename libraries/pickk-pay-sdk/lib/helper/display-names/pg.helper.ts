import { Pg } from 'lib/pay.interface';

const { Inicis } = Pg;

const PG_DISPLAY_NAME_MAPPER = {
  [Inicis]: '이니시스',
};

export const getPgDisplayName = (pg: Pg): string => PG_DISPLAY_NAME_MAPPER[pg];
