import { CDN_URL, categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardCatalog extends ICard {
  id: string;
  category: string;
  image: string;
}

export class CatalogCard extends Card<ICardCatalog> {
  protected id: string;
  protected cardCategory: HTMLSpanElement;
  protected cardImage: HTMLImageElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, categoryMap);
    this.id = '';
    this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      events.emit('catalog:select', { id: this.id });
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
}