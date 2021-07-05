# PICKK Pay Service

> Next.js, Typescript

결제 모듈들을 호출하고 상호작용하기 위한 클라이언트와 람다로 이루어져있습니다.

[@pickk/pay](https://github.com/DEV-MUGLES/pickk-pay) 라이브러리를 통해 사용하시면 됩니다.

**주의** IE 8 이하 버전은 지원하지 않습니다.

## Getting Started

install dependencies, Run the development server

```shell
npm install
npm run dev
```

make .env file in root, set your value

```
NEXT_PUBLIC_INICIS_SIGNKEY="YOUR_INICIS_SIGNKEY"
NEXT_PUBLIC_INICIS_MID="YOUR_INICIS_MID"
```

## Deploy with Vercel

**NOTE:** Make sure to set `Environment Variables` in Vercel Project Settings to prevent build errors

[![Deploy with Vercel](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/DEV-MUGLES/pickk-pay-service)

## Implemented Features

### Global

- [x] Close Page
- [x] Fail Page

### Inicis

- [x] Ready Page (stdpay)
- [ ] Ready Page (mobpay)
- [x] Init Lambda
- [x] Return Page
- [x] NetCancel Lambda (stdpay)
- [ ] NetCancel Lambda (mobpay)

## Links

- [KG Inicis manual](https://manual.inicis.com/)
