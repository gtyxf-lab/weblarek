import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  protected products: IProduct[];
  protected detailedProduct: IProduct | null;

  constructor(protected events: IEvents, productCatalog: IProduct[] = []) {
    this.products = productCatalog;
    this.detailedProduct = null;
  }

  setProductCatalog(productCatalog: IProduct[]): void {
    this.products = productCatalog;

    this.events.emit('catalog:updated', { products: this.products });
  }

  getProductCatalog(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const foundProduct = this.products.find(product => product.id === id);

    if (foundProduct) {
      return foundProduct;
    } else {
      return undefined;
    }
  }

  setDetailedProduct(detailedProduct: IProduct): void {
    this.detailedProduct = detailedProduct;

    this.events.emit('catalog:detailedUpdated', { detailedProduct: this.detailedProduct })
  }

  getDetailedProduct(): IProduct | null {
    if (this.detailedProduct) {
      return this.detailedProduct;
    } else {
      return null;
    }
  }
}