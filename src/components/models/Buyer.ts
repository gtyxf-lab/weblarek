import { IBuyer, TByuerFields, TPayment } from "../../types";
import { IEvents } from "../base/Events";

interface IValidationResult {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export class Buyer {
  protected payment: TPayment = '' as TPayment;
  protected email: string = '';
  protected phone: string = '';
  protected address: string = '';

  constructor(protected events: IEvents, buyerInfo: Partial<IBuyer> = {}) {
    this.setInfo('payment', buyerInfo.payment || '' as TPayment);
    this.setInfo('address', buyerInfo.address || '');
    this.setInfo('email', buyerInfo.email || '');
    this.setInfo('phone', buyerInfo.phone || '');
  }

  setInfo(field: TByuerFields, value: string | TPayment): void {
    if (field === 'payment' && (value === 'card' || value === 'cash')) {
      this.payment = value;
      this.events.emit('buyer:updated', { field, buyerData: this.getInfo() });
    } else if (field !== 'payment') {
      this[field] = value as string;
      this.events.emit('buyer:updated', { field, buyerData: this.getInfo() });
    }
  }

  getInfo(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clearInfo(): void {
    this.payment = '' as TPayment;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:updated', { field: null, buyerData: this.getInfo() });
  }

  validate(): IValidationResult {
    const errors: IValidationResult = {};

    if (this.payment !== 'cash' && this.payment !== 'card') {
      errors.payment = 'Выберите тип оплаты';
    }
    if (!this.address.trim()) {
      errors.address = 'Поле адрес не заполнено';
    }
    if (!this.email.trim()) {
      errors.email = 'Поле email не заполнено';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Поле телефон не заполнено';
    }

    return errors;
  }
}