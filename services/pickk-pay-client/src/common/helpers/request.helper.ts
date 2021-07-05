import axios from 'axios';

export const getClientIp = async () =>
  (await axios(`${process.env.NEXT_PUBLIC_URL}/api/ip`)).data;
