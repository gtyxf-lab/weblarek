import { IBuyer, TByuerFields, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment = 'card';
  protected email: string = '';
  protected phone: string = '';
  protected address: string = '';

  constructor(protected events: IEvents, buyerInfo: Partial<IBuyer> = {}) {
    this.setInfo('payment', buyerInfo.payment || 'card');
    this.setInfo('address', buyerInfo.address || '');
    this.setInfo('email', buyerInfo.email || '');
    this.setInfo('phone', buyerInfo.phone || '');
  }

  setInfo(field: TByuerFields, value: string | TPayment): void {
    if (field === 'payment') {
      this.payment = value as TPayment;
    } else {
      (this as any)[field] = value.toString().trim();
    }
    this.events.emit('buyer:updated', this.getInfo());
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
    this.setInfo('payment', 'card');
    this.setInfo('address', '');
    this.setInfo('email', '');
    this.setInfo('phone', '');
  }

  validateOrder(): { valid: boolean; errors: string[] } {
    const hasPayment = ['card', 'cash'].includes(this.payment);
    const hasAddress = !!this.address;
    const valid = hasPayment && hasAddress;
    return {
      valid,
      errors: valid ? [] : ["Не все поля заполнены"]
    };
  }

  validateContacts(): { 
    valid: boolean; 
    errors: Partial<Record<'email' | 'phone', string>> 
  } {
    const errors: Partial<Record<'email' | 'phone', string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,12}$/;

    if (!this.email) {
      errors.email = 'Поле email должно быть заполнено';
    } else if (!emailRegex.test(this.email)) {
      errors.email = 'Некорректный email';
    }

    if (!this.phone) {
      errors.phone = 'Поле телефон должно быть заполнено';
    } else if (!phoneRegex.test(this.phone)) {
      errors.phone = 'Некорректный телефон';
    }

    const valid = Object.keys(errors).length === 0;
    return { valid, errors };
  }

  validate(): { valid: boolean; errors: string[] } {
    const orderVal = this.validateOrder();
    const contactsVal = this.validateContacts();
    const fullValid = orderVal.valid && contactsVal.valid;
    return {
      valid: fullValid,
      errors: fullValid ? [] : ["Не все поля заполнены"]
    };
  }
}