import { ensureElement } from "../../utils/utils";
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
    this.confirmButton.addEventListener('click', () => {this.events.emit('basket:confirm')});
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
      const emptyBasket = document.createElement('li');

      emptyBasket.textContent = 'В корзине пока пусто...';
      emptyBasket.classList.add('basket__empty');

      this.basketItemsList.appendChild(emptyBasket);
      this.confirmButtonDisabled = true;
    } else {
      this.confirmButtonDisabled = false;

      items.forEach((item, idx) => {
        if (!item.id) {return};
        const cardInBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        const clonedTemplate = cardInBasketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const card = new BasketCard(this.events, clonedTemplate);
        card.render({
          ...item,
          index: idx + 1
        })
        this.basketItemsList.appendChild(card._container);
      })

    }
  }

  render(data?: Partial<IBasket>): HTMLElement {
    if (data?.totalPrice != null) {
      this.price = data.totalPrice;
    }
    if (data?.items !== undefined) {
      this.basketItems = data.items;
    }

    return this.container;
  }
}