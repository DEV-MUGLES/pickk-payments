<h1>
PICKK-PAY-SDK
  <a href="https://www.npmjs.com/package/@pickk/pay" target="_blank">
      <img src="https://img.shields.io/npm/v/@pickk/pay.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/@pickk/pay" target="_blank">
      <img src="https://img.shields.io/npm/dm/@pickk/pay.svg" alt="NPM Downloads" />
  </a>
</h1>

## Requirements

- [nodejs](https://github.com/nodejs/node) >= 0.12.x
- not support browsers below IE 8

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

## Author

- [Sumin Choi](https://sumini.dev)
