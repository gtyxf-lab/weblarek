import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard {
  id: string;
  title: string;
  category: string;
  price: number | null;
  image: string;
}

export abstract class Card<T extends ICard> extends Component<T> {
  protected cardTitle: HTMLHeadingElement;
  protected cardCategory?: HTMLSpanElement;
  protected cardPrice: HTMLSpanElement;
  protected cardImage?: HTMLImageElement;

  constructor(container: HTMLElement, protected categoryMap: Record<string, string>) {
    super(container);

    this.cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
    this.cardCategory = this.container.querySelector('.card__category') as HTMLSpanElement | undefined;
    this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
    this.cardImage = this.container.querySelector('.card__image') as HTMLImageElement | undefined;
  }

  render(data?: Partial<T>): HTMLElement {
    if (!data) {
      return this.container;
    }

    if (data.id !== undefined) this.container.dataset.id = data.id;
    if (data.title) this.cardTitle.textContent = data.title;

    if (data.category && this.cardCategory) {
      this.cardCategory.textContent = data.category;

      Object.values(this.categoryMap).forEach(cls => {
        this.cardCategory?.classList.remove(cls)
      });
      const modifier = this.categoryMap[data.category];
      if (modifier) this.cardCategory.classList.add(modifier);
    }

    if (data.price !== undefined) {
      this.cardPrice.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
    }

    if (data.image && this.cardImage) {
      this.setImage(this.cardImage, data.image, data.title || 'Изображение товара');
    } 

    return this.container;
  }
}