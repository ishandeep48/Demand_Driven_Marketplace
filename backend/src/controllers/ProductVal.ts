// utils/normalizeCart.ts

interface CartItem {
  productID: string;
  quantity: number;
}

export const normalizeCartItems = (items: CartItem[]): CartItem[] => {
  const cartMap = new Map<string, number>();

  for (const item of items) {
    // Validate quantity
    if (!item.quantity || item.quantity <= 0) {
      throw new Error("INVALID_QUANTITY");
    }

    // Merge quantities if product appears multiple times
    cartMap.set(
      item.productID,
      (cartMap.get(item.productID) || 0) + item.quantity
    );
  }

  // Convert Map back into array format
  const normalizedItems: CartItem[] = Array.from(cartMap.entries()).map(
    ([productID, quantity]) => ({
      productID,
      quantity,
    })
  );
  if(!normalizeCartItems){
    throw new Error("The Normalised Cart was Empty. IDK why and how but yeah it was for some reason")
  }
  return normalizedItems;
};
