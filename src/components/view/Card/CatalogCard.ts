import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

interface ICardCatalog extends ICard {};

export class CatalogCard extends Card<ICardCatalog> {
  constructor(protected events: IEvents, container: HTMLElement, categoryMap: Record<string, string>) {
    super(container, categoryMap);

    this.container.addEventListener('click', () => {
      this.events.emit('catalog:select', { id: this.container.dataset.id });
    });
  }
}