const { expect } = require("@playwright/test");
const fs = require("fs");
class TaskPage {
  constructor(page) {
    this.page = page;
    this.favoriteButton = page.locator('[type="button"]', {
      hasText: "Favorite",
    });
    this.eyeIcon = page.locator(".icon-eye");
    //this.notificationButton = page
    //.locator("#headlessui-portal-root .min-h-full .relative")
    //.locator('button[type="submit"]')
    //.nth(1);
    this.notificationButton = page.locator('button[type="submit"]').filter({
      hasText: "Enable Notifications",
    });
    this.workLogBUtton = page.locator("#tab-3");
    this.EmployeeName = page.locator(".break-normal");
  }

  async clickOnNotificationButton() {
    if (
      await this.notificationButton
        .isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {
      await this.notificationButton.click();
      console.log("Notification popup handled");
    } else {
      console.log("Notification popup not displayed");
    }
  }

  async getFirstFiveTasks() {
    const userTaskNumber = [64, 66];
    const tasks = [];

    const taskURL =
      process.env.BASE_URL +
      "/project-management/mindinventory/tasks/DEVE/issue?key=DEVE-";

    for (let i = 0; i < userTaskNumber.length; i++) {
      const taskId = userTaskNumber[i];
      const taskLink = taskURL + taskId;

      await this.page.goto(taskLink);
      await this.page.waitForLoadState("networkidle");
      await Promise.all([
        this.page.waitForResponse(
          (response) =>
            response.url().includes("worklog") && response.status() === 200,
        ),
        this.workLogBUtton.click(),
      ]);
      await expect(this.page.locator("#texteditorhtml").first()).toBeVisible();

      const employeeName = await this.EmployeeName.textContent();

      const taskText = this.page.locator("#texteditorhtml");
      const taskTextCount = await taskText.count();

      const descriptions = [];

      const limit = Math.min(5, taskTextCount);

      for (let j = 1; j < limit; j++) {
        const taskDescription = await taskText.nth(j).textContent();
        descriptions.push(taskDescription?.trim() || "");
      }

      tasks.push({
        taskId,
        employeeName: employeeName?.trim() || "",
        descriptions,
      });
    }

    // Print all tasks at the end
    console.log("Tasks Data:");
    console.log(JSON.stringify(tasks, null, 2));
    fs.writeFileSync(
      "./data/test-Data.json",
      JSON.stringify(tasks, null, 2),
      "utf-8",
    );

    return tasks;
  }
  // const userTaskNumber = [64, 66];
  // const tasks = [];
  // const taskURL =
  //   process.env.BASE_URL +
  //   "/project-management/mindinventory/tasks/DEVE/issue?key=DEVE-";
  // for (let i = 0; i < userTaskNumber.length; i++) {
  //   const taskId = userTaskNumber[i];
  //   const taskLink = taskURL + taskId;
  //   this.page.goto(taskLink);
  //   await this.page.waitForLoadState("networkidle");
  //   await this.workLogBUtton.click();
  //   const employeeName = await this.EmployeeName.textContent();
  //   tasks.push({ employeeName: employeeName.trim() });
  //   const taskText = await this.page.locator("#texteditorhtml");
  //   const taskTextCount = await taskText.count();
  //   for (let j = 5; j < taskTextCount; j--) {
  //     const taskdescription = await taskText.nth(j).textContent();
  //     console.log(taskdescription.trim());
  //   }
  // }
  // return tasks;
}

module.exports = { TaskPage };
