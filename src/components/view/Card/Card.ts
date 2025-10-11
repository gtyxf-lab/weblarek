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

  constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
    this.cardCategory = this.container.querySelector('.card__category') as HTMLSpanElement | undefined;
    this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
    this.cardImage = this.container.querySelector('card__image') as HTMLImageElement | undefined;
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
    }
  }

  set price(value: number | null) {
    if (value !== null) {
      this.cardPrice.textContent = `${value} синапсов`;
    } else {
      this.cardPrice.textContent = 'Бесценно';
    }
  }

  set image(src: string) {
    if (this.cardImage) {
      const alt = this.cardTitle.textContent || 'Изображение товара';
      this.setImage(this.cardImage, src, alt);
    }
  }

  render(data?: Partial<T>): HTMLElement {
    if (data?.id) {this.id = data.id;}
    if (data?.title) {this.title = data.title;}
    if (data?.category) {this.category = data.category;}
    if (data?.price) {this.price = data.price;}
    if (data?.image) {this.image = data.image;}

    return this.container;
  }
}