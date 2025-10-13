import { IBuyer, TByuerFields, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor(protected events: IEvents, buyerInfo: IBuyer = {
    payment: '' as TPayment, 
    email: '',
    phone: '',
    address: ''
  }) {
    this.payment = buyerInfo.payment;
    this.email = buyerInfo.email;
    this.phone = buyerInfo.phone;
    this.address = buyerInfo.address;
  }

  setInfo(field: TByuerFields, value: string | TPayment): void {
    if (field === 'payment' && (value === 'card' || value === 'cash')) {
      this.payment = value;
    } else if (field !== 'payment') {
      this[field] = value as string;
    }
    this.events.emit('buyer:updated', this.getInfo())
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
    this.payment = '' as TPayment;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:updated', this.getInfo())
  }

  validate(): IBuyer {
    const validateResult: IBuyer = {
      payment: '' as TPayment,
      email: '',
      phone: '',
      address: ''
    }
    const errorMessage: string = 'Поле должно быть заполнено';

    if (this.payment !== 'cash' && this.payment !== 'card') {
      validateResult.payment = errorMessage as TPayment;
    }

    if (this.email === '') {
      validateResult.email = errorMessage;
    }

    if (this.phone === '') {
      validateResult.phone = errorMessage;
    }

    if (this.address === '') {
      validateResult.address = errorMessage;
    }

    return validateResult;
  }

}