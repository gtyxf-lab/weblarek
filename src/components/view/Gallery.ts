
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.catalogElement = container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.innerHTML = '';
    items.forEach(item => this.catalogElement.appendChild(item));
  }

  render(data?: Partial<IGallery>): HTMLElement {
    if (data && data.catalog) this.catalog = data.catalog;
    return this.container;
  }
}