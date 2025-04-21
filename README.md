# Feature File Generator

## Overview
A web application that helps you create Cucumber/Gherkin feature files with a user-friendly interface. This tool allows you to easily create and manage feature files with scenarios, backgrounds, scenario outlines, tags, and comments.

## Project Structure
```
feature-generator/
├── client/               # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── FeatureForm.js
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── server/              # Backend
    ├── index.js
    └── package.json
```

## Features
- Create feature files with a visual interface
- Support for multiple scenario types:
  - Regular Scenarios
  - Background
  - Scenario Outline with Examples table
- Tag management for features and scenarios
- Comments support
- Auto-save draft functionality
- Download feature files


## Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- LocalStorage for data persistence

### Backend
- Node.js
- Express
- CORS
- Body-parser

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/poyrazemun/feature-generator.git
cd feature-generator
```

2. Install Frontend dependencies:
```bash
cd client
npm install
```

3. Install Backend dependencies:
```bash
cd ../server
npm install
```

## Running the Application

1. Start the Backend server:
```bash
cd server
node index.js
# Server will start on http://localhost:5000
```

2. Start the Frontend application (in a new terminal):
```bash
cd client
npm start
# Application will open in your browser at http://localhost:3000
```

## Usage

1. Creating a Feature
   - Enter the feature name
   - Add tags and comments (optional) using Advanced Options
   - Add scenarios as needed

2. Adding Scenarios
   - Click "Add New Scenario" button
   - Choose scenario type (Scenario, Background, or Scenario Outline)
   - Add steps using Given, When, Then, And keywords
   - Add tags to scenarios (optional)

3. Working with Scenario Outlines
   - Add Examples table headers and rows
   - Fill in example values

4. Saving and Generating
   - Use "Save as Draft" to save your progress
   - Click "Download Feature File" to generate and download the .feature file

## Sample Feature File Output

```gherkin
@login @regression
# This is a login feature
Feature: User Login

  @background
  Background: Common Steps
    Given user is on the login page

  @smoke
  Scenario: Successful Login
    When user enters valid credentials
    Then user should be logged in

  @outline
  Scenario Outline: Login Validation
    When user enters "<username>" and "<password>"
    Then login "<status>" be successful

    Examples:
      | username | password | status  |
      | admin    | admin123 | should  |
      | guest    | guest123 | should  |
      | invalid  | wrong    | should not |
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.

## Author
- poyrazemun