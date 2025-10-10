import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IBaseCard {
  title: string;
  category: string;
  price: number | null;
  image: string;
}

export abstract class Card<T extends IBaseCard> extends Component<T> {
  protected cardTitle: HTMLHeadingElement;
  protected cardCategory: HTMLSpanElement;
  protected cardPrice: HTMLSpanElement;
  protected cardImage: HTMLImageElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
    this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = String(value);
  }

  set category(value: string) {
    this.cardCategory.textContent = String(value);
  }

  set price(value: number | null) {
    if (typeof value === 'number') {
      this.cardPrice.textContent = `${value} синапсов`;
    } else if (value === null) {
      this.cardPrice.textContent = 'Бесценно';
    }
  }

  set image(src: string) {
    const alt = this.cardTitle.textContent || 'Изображение товара';
    this.setImage(this.cardImage, src, alt);
  }

  render(data?: Partial<T>): HTMLElement {
    if (data?.title) {this.title = data.title;}
    if (data?.category) {this.category = data.category;}
    if (data?.price) {this.price = data.price;}
    if (data?.image) {this.image = data.image;}

    return this.container;
  }
}