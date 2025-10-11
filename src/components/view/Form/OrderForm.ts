import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IFieldData, IForm } from "./Form";

interface IOrderForm extends IForm {
  payment?: TPayment;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];

  constructor(events: IEvents, container: HTMLElement) {
    const fieldConfig: IFieldData[] = [
      {
        name: 'address',
        type: 'text',
        label: 'Адрес доставки',
        required: true,
        placeholder: 'Введите адрес'
      },
      {
        name: 'payment',
        type: 'button',
        label: 'Способ оплаты',
        required: true
      }
    ];

    super(events, container, fieldConfig);

    this.paymentButtons = [
      ensureElement<HTMLButtonElement>('button[name="card"]', this.container),
      ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)
    ]

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const value = button.name as TPayment;
        this.payment = value;
        this.events.emit('form:input', this.getValues());
      })
    })

  }

  set payment(value: TPayment) {
    this.values['payment'] = value;
    
    this.paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === value);
    });

    this.validate();
  }

  validate(): { isValid: boolean; errors: Record<string, string> } {
    const result = super.validate();
    const errors = { ...result.errors };
    let isValid = result.isValid;

    if (!this.values['payment']) {
      errors['payment'] = 'Выберите способ оплаты';
      isValid = false;
    }

    this.setErrors(errors);
    this.submitButton.disabled = !isValid;
    return { isValid, errors };
  }

  render(data?: Partial<IOrderForm>): HTMLElement {
    if (data?.payment) {
      this.payment = data.payment;
    }
    return super.render(data);
  }
}