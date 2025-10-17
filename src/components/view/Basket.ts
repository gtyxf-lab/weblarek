import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  totalPrice: number;
  items: HTMLElement[];
}

export class Basket extends Component<IBasket> {
  protected basketItemsList: HTMLUListElement;
  protected priceElement: HTMLSpanElement;
  protected confirmButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketItemsList = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.basket__price', this.container);
    this.confirmButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.confirmButton.addEventListener('click', () => {
      this.events.emit('basket:confirm');
    });
  }

  set totalPrice(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set confirmButtonDisabled(disabled: boolean) {
    this.confirmButton.disabled = disabled;
  }

  set items(items: HTMLElement[]) {
    console.log('Setting basketItems:', items);
    this.basketItemsList.innerHTML = '';
    if (items.length === 0) {
      const emptyText = document.createElement('p');
      emptyText.textContent = 'Корзина пуста';
      emptyText.style.opacity = '.3';
      this.basketItemsList.appendChild(emptyText);
      this.confirmButtonDisabled = true;
      this.totalPrice = 0;
      return;
    }

    this.confirmButtonDisabled = false;
    items.forEach(item => {
      this.basketItemsList.appendChild(item);
    });
  }
}