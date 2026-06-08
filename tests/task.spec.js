const { TaskPage } = require("./../pages/task");
const { LoginPage } = require("./../pages/login");
const { test, expect } = require("@playwright/test");
const { correctWeeklyHighlights } = require("../helpers/chatGptHelper");
const { sendWeeklyHighlightsEmail } = require("../helpers/sendEmailHelper");
test.describe("Task Page Tests", () => {
  let taskPage;
  let loginPage;
  test.beforeEach(async ({ page }) => {
    taskPage = new TaskPage(page);
    loginPage = new LoginPage(page);
    await loginPage.redirectToLoginPage();
    await loginPage.loginToApplication(
      process.env.LOGIN_EMAIL,
      process.env.LOGIN_PASSWORD,
    );
  });
  test("Verify that user can click on Favorite button", async ({ page }) => {
    await taskPage.clickOnNotificationButton();
    await taskPage.getFirstFiveTasks();
  });
});
test("Send Weekly Highlights Email", async () => {
  await sendWeeklyHighlightsEmail();
});
