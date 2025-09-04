// Intelligent STLC artifact generation based on requirement analysis
export function generateArtifacts(requirement) {
  const requirementSummary = requirement?.summary || "System requirement";
  const requirementKey = requirement?.key || "REQ-UNKNOWN";
  const baseId = requirementKey.replace(/[^A-Z0-9]/gi, "");

  // Analyze requirement to understand functionality
  const analysis = analyzeRequirement(requirementSummary);
  
  // Generate comprehensive test cases based on analysis
  let testCases = generateTestCases(baseId, analysis);

  // Ensure at least one test in each category
  const needCategory = (cat) => !testCases.some(tc => tc.category === cat);
  const startCounter = testCases.length + 1;
  let counter = startCounter;
  if (needCategory('unit')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Unit test - Basic validation utility', category: 'unit', steps: ['Invoke utility with sample inputs'], expected: 'Returns expected outputs', type: 'automated' });
  }
  if (needCategory('integration')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Integration test - Service to DB connectivity', category: 'integration', steps: ['Connect and run simple query'], expected: 'Query succeeds with expected result', type: 'automated' });
  }
  if (needCategory('functional')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Functional test - Primary user workflow', category: 'functional', steps: ['Execute main flow'], expected: 'Workflow completes successfully', type: 'automated' });
  }
  if (needCategory('e2e')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'E2E test - Happy path', category: 'e2e', steps: ['Run end-to-end scenario'], expected: 'End-to-end flow passes', type: 'automated' });
  }
  if (needCategory('positive')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Positive - Valid input scenario', category: 'positive', steps: ['Provide valid inputs'], expected: 'Operation succeeds', type: 'automated' });
  }
  if (needCategory('negative')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Negative - Invalid input scenario', category: 'negative', steps: ['Provide invalid inputs'], expected: 'Validation error shown', type: 'automated' });
  }
  if (needCategory('edge-case')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Edge case - Empty required field', category: 'edge-case', steps: ['Leave required field empty'], expected: 'Required field validation triggers', type: 'automated' });
  }
  if (needCategory('security')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Security - XSS payload is sanitized', category: 'security', steps: ['Submit XSS payload'], expected: 'Script not executed, input sanitized', type: 'manual' });
  }
  if (needCategory('performance')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Performance - Page load under 2s', category: 'performance', steps: ['Measure load time'], expected: 'Under threshold', type: 'automated' });
  }
  if (needCategory('smoke')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Smoke - App renders main screen', category: 'smoke', steps: ['Open app'], expected: 'Main UI visible', type: 'automated' });
  }
  if (needCategory('regression')) {
    testCases.push({ id: `${baseId}-TC-${String(counter++).padStart(3,'0')}`, title: 'Regression - Existing core flow still works', category: 'regression', steps: ['Re-run previously passing flow'], expected: 'Still passes', type: 'automated' });
  }
  
  // Generate automation code for automated test cases
  const automationCode = generateAutomationCode(baseId, requirementSummary, testCases, analysis);

  return {
    requirementSummary,
    testCases,
    automationCode,
    analysis, // Include analysis for debugging/transparency
  };
}

function analyzeRequirement(summary) {
  const text = summary.toLowerCase();
  
  const analysis = {
    domain: detectDomain(text),
    functionality: detectFunctionality(text),
    inputFields: detectInputFields(text),
    userActions: detectUserActions(text),
    securityConcerns: detectSecurityConcerns(text),
    performanceConcerns: detectPerformanceConcerns(text),
    integrations: detectIntegrations(text),
    errorScenarios: detectErrorScenarios(text)
  };

  return analysis;
}

function detectDomain(text) {
  if (text.includes('login') || text.includes('authentication') || text.includes('signin')) return 'authentication';
  if (text.includes('payment') || text.includes('checkout') || text.includes('billing')) return 'payment';
  if (text.includes('search') || text.includes('filter') || text.includes('query')) return 'search';
  if (text.includes('upload') || text.includes('file') || text.includes('document')) return 'filehandling';
  if (text.includes('email') || text.includes('notification') || text.includes('message')) return 'messaging';
  if (text.includes('report') || text.includes('dashboard') || text.includes('analytics')) return 'reporting';
  if (text.includes('user') || text.includes('profile') || text.includes('account')) return 'user-management';
  return 'general';
}

function detectFunctionality(text) {
  const functions = [];
  if (text.includes('create') || text.includes('add') || text.includes('register')) functions.push('create');
  if (text.includes('update') || text.includes('edit') || text.includes('modify')) functions.push('update');
  if (text.includes('delete') || text.includes('remove')) functions.push('delete');
  if (text.includes('view') || text.includes('display') || text.includes('show')) functions.push('read');
  if (text.includes('validate') || text.includes('verify')) functions.push('validation');
  if (text.includes('submit') || text.includes('send')) functions.push('submit');
  return functions.length > 0 ? functions : ['general'];
}

function detectInputFields(text) {
  const fields = [];
  if (text.includes('username') || text.includes('user name')) fields.push('username');
  if (text.includes('password') || text.includes('pwd')) fields.push('password');
  if (text.includes('email')) fields.push('email');
  if (text.includes('phone') || text.includes('mobile')) fields.push('phone');
  if (text.includes('name') && !text.includes('username')) fields.push('name');
  if (text.includes('address')) fields.push('address');
  if (text.includes('date')) fields.push('date');
  if (text.includes('amount') || text.includes('price')) fields.push('amount');
  return fields;
}

function detectUserActions(text) {
  const actions = [];
  if (text.includes('click') || text.includes('button')) actions.push('click');
  if (text.includes('type') || text.includes('enter') || text.includes('input')) actions.push('input');
  if (text.includes('select') || text.includes('choose')) actions.push('select');
  if (text.includes('upload')) actions.push('upload');
  if (text.includes('download')) actions.push('download');
  if (text.includes('navigate') || text.includes('redirect')) actions.push('navigate');
  return actions;
}

function detectSecurityConcerns(text) {
  const concerns = [];
  if (text.includes('login') || text.includes('password') || text.includes('auth')) {
    concerns.push('authentication', 'brute-force', 'session-management');
  }
  if (text.includes('input') || text.includes('form')) {
    concerns.push('injection', 'xss', 'input-validation');
  }
  if (text.includes('file') || text.includes('upload')) {
    concerns.push('file-upload-security', 'malicious-files');
  }
  if (text.includes('payment') || text.includes('credit')) {
    concerns.push('pci-compliance', 'data-encryption');
  }
  return concerns;
}

function detectPerformanceConcerns(text) {
  const concerns = [];
  if (text.includes('search') || text.includes('query') || text.includes('filter')) {
    concerns.push('search-performance', 'large-datasets');
  }
  if (text.includes('upload') || text.includes('file')) {
    concerns.push('file-size-limits', 'upload-speed');
  }
  if (text.includes('load') || text.includes('page') || text.includes('response')) {
    concerns.push('page-load-time', 'response-time');
  }
  return concerns;
}

function detectIntegrations(text) {
  const integrations = [];
  if (text.includes('api') || text.includes('service')) integrations.push('external-api');
  if (text.includes('database') || text.includes('db')) integrations.push('database');
  if (text.includes('email') || text.includes('notification')) integrations.push('email-service');
  if (text.includes('payment') || text.includes('gateway')) integrations.push('payment-gateway');
  return integrations;
}

function detectErrorScenarios(text) {
  const scenarios = [];
  if (text.includes('invalid') || text.includes('error')) scenarios.push('invalid-input');
  if (text.includes('empty') || text.includes('blank')) scenarios.push('empty-fields');
  if (text.includes('network') || text.includes('connection')) scenarios.push('network-failure');
  if (text.includes('timeout')) scenarios.push('timeout');
  return scenarios;
}

function generateTestCases(baseId, analysis) {
  const testCases = [];
  let tcCounter = 1;

  // Generate unit test cases
  testCases.push(...generateUnitTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'unit').length;

  // Generate integration test cases
  testCases.push(...generateIntegrationTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'integration').length;

  // Generate functional test cases
  testCases.push(...generateFunctionalTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'functional').length;

  // Generate end-to-end test cases
  testCases.push(...generateEndToEndTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'e2e').length;

  // Generate positive test cases (happy path)
  testCases.push(...generatePositiveTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'positive').length;

  // Generate negative test cases
  testCases.push(...generateNegativeTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'negative').length;

  // Generate edge case test cases
  testCases.push(...generateEdgeCaseTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'edge-case').length;

  // Generate security test cases
  if (analysis.securityConcerns.length > 0) {
    testCases.push(...generateSecurityTestCases(baseId, analysis, tcCounter));
    tcCounter += testCases.filter(tc => tc.category === 'security').length;
  }

  // Generate performance test cases
  if (analysis.performanceConcerns.length > 0) {
    testCases.push(...generatePerformanceTestCases(baseId, analysis, tcCounter));
    tcCounter += testCases.filter(tc => tc.category === 'performance').length;
  }

  // Generate smoke test cases
  testCases.push(...generateSmokeTestCases(baseId, analysis, tcCounter));
  tcCounter += testCases.filter(tc => tc.category === 'smoke').length;

  // Generate regression test cases
  testCases.push(...generateRegressionTestCases(baseId, analysis, tcCounter));

  return testCases;
}

function generatePositiveTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Login with valid credentials",
      category: "positive",
      steps: [
        "Navigate to login page",
        "Enter valid username",
        "Enter valid password",
        "Click login button"
      ],
      expected: "User is successfully logged in and redirected to dashboard/homepage",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('create')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Create new record with valid data",
      category: "positive",
      steps: [
        "Navigate to create form",
        "Fill all required fields with valid data",
        "Submit form"
      ],
      expected: "Record is created successfully and confirmation message is displayed",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('search')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Search with valid criteria",
      category: "positive",
      steps: [
        "Navigate to search page",
        "Enter valid search criteria",
        "Execute search"
      ],
      expected: "Relevant results are displayed matching the search criteria",
      type: "automated"
    });
  }

  return cases;
}

function generateNegativeTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Login with invalid password",
      category: "negative",
      steps: [
        "Navigate to login page",
        "Enter valid username",
        "Enter invalid password",
        "Click login button"
      ],
      expected: "Error message is displayed: 'Invalid credentials' and user remains on login page",
      type: "automated"
    });

    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Login with non-existent username",
      category: "negative",
      steps: [
        "Navigate to login page",
        "Enter non-existent username",
        "Enter any password",
        "Click login button"
      ],
      expected: "Error message is displayed and login is rejected",
      type: "automated"
    });
  }

  // Generate negative cases for input validation
  analysis.inputFields.forEach(field => {
    if (field === 'email') {
      cases.push({
        id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
        title: `Invalid email format validation`,
        category: "negative",
        steps: [
          "Navigate to form",
          `Enter invalid email format in ${field} field`,
          "Submit form"
        ],
        expected: "Validation error message is displayed for email field",
        type: "automated"
      });
    }
  });

  return cases;
}

function generateEdgeCaseTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // Empty field validations
  analysis.inputFields.forEach(field => {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: `Empty ${field} field validation`,
      category: "edge-case",
      steps: [
        "Navigate to form",
        `Leave ${field} field empty`,
        "Fill other required fields",
        "Submit form"
      ],
      expected: `Validation message is displayed for empty ${field} field`,
      type: "automated"
    });
  });

  // Boundary value testing
  if (analysis.inputFields.includes('amount')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Maximum amount boundary test",
      category: "edge-case",
      steps: [
        "Navigate to form",
        "Enter maximum allowed amount",
        "Submit form"
      ],
      expected: "Amount is accepted and processed successfully",
      type: "manual"
    });
  }

  return cases;
}

function generateSecurityTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  if (analysis.securityConcerns.includes('injection')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "SQL injection attempt",
      category: "security",
      steps: [
        "Navigate to input form",
        "Enter SQL injection payload in input fields",
        "Submit form"
      ],
      expected: "Input is sanitized and no SQL injection occurs",
      type: "manual"
    });
  }

  if (analysis.securityConcerns.includes('xss')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "XSS attack prevention",
      category: "security",
      steps: [
        "Navigate to input form",
        "Enter XSS script in input fields",
        "Submit and view output"
      ],
      expected: "Script is sanitized and not executed",
      type: "manual"
    });
  }

  if (analysis.securityConcerns.includes('brute-force')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Brute force login protection",
      category: "security",
      steps: [
        "Attempt multiple failed login attempts",
        "Exceed rate limit threshold"
      ],
      expected: "Account is temporarily locked or CAPTCHA is required",
      type: "manual"
    });
  }

  return cases;
}

function generatePerformanceTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  if (analysis.performanceConcerns.includes('search-performance')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Search performance with large dataset",
      category: "performance",
      steps: [
        "Navigate to search",
        "Perform search on large dataset",
        "Measure response time"
      ],
      expected: "Search completes within acceptable time limits (< 3 seconds)",
      type: "manual"
    });
  }

  if (analysis.performanceConcerns.includes('page-load-time')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Page load performance",
      category: "performance",
      steps: [
        "Navigate to page",
        "Measure page load time"
      ],
      expected: "Page loads within 2 seconds",
      type: "automated"
    });
  }

  return cases;
}

function generateUnitTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // Unit tests for individual methods and functions
  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Unit test - Password validation method",
      category: "unit",
      steps: [
        "Test password validation function with valid password",
        "Test password validation function with invalid password",
        "Test password validation function with empty password"
      ],
      expected: "Password validation method returns correct boolean values",
      type: "automated"
    });

    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Unit test - Username format validation",
      category: "unit",
      steps: [
        "Test username validation with valid format",
        "Test username validation with invalid characters",
        "Test username validation with length limits"
      ],
      expected: "Username validation method handles all input scenarios correctly",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('create')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Unit test - Data validation methods",
      category: "unit",
      steps: [
        "Test individual field validation methods",
        "Test data sanitization functions",
        "Test business rule validation logic"
      ],
      expected: "All validation methods return expected results for various inputs",
      type: "automated"
    });
  }

  return cases;
}

function generateIntegrationTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // Integration tests for component interactions
  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Integration test - Authentication service with database",
      category: "integration",
      steps: [
        "Test authentication service connection to user database",
        "Verify user credential lookup functionality",
        "Test session management integration"
      ],
      expected: "Authentication service successfully integrates with database layer",
      type: "automated"
    });
  }

  if (analysis.integrations.includes('database')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Integration test - Database connectivity and queries",
      category: "integration",
      steps: [
        "Test database connection establishment",
        "Test CRUD operations with database",
        "Test transaction handling"
      ],
      expected: "All database operations execute successfully",
      type: "automated"
    });
  }

  if (analysis.integrations.includes('external-api')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Integration test - External API communication",
      category: "integration",
      steps: [
        "Test API endpoint connectivity",
        "Test request/response handling",
        "Test error handling for API failures"
      ],
      expected: "External API integration works as expected",
      type: "automated"
    });
  }

  return cases;
}

function generateFunctionalTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // Functional tests focusing on business requirements
  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Functional test - User authentication workflow",
      category: "functional",
      steps: [
        "Navigate to login page",
        "Enter valid credentials",
        "Submit login form",
        "Verify successful authentication"
      ],
      expected: "User is authenticated and granted access to the system",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('create')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Functional test - Create new record workflow",
      category: "functional",
      steps: [
        "Navigate to create form",
        "Fill all required fields with valid data",
        "Submit form",
        "Verify record creation"
      ],
      expected: "New record is created successfully and appears in the system",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('search')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Functional test - Search functionality",
      category: "functional",
      steps: [
        "Navigate to search interface",
        "Enter search criteria",
        "Execute search",
        "Verify search results"
      ],
      expected: "Search returns relevant results based on criteria",
      type: "automated"
    });
  }

  return cases;
}

function generateEndToEndTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // End-to-end tests replicating complete user workflows
  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "E2E test - Complete user login and dashboard access",
      category: "e2e",
      steps: [
        "Open application in browser",
        "Navigate to login page",
        "Enter valid user credentials",
        "Click login button",
        "Verify redirect to dashboard",
        "Verify user can access protected features"
      ],
      expected: "Complete user authentication flow works end-to-end",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('create') && analysis.functionality.includes('read')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "E2E test - Create and view record workflow",
      category: "e2e",
      steps: [
        "Login to application",
        "Navigate to create form",
        "Create new record",
        "Navigate to records list",
        "Verify created record appears",
        "Click on record to view details"
      ],
      expected: "Complete create and view workflow functions properly",
      type: "automated"
    });
  }

  if (analysis.domain === 'payment') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "E2E test - Complete payment processing workflow",
      category: "e2e",
      steps: [
        "Add items to cart",
        "Proceed to checkout",
        "Enter payment information",
        "Submit payment",
        "Verify payment confirmation",
        "Check order status"
      ],
      expected: "Complete payment workflow processes successfully",
      type: "automated"
    });
  }

  return cases;
}

function generateSmokeTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // Smoke tests for basic functionality verification
  cases.push({
    id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
    title: "Smoke test - Application loads successfully",
    category: "smoke",
    steps: [
      "Open application URL",
      "Verify page loads without errors",
      "Check basic UI elements are visible"
    ],
    expected: "Application loads and displays main interface",
    type: "automated"
  });

  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Smoke test - Login page accessibility",
      category: "smoke",
      steps: [
        "Navigate to login page",
        "Verify login form is displayed",
        "Check username and password fields are present"
      ],
      expected: "Login page loads with all required elements",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('create')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Smoke test - Create form accessibility",
      category: "smoke",
      steps: [
        "Navigate to create form",
        "Verify form fields are displayed",
        "Check submit button is present"
      ],
      expected: "Create form loads with all required elements",
      type: "automated"
    });
  }

  return cases;
}

function generateRegressionTestCases(baseId, analysis, startCounter) {
  const cases = [];
  let counter = startCounter;

  // Regression tests to ensure existing functionality still works
  if (analysis.domain === 'authentication') {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Regression test - Existing user login functionality",
      category: "regression",
      steps: [
        "Test login with previously working credentials",
        "Verify authentication flow remains unchanged",
        "Check session management still works"
      ],
      expected: "Existing authentication functionality continues to work",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('read')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Regression test - Data retrieval functionality",
      category: "regression",
      steps: [
        "Access existing data records",
        "Verify data display functionality",
        "Check data integrity and formatting"
      ],
      expected: "Data retrieval functionality remains intact",
      type: "automated"
    });
  }

  if (analysis.functionality.includes('update')) {
    cases.push({
      id: `${baseId}-TC-${String(counter++).padStart(3, '0')}`,
      title: "Regression test - Data modification functionality",
      category: "regression",
      steps: [
        "Edit existing record",
        "Save changes",
        "Verify changes are persisted"
      ],
      expected: "Data modification functionality works as before",
      type: "automated"
    });
  }

  return cases;
}

function generateAutomationCode(baseId, summary, testCases, analysis) {
  const automatedCases = testCases.filter(tc => tc.type === 'automated');
  
  if (automatedCases.length === 0) {
    return {
      framework: "Cypress",
      file: `${baseId.toLowerCase()}.spec.js`,
      code: `// No automated test cases generated for: ${summary}`
    };
  }

  const framework = determineFramework(analysis);
  let code = generateFrameworkCode(framework, baseId, summary, automatedCases, analysis);

  return {
    framework,
    file: `${baseId.toLowerCase()}.spec.js`,
    code
  };
}

function determineFramework(analysis) {
  // Choose framework based on analysis
  if (analysis.domain === 'authentication' || analysis.userActions.includes('click')) {
    return 'Cypress';
  }
  if (analysis.performanceConcerns.length > 0) {
    return 'Playwright'; // Better for performance testing
  }
  return 'Cypress'; // Default
}

function generateFrameworkCode(framework, baseId, summary, automatedCases, analysis) {
  if (framework === 'Cypress') {
    return generateCypressCode(baseId, summary, automatedCases, analysis);
  }
  if (framework === 'Playwright') {
    return generatePlaywrightCode(baseId, summary, automatedCases, analysis);
  }
  return `// Framework ${framework} not implemented yet`;
}

function generateCypressCode(baseId, summary, automatedCases, analysis) {
  let code = `// Auto-generated Cypress tests for: ${summary}\n`;
  code += `// Generated test categories: ${[...new Set(automatedCases.map(tc => tc.category))].join(', ')}\n\n`;
  
  // Group tests by category for better organization
  const testsByCategory = automatedCases.reduce((acc, testCase) => {
    if (!acc[testCase.category]) acc[testCase.category] = [];
    acc[testCase.category].push(testCase);
    return acc;
  }, {});

  Object.keys(testsByCategory).forEach(category => {
    const categoryTests = testsByCategory[category];
    code += `describe('${category.toUpperCase()} Tests', () => {\n`;
    
    if (analysis.domain === 'authentication' && category === 'functional') {
      code += `  beforeEach(() => {\n`;
      code += `    cy.visit('/login');\n`;
      code += `  });\n\n`;
    }

    categoryTests.forEach(testCase => {
      code += `  it('${testCase.title}', () => {\n`;
      
      if (testCase.category === 'unit') {
        code += `    // Unit test - Test individual methods/functions\n`;
        code += `    // TODO: Implement unit test logic\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      } else if (testCase.category === 'integration') {
        code += `    // Integration test - Test component interactions\n`;
        code += `    // TODO: Implement integration test logic\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      } else if (testCase.category === 'functional') {
        if (analysis.domain === 'authentication' && testCase.title.includes('Login')) {
          code += `    cy.get('[data-testid="username"]').type('validuser');\n`;
          code += `    cy.get('[data-testid="password"]').type('validpass');\n`;
          code += `    cy.get('[data-testid="login-button"]').click();\n`;
          code += `    cy.url().should('include', '/dashboard');\n`;
          code += `    cy.contains('Welcome').should('be.visible');\n`;
        } else {
          code += `    // TODO: Implement functional test steps\n`;
          testCase.steps.forEach(step => {
            code += `    // ${step}\n`;
          });
        }
      } else if (testCase.category === 'e2e') {
        code += `    // End-to-end test - Complete user workflow\n`;
        code += `    // TODO: Implement E2E test steps\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      } else if (testCase.category === 'positive') {
        if (analysis.domain === 'authentication' && testCase.title.includes('Login')) {
          code += `    cy.get('[data-testid="username"]').type('validuser');\n`;
          code += `    cy.get('[data-testid="password"]').type('validpass');\n`;
          code += `    cy.get('[data-testid="login-button"]').click();\n`;
          code += `    cy.url().should('include', '/dashboard');\n`;
          code += `    cy.contains('Welcome').should('be.visible');\n`;
        } else {
          code += `    // TODO: Implement positive test steps\n`;
          testCase.steps.forEach(step => {
            code += `    // ${step}\n`;
          });
        }
      } else if (testCase.category === 'negative') {
        if (analysis.domain === 'authentication' && testCase.title.includes('Login')) {
          code += `    cy.get('[data-testid="username"]').type('validuser');\n`;
          code += `    cy.get('[data-testid="password"]').type('invalidpass');\n`;
          code += `    cy.get('[data-testid="login-button"]').click();\n`;
          code += `    cy.contains('Invalid credentials').should('be.visible');\n`;
          code += `    cy.url().should('include', '/login');\n`;
        } else {
          code += `    // TODO: Implement negative test steps\n`;
          testCase.steps.forEach(step => {
            code += `    // ${step}\n`;
          });
        }
      } else if (testCase.category === 'edge-case') {
        if (testCase.title.includes('Empty')) {
          const field = testCase.title.split(' ')[1];
          code += `    // Leave ${field} field empty\n`;
          code += `    cy.get('[data-testid="submit"]').click();\n`;
          code += `    cy.contains('required').should('be.visible');\n`;
        } else {
          code += `    // TODO: Implement edge case test steps\n`;
          testCase.steps.forEach(step => {
            code += `    // ${step}\n`;
          });
        }
      } else if (testCase.category === 'security') {
        code += `    // Security test - Test security vulnerabilities\n`;
        code += `    // TODO: Implement security test steps\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      } else if (testCase.category === 'performance') {
        code += `    const start = Date.now();\n`;
        code += `    cy.visit('/page');\n`;
        code += `    cy.get('[data-testid="content"]').should('be.visible').then(() => {\n`;
        code += `      const loadTime = Date.now() - start;\n`;
        code += `      expect(loadTime).to.be.lessThan(2000);\n`;
        code += `    });\n`;
      } else if (testCase.category === 'smoke') {
        code += `    // Smoke test - Basic functionality verification\n`;
        code += `    cy.visit('/');\n`;
        code += `    cy.get('body').should('be.visible');\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      } else if (testCase.category === 'regression') {
        code += `    // Regression test - Ensure existing functionality works\n`;
        code += `    // TODO: Implement regression test steps\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      } else {
        code += `    // TODO: Implement test steps for: ${testCase.title}\n`;
        testCase.steps.forEach(step => {
          code += `    // ${step}\n`;
        });
      }
      
      code += `  });\n\n`;
    });
    
    code += `});\n\n`;
  });

  return code;
}

function generatePlaywrightCode(baseId, summary, automatedCases, analysis) {
  let code = `// Auto-generated Playwright tests for: ${summary}\n`;
  code += `import { test, expect } from '@playwright/test';\n\n`;
  
  automatedCases.forEach(testCase => {
    code += `test('${testCase.title}', async ({ page }) => {\n`;
    code += `  // TODO: Implement test steps for: ${testCase.title}\n`;
    testCase.steps.forEach(step => {
      code += `  // ${step}\n`;
    });
    code += `});\n\n`;
  });

  return code;
}
