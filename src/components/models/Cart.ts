import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  protected cartItems: IProduct[];

  constructor(protected events: IEvents, productsInCart: IProduct[] = []) {
    this.cartItems = productsInCart;
  }

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  addProductInCart(newProduct: IProduct): void {
    this.cartItems.push(newProduct);

    this.events.emit('cart:updated', {
      items: this.cartItems,
      total: this.getCartItemsPrice(),
      count: this.getCartItemsCount()
    })
  }

  removeProductFromCart(removableProductId: string): void {
    this.cartItems = this.cartItems.filter(product => product.id !== removableProductId);

    this.events.emit('cart:updated', {
      items: this.cartItems,
      total: this.getCartItemsPrice(),
      count: this.getCartItemsCount()
    })
  }

  clearCart(): void {
    this.cartItems = [];

    this.events.emit('cart:updated', {
      items: this.cartItems,
      total: this.getCartItemsPrice(),
      count: this.getCartItemsCount()
    })
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