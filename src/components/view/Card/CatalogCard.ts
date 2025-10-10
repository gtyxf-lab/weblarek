import { handleCardClick, IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

interface ICardCatalog extends ICard {};

export class CatalogCard extends Card<ICardCatalog> {
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.container.addEventListener('click', e => handleCardClick(e, this.events, 'catalog:select'))
  }
}