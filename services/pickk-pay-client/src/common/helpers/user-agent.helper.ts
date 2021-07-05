export { isChrome, isFirefox, isSafari } from '@pickk/pay';

// googlechromes:// firefox://

/** fb:// */
export const isFacebook = () => !!/FBAN/i.exec(navigator.userAgent);

/** naversearchapp:// */
export const isNaver = () => !!/NAVER/i.exec(navigator.userAgent);

/** instagram:// */
export const isInstagram = () => !!/Instagram/i.exec(navigator.userAgent);

/** kakaotalk:// */
export const isKakaotalk = () => !!/KAKAOTALK/i.exec(navigator.userAgent);

/** daumapps://open */
export const isDaum = () => !!/DaumApps/i.exec(navigator.userAgent);
