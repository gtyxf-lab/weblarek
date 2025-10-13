import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

interface ICardDetailed extends ICard {
  description: string;
  addButtonText?: string;
}

export class DetailedCard extends Card<ICardDetailed> {
  protected descElement: HTMLParagraphElement;
  protected addButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement, categoryMap: Record<string, string>) {
    super(container, categoryMap);

    this.descElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.addButton.addEventListener('click', () => {
      this.events.emit('card:addToCart', { id: this.container.dataset.id });
    });
  }

  set description(value: string) {
    this.descElement.textContent = value;
  }

  set addButtonText(value: string) {
    this.addButton.textContent = value;
  }

  render(data?: Partial<ICardDetailed>): HTMLElement {
    if (data) {
      super.render(data);
      if (data.description) this.description = data.description;
      if (data.addButtonText) this.addButtonText = data.addButtonText;
    }
    return this.container;
  }
}