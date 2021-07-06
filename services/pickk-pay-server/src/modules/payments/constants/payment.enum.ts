export enum PaymentStatus {
  /** 미결제 */
  Ready = 'ready',
  /** 결제완료 */
  Paid = 'paid',
  /** 전액취소 */
  Cancelled = 'cancelled',
  /** 부분취소 */
  PartialCancelled = 'partial_cancelled',
  /** 결제실패 */
  Failed = 'failed',
}
