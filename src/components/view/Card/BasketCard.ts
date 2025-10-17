import { CDN_URL, categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardInBasket extends ICard {
  id: string;
  category: string;
  image: string;
  index?: number;
}

export class BasketCard extends Card<ICardInBasket> {
  protected id: string;
  protected cardCategory: HTMLSpanElement;
  protected cardImage: HTMLImageElement;
  protected indexElement: HTMLSpanElement;
  protected deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, categoryMap);
    this.id = '';
    this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      events.emit('basket:deleteCard', { id: this.id });
    });
  }

  setId(value: string) {
    this.id = value;
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    Object.values(this.categoryMap).forEach(cls => this.cardCategory.classList.remove(cls));
    const modifier = this.categoryMap[value];
    if (modifier) this.cardCategory.classList.add(modifier);
  }

  set image(src: string) {
    this.setImage(this.cardImage, `${CDN_URL}${src.slice(0, -3) + 'png'}`, this.cardTitle.textContent || 'Изображение товара');
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}