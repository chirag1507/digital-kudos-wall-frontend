import { screen, within, ByRoleOptions } from "@testing-library/react";

export abstract class BasePage {
  protected container: HTMLElement;

  constructor(container?: HTMLElement) {
    this.container = container || document.body;
  }

  protected async waitForElement(testId: string, timeout: number = 5000): Promise<HTMLElement> {
    return await screen.findByTestId(testId, {}, { timeout });
  }

  protected getByTestId(testId: string): HTMLElement {
    return within(this.container).getByTestId(testId);
  }

  protected queryByTestId(testId: string): HTMLElement | null {
    return within(this.container).queryByTestId(testId);
  }

  protected getByRole(role: string, options?: ByRoleOptions): HTMLElement {
    return within(this.container).getByRole(role, options);
  }

  protected queryByRole(role: string, options?: ByRoleOptions): HTMLElement | null {
    return within(this.container).queryByRole(role, options);
  }

  protected getByLabelText(text: string | RegExp): HTMLElement {
    return within(this.container).getByLabelText(text);
  }

  protected queryByLabelText(text: string | RegExp): HTMLElement | null {
    return within(this.container).queryByLabelText(text);
  }

  protected getByText(text: string | RegExp): HTMLElement {
    return within(this.container).getByText(text);
  }

  protected queryByText(text: string | RegExp): HTMLElement | null {
    return within(this.container).queryByText(text);
  }
}
