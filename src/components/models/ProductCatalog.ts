import { IProduct } from "../../types";

export class ProductCatalog {
  protected products: IProduct[];
  protected detailedProduct: IProduct | null;

  constructor(productCatalog: IProduct[] = []) {
    this.products = productCatalog;
    this.detailedProduct = null;
  }

  setProductCatalog(productCatalog: IProduct[]): void {
    this.products = productCatalog;
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
  }

  getDetailedProduct(): IProduct | null {
    if (this.detailedProduct) {
      return this.detailedProduct;
    } else {
      return null;
    }
  }
}