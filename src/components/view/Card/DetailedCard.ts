import { ensureElement } from "../../../utils/utils";
import { handleCardClick, IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

interface ICardDetailed extends ICard {
  description: string;
  addButtonText?: string;
}

export class DetailedCard extends Card<ICardDetailed> {
  protected descElement: HTMLParagraphElement;
  protected addButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.descElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.addButton.addEventListener('click', e => handleCardClick(e, this.events, 'card:addToCart'));
  }

  set desc(value: string) {
    this.descElement.textContent = value;
  }

  set addButtonText(value: string) {
    this.addButton.textContent = value;
  }

  render(data?: Partial<ICardDetailed>): HTMLElement {
    super.render(data);
    if (data?.description) {
      this.desc = data.description;
    }
    if (data?.addButtonText) {
      this.addButtonText = data.addButtonText;
    }

    return this.container;
  }
}