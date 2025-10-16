import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IContent {
  data: HTMLElement;
}

export class Modal extends Component<IContent> {
  protected modalContent: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.modalContent = ensureElement('.modal__content', this.container);
    this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
    
    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container) {
        this.events.emit('modal:close');
      }
    });
  }

  set content(content: HTMLElement) {
    this.modalContent.replaceChildren(content);
  }

  set isOpen(value: boolean) {
    this.container.classList.toggle('modal_active', value);
  }

  render(data?: Partial<IContent>): HTMLElement {
    if (data && data.data) {
      this.content = data.data;
    }
    return this.container;
  }
}