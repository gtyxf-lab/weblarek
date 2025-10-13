import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IFieldData {
  name: string;
  type: 'radio' | 'button' | 'submit' | 'email' | 'tel' | 'text',
  label: string,
  required?: boolean;
  placeholder?: string,
  value?: string;
}

export interface IForm {
  errors?: string[],
  valid: boolean;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLSpanElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
    this.errorsContainer = ensureElement<HTMLSpanElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        this.events.emit('form:input', {
          field: target.name,
          value: target.value,
        });
      }
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit('form:submit');
    });
  }

  set errors(errors: string[]) {
    this.errorsContainer.textContent = errors.join(', ');
  }

  set valid(valid: boolean) {
    this.submitButton.disabled = !valid;
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      if (data.errors) this.errors = data.errors;
      if (data.valid !== undefined) this.valid = data.valid;
    }
    return this.container;
  }
}