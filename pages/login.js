const { expect } = require("@playwright/test");
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator("input[type='email']");
    this.passwordField = page.locator("input[type='password']");
    this.signInBUtton = page.getByRole("button", { name: "Sign In" });
  }

  async redirectToLoginPage() {
    await this.page.goto(process.env.BASE_URL + "/sign-in");
  }

  async loginToApplication(email, password) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.page.waitForTimeout(1000);
    await this.signInBUtton.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForURL(
      process.env.BASE_URL + "/people/mindinventory/dashboard",
    );
  }
}
module.exports = { LoginPage };
