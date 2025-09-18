import { IProduct } from "../../types";

export class Cart {
  protected cartItems: IProduct[];

  constructor(productsInCart: IProduct[] = []) {
    this.cartItems = productsInCart;
  }

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  addProductInCart(newProduct: IProduct): void {
    this.cartItems.push(newProduct);
  }

  removeProductFromCart(removableProductId: string): void {
    this.cartItems = this.cartItems.filter(product => product.id !== removableProductId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getCartItemsPrice(): number {
    let sum: number = 0;

    this.cartItems.forEach(product => {
      if (product.price !== null) {
        sum += product.price;
      }
    })

    return sum;
  }

  getCartItemsCount(): number {
    return this.cartItems.length;
  }

  checkItemInCartById(id: string): boolean {
    return this.cartItems.some(product => product.id === id);
  }
}