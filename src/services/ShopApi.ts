import { IApi, IApiProductList, IOrderData } from "../types";

export class ShopApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IApiProductList> {
    try {
      const response = await this.api.get(`/product/`);
      return response as IApiProductList;
    } catch (error) {
      console.error(`Ошибка при получении товаров: ${error}`);
      throw error;
    }
  }

  async submitOrder(orderData: IOrderData): Promise<object> {
    try {
      const response = await this.api.post('/order/', orderData);
      return response;
    } catch (error) {
      console.error(`Ошибка при подтверждении заказа: ${error}`);
      throw error;
    }
  }
}