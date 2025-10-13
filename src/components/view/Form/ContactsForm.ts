import { IEvents } from "../../base/Events";
import { Form, IFieldData, IForm } from "./Form";

interface IContactsForm extends IForm {}

export class ContactsForm extends Form<IContactsForm> {
  constructor(events: IEvents, container: HTMLElement) {
    const fieldConfig: IFieldData[] = [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'Введите Email'
      },
      {
        name: 'phone',
        type: 'tel',
        label: 'Телефон',
        required: true,
        placeholder: '+7 ('
      }
    ];

    super(events, container, fieldConfig);
  }

  validate(): { isValid: boolean; errors: Record<string, string>; } {
    const result = super.validate();
    const errors = {...result.errors};
    let isValid = result.isValid;

    if (this.values['email'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.values['email'])) {
      errors['email'] = 'Неверный формат email';
      isValid = false;
    }

    if (this.values['phone'] && !/^\+?\d{10,}$/.test(this.values['phone'])) {
      errors['phone'] = 'Неверный формат телефона';
      isValid = false;
    }

    this.setErrors(errors);
    this.submitButton.disabled = !isValid;
    return { isValid, errors };
  }
}