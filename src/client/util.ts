export const centsToUSD = (amount: number) => {
  return (Math.floor(amount) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
