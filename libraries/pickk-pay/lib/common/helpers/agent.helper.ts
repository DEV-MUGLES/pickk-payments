let userAgent;
let android, iphone, ipad, mobile;
let nativeApp;
let firefox, opera, chrome, webkit;
let osx, windows, linux;

const getUserAgent = (): boolean => {
  if (userAgent !== undefined) {
    return;
  }

  userAgent = navigator.userAgent;
  let browser =
    /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(
      userAgent
    );
  const os = /(Mac OS X)|(Windows)|(Linux)/.exec(userAgent);

  android = /Android/i.exec(userAgent);
  iphone = /\b(iPhone|iP[ao]d)/.exec(userAgent);
  ipad = /\b(iP[ao]d)/.exec(userAgent);
  mobile = /Mobile/i.exec(userAgent);

  nativeApp = /FBAN\/\w+;/i.exec(userAgent);

  if (browser) {
    firefox = browser[2] ? parseFloat(browser[2]) : NaN;
    opera = browser[3] ? parseFloat(browser[3]) : NaN;
    chrome = (webkit = browser[4] ? parseFloat(browser[4]) : NaN)
      ? (browser = /(?:Chrome\/(\d+\.\d+))/.exec(userAgent)) && browser[1]
        ? parseFloat(browser[1])
        : NaN
      : NaN;
  } else {
    firefox = opera = chrome = webkit = NaN;
  }
  if (os) {
    osx = os[1]
      ? (userAgent = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(userAgent))
        ? parseFloat(userAgent[1].replace('_', '.'))
        : true
      : false;
    windows = !!os[2];
    linux = !!os[3];
  } else {
    osx = windows = linux = false;
  }
};

export const isAndroid = (): boolean => getUserAgent() || android;

export const isIphone = (): boolean => getUserAgent() || iphone;

export const isIpad = (): boolean => getUserAgent() || ipad;

export const isMobile = (): boolean =>
  getUserAgent() || android || iphone || ipad || mobile;

export const isNativeApp = (): boolean => getUserAgent() || nativeApp;

export const isFirefox = (): boolean => getUserAgent() || firefox;

export const isOpera = (): boolean => getUserAgent() || opera;

export const isWebkit = (): boolean => getUserAgent() || webkit;

export const isSafari = isWebkit;

export const isChrome = (): boolean => getUserAgent() || chrome;

export const isWindows = (): boolean => getUserAgent() || windows;

export const isOsx = (): boolean => getUserAgent() || osx;

export const isLinux = (): boolean => getUserAgent() || linux;
