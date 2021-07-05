export {};

declare global {
  interface Window {
    INIStdPay: {
      pay: (formId: string) => void;
    };
  }
}
