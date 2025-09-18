import { IBuyer, TPayment } from "../../types";

export class Buyer {
  protected payment: TPayment;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor(buyerInfo: IBuyer = {
    payment: 'card', // значение по умолчанию
    email: '',
    phone: '',
    address: ''
  }) {
    this.payment = buyerInfo.payment;
    this.email = buyerInfo.email;
    this.phone = buyerInfo.phone;
    this.address = buyerInfo.address;
  }

  setInfo(info: IBuyer): void {
    this.payment = info.payment;
    this.email = info.email;
    this.phone = info.phone;
    this.address = info.address;
  }

  getInfo(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  clearInfo(): void {
    this.payment = 'card';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): boolean {
    return (this.payment === 'cash' || 'card') && 
            this.email !== '' && 
            this.phone !== '' && 
            this.address !== '';
  }
}