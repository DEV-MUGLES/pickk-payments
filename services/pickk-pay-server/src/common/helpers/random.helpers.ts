export const getRandomIntBetween = (min: number, max: number): number => {
  const num = Math.random() * (max - min) + min;
  return Math.round(Math.max(min, Math.min(num, max)));
};

export const shuffleArray = <T = unknown>(arr: T[]): T[] =>
  arr.sort(() => Math.random() - 0.5);

export const getRandomEle = <T = unknown>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const getRandomEnumValue = (input) =>
  getRandomEle(
    Object.values(input).filter((value) => typeof value === 'string')
  );

export const getRandomString = (length = 6): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
