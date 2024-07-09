![image](https://github.com/Potestas06/CashFlow/assets/94400853/f0aecaa0-8098-4c57-b178-31d7ee3d3031)

A project for managing your expenses
https://cashflowwep.azurewebsites.net/

# CashFlow

## Project Overview

CashFlow is a web-based application designed to help individuals manage their personal finances efficiently and effectively. By providing tools for tracking and analyzing income and expenses, setting budgets, and visualizing financial data, the application aims to empower users to make informed financial decisions and achieve better financial health.

## Goals and Objectives

### Primary Goal
To create an accessible, user-friendly platform that simplifies the process of personal budget management.

### Objectives
- Develop a secure system for user authentication.
- Provide a comprehensive dashboard that summarizes the user's financial status at a glance.
- Enable easy management and categorization of income and expenses.
- Offer analytical tools to assess financial habits and trends.

## Git Workflow

The project uses Git for version control and follows the GitFlow workflow. Key practices include:
- **Branches**: Development is done on feature branches which are regularly merged into the develop branch.
- **Commits and Pushes**: Regular commits and pushes are made, at least once per lesson.
- **Repository**: The repository is maintained on GitHub.

## Testing Concept

For testing, we use tools suitable for a React project such as Jest and React Testing Library. Key testing practices include:
- **Automated Tests**: Tests are automated to verify the logic, methods, and essential properties of the application.
- **Test Coverage**: A representative number of tests are included to ensure the project is well-tested.
- **Refactoring**: Poorly testable and inconveniently built components are refactored accordingly.

### Testing Scope
The scope of testing will cover the following components:
- **User Authentication**: Ensure secure login and registration processes.
- **Dashboard Functionality**: Verify the accuracy and clarity of financial summaries.
- **Income and Expense Management**: Test adding, editing, categorizing, and deleting income and expenses.
- **Budgeting Tools**: Check the setting, updating, and monitoring of budgets.
- **Analytical Tools**: Validate the correctness and usefulness of financial analysis and trends.

### Test Plan
- **Unit Testing**: Test individual functions and modules for expected outcomes.
- **Integration Testing**: Ensure modules work together seamlessly, particularly user authentication with dashboard data.
- **System Testing**: Conduct end-to-end testing of the complete system to validate overall functionality.
- **User Acceptance Testing (UAT)**: Engage real users to test the application in real-world scenarios to ensure it meets their needs and expectations.

### Test Cases
**User Authentication**
- Test valid and invalid login credentials.
- Test the registration process with various data inputs.
- Test password reset and account recovery functions.

**Dashboard Functionality**
- Verify the display of financial summaries.
- Test the real-time update of data upon income or expense changes.
- Check data accuracy and integrity.

**Income and Expense Management**
- Add new income/expense entries and categorize them correctly.
- Edit and delete existing entries.
- Verify the correct reflection of changes in the dashboard and analysis tools.

**Budgeting Tools**
- Set up new budgets and validate against income and expenses.
- Update and monitor budgets over time.
- Test notifications for budget limits.

**Analytical Tools**
- Generate financial reports and trend analyses.
- Validate the accuracy of analytical data.
- Ensure usability and clarity of the reports generated.

###  Tools and Environment
- **Testing Frameworks**: Jest for unit testing, Selenium for UI testing.
- **Environments**: Local development environment, staging server, and production server for various stages of testing.

###  Reporting
All test results will be documented, including:
- Test case results.
- Bugs and issues discovered, categorized by severity.
- Fixes and re-testing results.

## Clean Code Principles

The submitted code adheres to Clean Code principles, ensuring:
- **Clear Structure**: The code is clearly structured and follows best practice rules for the respective framework.
- **Clean Code Rules**: Common Clean Code rules are observed.
- **Automated Testing**: Components are developed to facilitate automated testing.

## Deployment

The deployment process is automated using GitHub Actions. Key steps include:
- **Docker**: A Docker image is automatically built from the codebase.
- **GitHub Actions**: The CI/CD pipeline is configured using GitHub Actions.
- **Azure**: The Docker image is pushed to Azure and deployed automatically.

## Group Agreements

- **Roles and Responsibilities**: Each team member has specific roles, including Project Owner, Scrum Master, and Developers.
- **Communication**: Regular meetings and clear communication channels are established.
- **Decision Making**: Decisions are made collaboratively with input from all team members.
- **Documentation**: All key decisions and project changes are documented.

## Publication

The app is published on azure


## Reflection

Patrick:
During the project, I completed the Home Page and developed the Login System. I then focused on the Management Page and finalized the Budget management system. These tasks enhanced my skills in frontend development, user authentication, and financial data management. Collaborating with Ian was effective, and we maintained clear communication and mutual support, which facilitated our progress. Preparing the deployment on Azure provided valuable experience with cloud services and CI/CD pipelines. Overall, this project was a significant learning opportunity in both technical and collaborative aspects.

Ian:

During the project, I focused on finding and integrating a data visualization library, working extensively on the graphs and the overview page. This involved researching suitable libraries, implementing graphs, and integrating them into the application. Collaborating with Patrick was smooth, and we maintained clear and regular communication, ensuring effective teamwork. I also contributed to the overall design and functionality of the overview page. The project enhanced my skills in data visualization and frontend development, and the experience was valuable for improving both my technical and collaborative abilities.



## Contributors ❤️
- @Potestas06 (Project Owner)
- @ibuergis
