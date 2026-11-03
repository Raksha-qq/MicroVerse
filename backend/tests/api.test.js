/**
 * MICROVERSE Automated Backend Test Suite
 * Milestone 3: Core Backend & Authentication Verification
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  // Extract set-cookie header if present
  const setCookie = response.headers.get('set-cookie');

  return {
    status: response.status,
    ok: response.ok,
    data,
    setCookie,
  };
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

// ==========================================
// Test 1: Health Check Endpoint
// ==========================================
test('Health Check returns ONLINE and PostgreSQL CONNECTED', async () => {
  const res = await request('/health');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.status === 'ONLINE', `Expected status ONLINE, got ${res.data.status}`);
  assert(res.data.database.status === 'CONNECTED', `Expected DB CONNECTED, got ${res.data.database.status}`);
  assert(res.data.database.engine === 'PostgreSQL', `Expected PostgreSQL engine`);
});

// ==========================================
// Test 2: User Registration
// ==========================================
const testUserEmail = `test_engineer_${Date.now()}@microverse.lab`;
const testUserPassword = 'QuantumSecurityPass2026!';
let userToken = null;
let userCookie = null;

test('User registration succeeds with valid credentials', async () => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: {
      email: testUserEmail,
      password: testUserPassword,
      name: 'Dr. Test Engineer',
      username: `tester_${Date.now().toString().slice(-6)}`,
      bio: 'Robotics kinematics researcher',
      role: 'ADMIN', // ESCALATION ATTEMPT (must be ignored)
    },
  });

  assert(res.status === 201, `Expected status 201, got ${res.status}`);
  assert(res.data.success === true, 'Expected success === true');
  assert(res.data.data.token, 'Expected JWT token to be returned');
  assert(res.data.data.user.email === testUserEmail, 'Expected matching email');
  assert(res.data.data.user.role === 'USER', 'ROLE ESCALATION PREVENTION FAILED: User was not assigned USER role');
  assert(!res.data.data.user.passwordHash, 'SECURITY VIOLATION: Password hash was returned in response');
  assert(res.setCookie && res.setCookie.includes('microverse_session='), 'Expected secure HTTP-only cookie to be set');

  userToken = res.data.data.token;
  userCookie = res.setCookie.split(';')[0];
});

// ==========================================
// Test 3: Duplicate Email Registration
// ==========================================
test('Duplicate email registration returns 409 Conflict', async () => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: {
      email: testUserEmail,
      password: 'AnotherPassword123!',
      name: 'Duplicate Engineer',
    },
  });

  assert(res.status === 409, `Expected status 409 Conflict, got ${res.status}`);
  assert(res.data.success === false, 'Expected success === false');
  assert(res.data.error.includes('already exists'), 'Expected error message indicating email exists');
});

// ==========================================
// Test 4: Login with Valid Credentials
// ==========================================
test('Login with valid credentials returns 200 OK and token', async () => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: {
      email: testUserEmail,
      password: testUserPassword,
    },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.success === true, 'Expected success === true');
  assert(res.data.data.token, 'Expected JWT token');
  assert(res.data.data.user.role === 'USER', 'Expected user role');
  assert(!res.data.data.user.passwordHash, 'Password hash must not be exposed');
});

// ==========================================
// Test 5: Login with Invalid Password
// ==========================================
test('Login with invalid credentials returns 401 Unauthorized', async () => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: {
      email: testUserEmail,
      password: 'CompletelyWrongPassword!',
    },
  });

  assert(res.status === 401, `Expected status 401 Unauthorized, got ${res.status}`);
  assert(res.data.success === false, 'Expected success === false');
});

// ==========================================
// Test 6: Protected Endpoint Access
// ==========================================
test('Protected endpoint /auth/me rejects unauthenticated request (401)', async () => {
  const res = await request('/auth/me');
  assert(res.status === 401, `Expected status 401, got ${res.status}`);
  assert(res.data.success === false, 'Expected success === false');
});

test('Protected endpoint /auth/me succeeds with Bearer Token', async () => {
  const res = await request('/auth/me', {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.success === true, 'Expected success === true');
  assert(res.data.data.user.email === testUserEmail, 'Expected matching email');
  assert(!res.data.data.user.passwordHash, 'Password hash must not be returned');
});

test('Protected endpoint /auth/me succeeds with Cookie-Based Session', async () => {
  const res = await request('/auth/me', {
    headers: { Cookie: userCookie },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.success === true, 'Expected success === true');
  assert(res.data.data.user.email === testUserEmail, 'Expected matching email');
});

// ==========================================
// Test 7: Admin Authorization Guard
// ==========================================
test('Admin endpoint rejects regular user with 403 Forbidden', async () => {
  const res = await request('/admin/metrics', {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  assert(res.status === 403, `Expected status 403 Forbidden, got ${res.status}`);
  assert(res.data.success === false, 'Expected success === false');
});

test('Admin endpoint succeeds with Admin credentials', async () => {
  // Login as seeded admin
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@microverse.lab',
      password: 'AdminPass123!',
    },
  });

  assert(loginRes.status === 200, `Admin login failed: ${loginRes.status}`);
  const adminToken = loginRes.data.data.token;

  const res = await request('/admin/metrics', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert(res.status === 200, `Expected status 200 for admin metrics, got ${res.status}`);
  assert(res.data.data.totals, 'Expected totals object');
  assert(res.data.data.totals.controllers > 0, 'Expected positive controllers count');
});

// ==========================================
// Test 8: Controller APIs (Listing, Filtering, Pagination, Search)
// ==========================================
test('Controller listing returns paginated results from PostgreSQL', async () => {
  const res = await request('/controllers?page=1&limit=5');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected data to be an array');
  assert(res.data.data.length === 5, `Expected 5 items, got ${res.data.data.length}`);
  assert(res.data.meta.total >= 14, `Expected total >= 14, got ${res.data.meta.total}`);
  assert(res.data.meta.totalPages >= 3, 'Expected >= 3 pages');
});

test('Controller search returns matched targets', async () => {
  const res = await request('/controllers?search=Cortex-M4');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.length > 0, 'Expected at least 1 Cortex-M4 result');
  assert(res.data.data.some(c => c.name.includes('STM32')), 'Expected STM32 in results');
});

test('Controller filtering by architecture and manufacturer', async () => {
  const res = await request('/controllers?architecture=AVR&manufacturer=Microchip');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.length > 0, 'Expected at least 1 AVR result');
  assert(res.data.data.every(c => c.manufacturer.includes('Microchip')), 'Expected all Microchip');
});

test('Controller filtering by application', async () => {
  const res = await request('/controllers?application=Robotics');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.length > 0, 'Expected at least 1 Robotics application result');
});

test('Controller retrieval by Slug or ID', async () => {
  const res = await request('/controllers/stm32f401ret6');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.name === 'STM32F401RET6', `Expected STM32F401RET6, got ${res.data.data.name}`);
  assert(res.data.data.bitWidth === 32, 'Expected 32-bit width');
});

test('Controller related targets retrieval', async () => {
  const res = await request('/controllers/stm32f401ret6/related');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected array of related controllers');
});

// ==========================================
// Test 9: Lesson APIs
// ==========================================
test('Lesson listing returns curriculum lessons', async () => {
  const res = await request('/lessons');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected array of lessons');
  assert(res.data.data.length >= 16, `Expected >= 16 lessons, got ${res.data.data.length}`);
});

test('Lesson filtering by difficulty level', async () => {
  const res = await request('/lessons?difficulty=BEGINNER');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.length > 0, 'Expected beginner lessons');
  assert(res.data.data.every(l => l.difficulty === 'BEGINNER'), 'Expected all beginner difficulty');
});

test('Lesson retrieval by Slug includes markdown content and chapter info', async () => {
  const res = await request('/lessons/mcu-vs-mpu-fundamentals');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.title.includes('MCU vs MPU'), 'Expected MCU vs MPU lesson');
  assert(res.data.data.chapter, 'Expected chapter relation');
  assert(res.data.data.content.length > 50, 'Expected full lesson content');
});

test('Lesson related lessons retrieval', async () => {
  const res = await request('/lessons/mcu-vs-mpu-fundamentals/related');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected array of related lessons');
});

// ==========================================
// Test 10: Profile Update
// ==========================================
test('Authenticated profile update modifies allowed fields', async () => {
  const res = await request('/auth/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      bio: 'Senior Embedded Firmware Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.user.bio === 'Senior Embedded Firmware Architect', 'Expected updated bio');
});

// ==========================================
// Test 11: Logout clears session
// ==========================================
test('Logout clears session cookie', async () => {
  const res = await request('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.setCookie && res.setCookie.includes('microverse_session=;'), 'Expected cookie clear');
});

// ==========================================
// Milestone 4: Discover & Curriculum Tests
// ==========================================
test('Chapter listing returns all 14 curriculum chapters', async () => {
  const res = await request('/chapters');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected array of chapters');
  assert(res.data.data.length === 14, `Expected 14 chapters, got ${res.data.data.length}`);
});

test('Chapter retrieval by slug returns rich markdown content and lessons', async () => {
  const res = await request('/chapters/what-is-a-microcontroller');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.chapterNumber === 1, 'Expected chapter 1');
  assert(res.data.data.content.includes('## Beginner-Friendly Overview'), 'Expected structured sections');
  assert(Array.isArray(res.data.data.lessons), 'Expected lessons array');
  assert(res.data.data.quiz, 'Expected quiz attached');
});

test('Quiz retrieval by chapterId returns questions without answer leaks', async () => {
  const chRes = await request('/chapters/what-is-a-microcontroller');
  const chapterId = chRes.data.data.id;
  const res = await request(`/quizzes/chapter/${chapterId}`);
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data.questions), 'Expected questions');
  assert(res.data.data.questions.length > 0, 'Expected at least 1 question');
  // Security verification: ensure correct answers are withheld before submission
  assert(res.data.data.questions[0].correctOptionIndex === undefined, 'Security violation: correctOptionIndex leaked in quiz fetch');
});

test('Quiz submission grades assessment and returns pass/fail state', async () => {
  const chRes = await request('/chapters/what-is-a-microcontroller');
  const quizId = chRes.data.data.quiz.id;
  const qRes = await request(`/quizzes/chapter/${chRes.data.data.id}`);
  const firstQuestion = qRes.data.data.questions[0];

  // Submit answer for first question
  const answers = { [firstQuestion.id]: 0 }; // Option 0 is correct
  const res = await request(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { answers },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.totalPoints > 0, 'Expected totalPoints > 0');
  assert(typeof res.data.data.percentage === 'number', 'Expected score percentage');
  assert(typeof res.data.data.passed === 'boolean', 'Expected passed flag');
  assert(Array.isArray(res.data.data.review), 'Expected answer review array');
});

test('Authenticated progress marks chapter completed', async () => {
  const chRes = await request('/chapters/what-is-a-microcontroller');
  const chapterId = chRes.data.data.id;

  const res = await request(`/progress/chapter/${chapterId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });

  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(res.data.data.isCompleted === true, 'Expected isCompleted to be true');
});

// ==========================================
// Runner
// ==========================================
async function runAll() {
  console.log('\n=======================================================');
  console.log('  MICROVERSE BACKEND TEST SUITE (MILESTONES 3 & 4)');
  console.log('=======================================================\n');

  let passed = 0;
  let failed = 0;

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  [PASS] ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ✗ ${name}`);
      console.error(`         ${err.message}\n`);
      failed++;
    }
  }

  console.log('\n-------------------------------------------------------');
  console.log(`  TOTAL: ${tests.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('-------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAll().catch(e => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
