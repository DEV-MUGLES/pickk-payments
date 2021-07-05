<p align="center">
  <img src="https://pickk.one/images/icons/logo/logo-clear.png" width="320" alt="PICKK Logo" />
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@pickk/pay" target="_blank">
        <img src="https://img.shields.io/npm/v/@pickk/pay.svg" alt="NPM Version" />
    </a>
    <a href="https://github.com/DEV-MUGLES/pickk-pay/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/npm/l/@pickk/pay.svg" alt="Package License" />
    </a>
    <a href="https://github.com/DEV-MUGLES/pickk-pay/actions/workflows/ci.yml">
        <img src="https://github.com/DEV-MUGLES/pickk-pay/workflows/CI/badge.svg" />
    </a>
    <a href="https://www.npmjs.com/package/@pickk/pay" target="_blank">
        <img src="https://img.shields.io/npm/dm/@pickk/pay.svg" alt="NPM Downloads" />
    </a>
    <a href="https://github.com/DEV-MUGLES/pickk-pay" target="_blank">
        <img src="https://img.shields.io/github/stars/DEV-MUGLES/pickk-pay?style=social">
    </a>
</p>

[PICKK](https://pickk.one) 프론트엔드 어플리케이션에서 사용되는 결제 모듈 호출 라이브러리입니다.

KG Inicis를 지원합니다.

## Requirements

- [nodejs](https://github.com/nodejs/node) >= 0.12.x
- [Payment Service](https://github.com/DEV-MUGLES/pickk-pay-service): 결제모듈 호출 및 상호작용을 담당할 웹서버입니다. [레포지토리](https://github.com/DEV-MUGLES/pickk-pay-service)를 참고해 배포해주세요!
- IE 8 이하 버전은 **지원하지 않습니다.**

## Installation

```shell
$ npm install --save @pickk/pay
# or
$ yarn add @pickk/pay
```

## Usage

```tsx
import Pay from '@pickk/pay';

function PayScreen() {
  useEffect(() => {
    Pay.init('YOUR_PAY_SERVICE_URL');
  }, []);

  const handleClick = () => {
    Pay.request(data, callback);
  };

  return <button onClick={handleClick}>Place Order</button>;
}
```

## Features

### Inicis

- [x] init
- [x] request
- [x] process failure
- [x] return

## Author

- [Sumin Choi](https://sumini.dev)

## License

This Package is [MIT licensed](https://github.com/DEV-MUGLES/pickk-payments/blob/master/LICENSE).
