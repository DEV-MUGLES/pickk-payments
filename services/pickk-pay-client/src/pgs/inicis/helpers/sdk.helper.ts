export const INICIS_SDK_SCRIPT_ID = 'inicis-jssdk';

export const isInicisInitialized = (): boolean => {
  return !!document.getElementById(INICIS_SDK_SCRIPT_ID);
};
