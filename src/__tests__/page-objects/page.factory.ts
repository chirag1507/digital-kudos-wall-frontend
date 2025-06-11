import { RegistrationFormPage } from "./registration-form.page";

export class PageFactory {
  static createRegistrationFormPage(container?: HTMLElement): RegistrationFormPage {
    return new RegistrationFormPage(container);
  }
}
