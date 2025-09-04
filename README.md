# ANNA STLC Orchestrator

Minimal Node.js service and UI that automates an STLC workflow from a Jira requirement link and produces artifacts, QMetry payloads, and execution results.

## Setup

1. Prerequisites: Node 18+
2. Install deps:

```
npm install
```

3. Configure environment in `.env`:

```
PORT=3000
JIRA_BASE=https://jira.company.com
JIRA_USER=
JIRA_TOKEN=
QMETRY_BASE=https://qmetry.company.com
QMETRY_API_KEY=
```

Leaving Jira/QMetry values empty enables mock/dry-run mode.

## Run

```
npm run start
```

Open `http://localhost:3000` and paste a Jira URL like `https://jira.company.com/browse/PROJ-123`.

## Requirement Analysis Engine

ANNA uses an intelligent analysis engine to automatically generate comprehensive test cases from your Jira requirements. Understanding how the engine works will help you write better requirements that produce more effective test cases.

### How It Works

The system analyzes your requirement summary text to detect:

#### **Domain Detection**
- **Authentication**: `login`, `authentication`, `signin`
- **Payment**: `payment`, `checkout`, `billing`
- **Search**: `search`, `filter`, `query`
- **File Handling**: `upload`, `file`, `document`
- **Messaging**: `email`, `notification`, `message`
- **Reporting**: `report`, `dashboard`, `analytics`
- **User Management**: `user`, `profile`, `account`

#### **Functionality Detection**
- **Create**: `create`, `add`, `register`
- **Update**: `update`, `edit`, `modify`
- **Delete**: `delete`, `remove`
- **Read**: `view`, `display`, `show`
- **Validation**: `validate`, `verify`
- **Submit**: `submit`, `send`

#### **Input Field Detection**
- **Username**: `username`, `user name`
- **Password**: `password`, `pwd`
- **Email**: `email`
- **Phone**: `phone`, `mobile`
- **Name**: `name` (excluding username)
- **Address**: `address`
- **Date**: `date`
- **Amount**: `amount`, `price`

#### **Security & Performance Concerns**
- **Security**: `login`, `password`, `input`, `form`, `file`, `upload`, `payment`
- **Performance**: `search`, `query`, `filter`, `upload`, `file`, `load`, `page`, `response`

### Writing Better Requirements

To generate more comprehensive test cases, include these keywords in your requirement summaries:

#### **For Authentication Features**
```
"User login with username and password authentication"
```
Generates: Login validation, invalid credentials, brute force protection tests

#### **For CRUD Operations**
```
"Create new user profile with name, email, and phone validation"
```
Generates: Create with valid data, empty field validation, invalid email format tests

#### **For Search Features**
```
"Search functionality with filter and query performance optimization"
```
Generates: Valid search, performance with large datasets, empty search criteria tests

#### **For File Operations**
```
"File upload with document validation and security checks"
```
Generates: Valid upload, file size limits, malicious file detection, upload performance tests

#### **For Payment Features**
```
"Payment processing with credit card validation and PCI compliance"
```
Generates: Valid payment, invalid card formats, security compliance, transaction validation tests

### Generated Test Categories

Based on your requirement analysis, ANNA automatically generates comprehensive test cases following industry best practices from [Atlassian's testing guide](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing):

#### **Core Testing Types**
1. **Unit Tests**: Individual methods and functions testing
2. **Integration Tests**: Component interactions and service integrations
3. **Functional Tests**: Business requirements and workflow validation
4. **End-to-End Tests**: Complete user workflows and scenarios

#### **Quality Assurance Categories**
5. **Positive Test Cases**: Valid scenarios and happy path testing
6. **Negative Test Cases**: Invalid inputs and error handling
7. **Edge Case Test Cases**: Boundary values and empty field validation
8. **Security Test Cases**: Injection attacks, XSS prevention, authentication security
9. **Performance Test Cases**: Load time, response time, and scalability testing

#### **Deployment & Maintenance**
10. **Smoke Tests**: Basic functionality verification after deployment
11. **Regression Tests**: Ensuring existing functionality remains intact

### Test Category Details

#### **Unit Tests**
- Test individual methods and functions
- Validate business logic and data processing
- Ensure proper input/output handling
- Fast execution, high coverage

#### **Integration Tests**
- Test component interactions
- Verify database connectivity
- Test external API communications
- Ensure service integrations work properly

#### **Functional Tests**
- Focus on business requirements
- Test complete workflows
- Validate user scenarios
- Ensure feature functionality

#### **End-to-End Tests**
- Replicate complete user behaviors
- Test full application workflows
- Verify system integration
- Validate user experience

#### **Smoke Tests**
- Basic functionality verification
- Quick execution after deployment
- Ensure major features work
- Identify critical failures early

#### **Regression Tests**
- Ensure existing functionality works
- Prevent feature regression
- Validate system stability
- Maintain quality over time

### Tips for Better Test Generation

- **Be Specific**: Include domain-specific keywords (authentication, payment, search)
- **Mention Input Fields**: Reference specific fields like username, email, amount
- **Include Actions**: Use action words like create, update, validate, submit
- **Consider Security**: Mention security aspects for security test generation
- **Performance Keywords**: Include performance-related terms for load testing

## API

POST `/api/orchestrate`

Body:

```json
{ "requirement_link": "https://jira.company.com/browse/PROJ-123" }
```

Returns JSON with fields:
- `requirement_link`
- `requirement_summary`
- `generated_test_cases`
- `automation_code`
- `qmetry_payloads`
- `execution_results`
