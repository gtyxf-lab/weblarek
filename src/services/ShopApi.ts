import { IApi, IProduct } from "../types";

export class ShopApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get(`/product/`);
      return response as IProduct[];
    } catch (error) {
      console.error(`Ошибка при получении товаров: ${error}`)
      throw error;
    }
  }
}