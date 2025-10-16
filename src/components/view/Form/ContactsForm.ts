import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

interface IContactsForm extends IForm {
  email?: string;
  phone?: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  render(data?: Partial<IContactsForm>): HTMLElement {
    if (data) {
      if (data.email) this.email = data.email;
      if (data.phone) this.phone = data.phone;
      super.render(data);
    }
    return this.container;
  }
}