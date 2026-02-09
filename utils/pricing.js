const roundToTwo = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const getDiscountedPrice = (product = {}) => {
  const original = Number(product.price) || 0;
  const discountValue = Number(product.discount) || 0;
  const discountType = product.discountType === "percentage" ? "percentage" : "fixed";

  if (!discountValue || original <= 0) {
    return {
      originalPrice: roundToTwo(original),
      finalPrice: roundToTwo(original),
      discountAmount: 0,
    };
  }

  let finalPrice = original;
  if (discountType === "percentage") {
    finalPrice = original * (1 - discountValue / 100);
  } else {
    finalPrice = original - discountValue;
  }

  finalPrice = Math.max(0, finalPrice);
  const discountAmount = Math.max(original - finalPrice, 0);

  return {
    originalPrice: roundToTwo(original),
    finalPrice: roundToTwo(finalPrice),
    discountAmount: roundToTwo(discountAmount),
  };
};

module.exports = { getDiscountedPrice, roundToTwo };
