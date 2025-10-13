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

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set category(value: string) {
    if (this.cardCategory) {
      this.cardCategory.textContent = value;
      Object.values(this.categoryMap).forEach(cls => this.cardCategory?.classList.remove(cls));
      const modifier = this.categoryMap[value];
      if (modifier) this.cardCategory.classList.add(modifier);
    }
  }

  set price(value: number | null) {
    this.cardPrice.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }

  set image({ src, alt }: { src: string; alt?: string }) {
    if (this.cardImage) {
      this.setImage(this.cardImage, src, alt);
    }
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      if (data.id) this.id = data.id;
      if (data.title) this.title = data.title;
      if (data.category) this.category = data.category;
      if (data.price !== undefined) this.price = data.price;
      if (data.image) this.image = { src: data.image, alt: data.title };
    }
    return this.container;
  }
}