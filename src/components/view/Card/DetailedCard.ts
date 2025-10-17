import { CDN_URL, categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardDetailed extends ICard {
  id: string;
  category: string;
  image: string;
  description: string;
  addButtonText: string;
  addButtonDisabled: boolean;
}

export class DetailedCard extends Card<ICardDetailed> {
  protected id: string;
  protected cardCategory: HTMLSpanElement;
  protected cardImage: HTMLImageElement;
  protected descElement: HTMLParagraphElement;
  protected addButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, categoryMap);
    this.id = '';
    this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.addButton.addEventListener('click', () => {
      events.emit('basket:addCard', { id: this.id });
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

  set description(value: string) {
    this.descElement.textContent = value;
  }

  set addButtonText(value: string) {
    this.addButton.textContent = value;
  }

  set addButtonDisabled(value: boolean) {
    this.addButton.disabled = value;
  }
}