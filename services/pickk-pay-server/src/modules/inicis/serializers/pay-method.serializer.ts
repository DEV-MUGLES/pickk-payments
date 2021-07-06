import { PayMethod } from '@pickk/pay';
import { IniapiPaymethod } from 'inicis';

const { Card, Trans, Vbank, Phone } = PayMethod;

/** 현재 상품권, 페이팔, 알리페이, 위쳇페이는 지원하지 않습니다. */
export const toIniapiPayMethod = (payMethod: PayMethod): IniapiPaymethod => {
  return (
    {
      [Card]: IniapiPaymethod.Card,
      [Trans]: IniapiPaymethod.Acct,
      [Vbank]: IniapiPaymethod.Vacct,
      [Phone]: IniapiPaymethod.HPP,
    }[payMethod] || IniapiPaymethod.Card
  );
};
