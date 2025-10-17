import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard {
  title: string;
  price: number | null;
}

export abstract class Card<T extends ICard> extends Component<T> {
  protected cardTitle: HTMLHeadingElement;
  protected cardPrice: HTMLSpanElement;

  constructor(container: HTMLElement, protected categoryMap: Record<string, string>) {
    super(container);
    this.cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this.cardPrice.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}