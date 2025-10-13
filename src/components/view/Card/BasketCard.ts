import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardInBasket extends ICard {
  index?: number;
}

export class BasketCard extends Card<ICardInBasket> {
  protected indexElement: HTMLSpanElement;
  protected deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement, categoryMap: Record<string, string>) {
    super(container, categoryMap);

    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:deleteCard', { id: this.container.dataset.id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  render(data?: Partial<ICardInBasket>): HTMLElement {
    if (data) {
      super.render(data);
      if (data.index !== undefined) this.index = data.index;
    }
    return this.container;
  }
}