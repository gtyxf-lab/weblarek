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

interface IField {
  name: string
  element: HTMLElement;
  required: boolean;
}

export interface IForm {
  fields: IFieldData[],
  values: Record<string, string>,
  errors?: Record<string, string>,
  valid: boolean;
}

export abstract class Form<T extends IForm> extends Component<T> {
  protected fields: IField[];
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLSpanElement;
  protected values: Record<string, string>;

  constructor(protected events: IEvents, container: HTMLElement, fieldConfig: IFieldData[]) {
    super(container)

    this.values = {};
    this.fields = fieldConfig.map(config => {
      const element = this.container.querySelector(`[name="${config.name}"]`) as HTMLElement;
      if (!element) throw new Error(`Поле ${config.name} не найдено в DOM`);
      return {
        name: config.name,
        element,
        required: config.required || false
      };
    })
    this.submitButton = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
    this.errorsContainer = ensureElement<HTMLSpanElement>('.form__errors', this.container);

    this.fields.forEach(field => {
      if (field.element.tagName === 'INPUT' && field.element.getAttribute('type') !== 'submit') {
        field.element.addEventListener('input', () => {
          this.values[field.name] = (field.element as HTMLInputElement).value;
          this.events.emit('form:input', this.getValues());
        })
      }
    })

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:submit', this.getValues());
    })
  }

  setValue(name: string, value: string) {
    const field = this.fields.find(f => f.name === name);
    if (field && field.element.tagName === 'INPUT') {
      (field.element as HTMLInputElement).value = value;
      this.values[name] = value;
    }
  }

  setErrors(errors: Record<string, string>) {
    this.errorsContainer.textContent = Object.values(errors).join(', ') || '';
  }

  getValues(): Record<string, string> {
    return { ...this.values };
  }

  validate(): { isValid: boolean, errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    this.fields.forEach(field => {
      if (field.required && !this.values[field.name]) {
        errors[field.name] = `Поле "${field.name}" обязательно`;
        isValid = false;
      }

      if (field.element.tagName === 'INPUT' && field.element.getAttribute('type') === 'email') {
        const value = this.values[field.name];
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field.name] = 'Неверный формат email';
          isValid = false;
        }
      }

      if (field.element.tagName === 'INPUT' && field.element.getAttribute('type') === 'tel') {
        const value = this.values[field.name];
        if (value && !/^\+?\d{10,}$/.test(value)) {
          errors[field.name] = 'Неверный формат телефона';
          isValid = false;
        }
      }
      
      if (field.element.tagName === 'INPUT' && field.element.getAttribute('type') === 'radio') {
        const radios = this.container.querySelectorAll(`input[name="${field.name}"]:checked`);
        if (field.required && radios.length === 0) {
          errors[field.name] = `Поле "${field.name}" обязательно`;
          isValid = false;
        }
      }
    })

    this.setErrors(errors);
    this.submitButton.disabled = !isValid;
    return {
      isValid,
      errors
    }
  }

  render(data?: Partial<T>): HTMLElement {
    if (data?.fields) {
      this.fields.forEach(field => {
        const config = data.fields?.find(f => f.name === field.name);
        if (config && field.element.tagName === 'INPUT') {
          (field.element as HTMLInputElement).placeholder = config.placeholder || '';
          (field.element as HTMLInputElement).required = config.required || false;
          if (config.value) {
            this.setValue(field.name, config.value)
          }
         }
      })
    }
    
    if (data?.values) {
      Object.entries(data.values).forEach(([name, value]) => {
        this.setValue(name, value);
      })
    }

    if (data?.errors) {
      this.setErrors(data.errors);
    }

    if (data?.valid !== undefined) {
      this.submitButton.disabled = !data.valid;
    }
    this.validate();
    return this.container;
  }
}