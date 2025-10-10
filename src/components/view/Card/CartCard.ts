import { ensureElement } from "../../../utils/utils";
import { handleCardClick, IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

interface ICardInCart extends ICard {
  index?: number;
}

export class CartCard extends Card<ICardInCart> {
  protected indexElement: HTMLSpanElement;
  protected deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    this.deleteButton.addEventListener('click', e => handleCardClick(e, this.events, 'cart:deleteCard'));
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }

  render(data?: Partial<ICardInCart>): HTMLElement {
    super.render(data);
    if (data?.index !== undefined) {
      this.index = data.index;
    }

    return this.container;
  }
}