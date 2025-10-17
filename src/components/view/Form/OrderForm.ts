import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

interface IOrderForm extends IForm {
  payment?: TPayment;
  address?: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtons = [
      ensureElement<HTMLButtonElement>('button[name="card"]', this.container),
      ensureElement<HTMLButtonElement>('button[name="cash"]', this.container),
    ];
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('order:paymentChange', { payment: button.name as TPayment });
      });
    });
  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}