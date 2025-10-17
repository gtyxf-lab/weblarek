import { TByuerFields } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
  errors?: string[];
  valid: boolean;
  fieldErrors?: Partial<Record<TByuerFields, string>>;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLSpanElement;
  protected formName: string;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('.button[type=submit]', container);
    this.errorsContainer = ensureElement<HTMLSpanElement>('.form__errors', container);
    this.formName = this.container.getAttribute('name') || 'form';

    this.container.setAttribute('novalidate', 'true');

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        let value = target.value;
        if (['address', 'email', 'phone'].includes(target.name)) {
          value = value.trim();
        }
        this.events.emit('form:input', { field: target.name as TByuerFields, value });
      }
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });
  }

  set errors(errors: string[]) {
    this.errorsContainer.textContent = errors.join('. ');
  }

  set valid(valid: boolean) {
    this.submitButton.disabled = !valid;
  }
}