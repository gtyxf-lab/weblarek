import { categoryMap } from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { BasketCard, ICardInBasket } from "./Card/BasketCard";

interface IBasket {
  totalPrice: number;
  items: ICardInBasket[];
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

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set confirmButtonDisabled(disabled: boolean) {
    this.confirmButton.disabled = disabled;
  }

  set basketItems(items: ICardInBasket[]) {
    this.basketItemsList.innerHTML = '';
    if (items.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'В корзине пока пусто...';
      emptyItem.classList.add('basket__empty');
      this.basketItemsList.appendChild(emptyItem);
      this.confirmButtonDisabled = true;
      return;
    }

    this.confirmButtonDisabled = false;
    items.forEach((item, index) => {
      const cardElement = cloneTemplate<HTMLLIElement>('#card-basket');
      const card = new BasketCard(this.events, cardElement, categoryMap);
      card.render({ ...item, index: index + 1 });
      this.basketItemsList.appendChild(cardElement);
    });
  }

  render(data?: Partial<IBasket>): HTMLElement {
    if (data) {
      if (data.totalPrice != null) this.price = data.totalPrice;
      if (data.items) this.basketItems = data.items;
    }
    return this.container;
  }
}