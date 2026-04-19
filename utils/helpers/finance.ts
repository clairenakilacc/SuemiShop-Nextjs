export function computeItemFinance(item: any) {
  const selling_price = Number(item.selling_price ?? 0);
  const discount = Number(item.discount ?? 0);
  const shopee_commission = Number(item.shopee_commission ?? 0);

  const final_price = Math.max(selling_price - discount, 0);

  const order_income = final_price - shopee_commission;

  const commission_rate =
    final_price > 0 ? (shopee_commission / final_price) * 100 : 0;

  return {
    final_price,
    shopee_commission,
    commission_rate,
    order_income,
  };
}
