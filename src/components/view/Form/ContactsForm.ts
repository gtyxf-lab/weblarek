import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

interface IContactsForm extends IForm {}

export class ContactsForm extends Form<IContactsForm> {
  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
  }
}