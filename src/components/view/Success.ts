import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected title: HTMLHeadingElement;
  protected desc: HTMLParagraphElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.title = ensureElement<HTMLHeadingElement>('.order-success__title', this.container);
    this.desc = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:confirm');
    })
  }

  set total(value: number) {
    this.desc.textContent = `Списано ${value} синапсов`;
  }
}