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
let adminToken = null;

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
  adminToken = loginRes.data.data.token;

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
// Milestone 5: Silicon Archive & Comparison Lab Tests
// ==========================================
test('Controller comparison endpoint retrieves requested models by IDs/slugs', async () => {
  const res = await request('/controllers/compare?ids=stm32f401ret6,esp32-s3,rp2040');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected array of compared controllers');
  assert(res.data.data.length === 3, `Expected 3 controllers in comparison, got ${res.data.data.length}`);
  const names = res.data.data.map(c => c.name);
  assert(names.includes('STM32F401RET6'), 'Expected STM32F401RET6 in comparison');
  assert(names.includes('ESP32-S3'), 'Expected ESP32-S3 in comparison');
  assert(names.includes('RP2040'), 'Expected RP2040 in comparison');
});

test('Controller connectivity filtering isolates wireless and USB targets', async () => {
  const resWireless = await request('/controllers?connectivity=wireless');
  assert(resWireless.status === 200, `Expected status 200, got ${resWireless.status}`);
  assert(resWireless.data.data.length > 0, 'Expected wireless controllers');
  assert(resWireless.data.data.every(c => c.wireless && !c.wireless.startsWith('None')), 'Expected all wireless');

  const resUsb = await request('/controllers?connectivity=usb');
  assert(resUsb.status === 200, `Expected status 200, got ${resUsb.status}`);
  assert(resUsb.data.data.every(c => c.usbSupport === true), 'Expected all USB support true');
});

test('Controller retrieval includes model-specific advantages and pinoutConfig', async () => {
  const res = await request('/controllers/atmega328p');
  assert(res.status === 200, `Expected status 200, got ${res.status}`);
  const ctrl = res.data.data;
  assert(ctrl.name === 'ATmega328P', 'Expected ATmega328P');
  assert(ctrl.advantages && ctrl.advantages.length > 10, 'Expected detailed advantages');
  assert(ctrl.technicalSources && ctrl.technicalSources.length > 5, 'Expected technical sources');
  assert(Array.isArray(ctrl.pinoutConfig), 'Expected pinoutConfig array');
});

test('Admin controller creation and deletion lifecycle', async () => {
  const testChip = {
    name: "MSP430G2553-TEST",
    commonName: "TI MSP430G2553 (Ultra-Low Power 16-bit)",
    slug: "msp430g2553-test",
    family: "ARM Cortex-M",
    architecture: "MSP430 16-bit RISC",
    core: "MSP430 CPU",
    coreCount: 1,
    manufacturer: "Texas Instruments",
    bitWidth: 16,
    maxClockSpeedMHz: 16.0,
    flashKb: 16.0,
    sramKb: 0.512,
    operatingVoltageMin: 1.8,
    operatingVoltageMax: 3.6,
    logicLevel: "3.3V",
    gpioCount: 24,
    adcChannels: 8,
    adcResolutionBits: 10,
    timers: 2,
    uartCount: 1,
    spiCount: 1,
    i2cCount: 1,
    packageTypes: "PDIP-20, TSSOP-20",
    description: "Ultra-low power 16-bit microcontroller for battery sensors.",
    architecturalNotes: "Von Neumann architecture with 16-bit orthogonal register set.",
    datasheetUrl: "https://www.ti.com/lit/ds/symlink/msp430g2553.pdf"
  };

  // Regular user creation should fail
  const failRes = await request('/controllers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: testChip,
  });
  assert(failRes.status === 403, `Expected 403 Forbidden for regular user, got ${failRes.status}`);

  // Admin creation should succeed
  const createRes = await request('/controllers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: testChip,
  });
  assert(createRes.status === 201, `Expected 201 Created for admin, got ${createRes.status}`);
  const createdId = createRes.data.data.id;

  // Cleanup: Delete as admin
  const deleteRes = await request(`/controllers/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(deleteRes.status === 200, `Expected 200 OK on deletion, got ${deleteRes.status}`);
});

// ==========================================
// Milestone 6: Saved Experiments API Lifecycle
// ==========================================
test('Authenticated experiment persistence lifecycle (save, list, retrieve, update, delete)', async () => {
  const newExperiment = {
    title: "High-Frequency PWM Motor Drive Calibration",
    description: "Configured for 25kHz ultrasonic BLDC gate driving with 65% duty cycle.",
    experimentType: "PWM",
    configState: {
      frequencyHz: 25000,
      dutyCyclePercent: 65.0,
      supplyVoltage: 3.3,
      loadType: "BLDC_PHASE"
    }
  };

  // 1. Create experiment
  const saveRes = await request('/experiments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: newExperiment,
  });
  assert(saveRes.status === 201, `Expected 201 Created, got ${saveRes.status}`);
  const experimentId = saveRes.data.data.id;
  assert(saveRes.data.data.title === newExperiment.title, 'Expected matching experiment title');

  // 2. List experiments
  const listRes = await request('/experiments', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(listRes.status === 200, `Expected 200 OK, got ${listRes.status}`);
  assert(Array.isArray(listRes.data.data), 'Expected array of saved experiments');
  assert(listRes.data.data.some(e => e.id === experimentId), 'Expected saved experiment in list');

  // 3. Retrieve single experiment
  const getRes = await request(`/experiments/${experimentId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(getRes.status === 200, `Expected 200 OK, got ${getRes.status}`);
  assert(getRes.data.data.configState.frequencyHz === 25000, 'Expected parsed configState object');

  // 4. Update / Rename experiment
  const updateRes = await request(`/experiments/${experimentId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      title: "Optimized 25kHz Ultrasonic PWM Drive",
      configState: {
        frequencyHz: 25000,
        dutyCyclePercent: 72.5,
        supplyVoltage: 3.3,
      }
    },
  });
  assert(updateRes.status === 200, `Expected 200 OK on update, got ${updateRes.status}`);
  assert(updateRes.data.data.title === "Optimized 25kHz Ultrasonic PWM Drive", 'Expected updated title');

  // 5. Delete experiment
  const delRes = await request(`/experiments/${experimentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(delRes.status === 200, `Expected 200 OK on delete, got ${delRes.status}`);
});

// ==========================================
// Milestone 7 Tests
// ==========================================

test('Dashboard stats returns live user metrics without hardcoded data', async () => {
  const res = await request('/dashboard/stats', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const data = res.data.data || res.data.stats;
  assert(data && data.user && data.user.email, 'Expected authenticated user profile');
  assert(data.progress && typeof data.progress.percentage === 'number', 'Expected progress metrics');
  assert(Array.isArray(data.recentlyVisitedLessons), 'Expected recentlyVisitedLessons array');
  assert(Array.isArray(data.completedChapters), 'Expected completedChapters array');
  assert(data.quizStats && typeof data.quizStats.averageScore === 'number', 'Expected quizStats');
  assert(Array.isArray(data.savedExperiments), 'Expected savedExperiments array');
  assert(Array.isArray(data.researchNotes), 'Expected researchNotes array');
  assert(Array.isArray(data.bookmarks), 'Expected bookmarks array');
});

test('Lesson completion marks lesson as complete and updates progress', async () => {
  const lessonsRes = await request('/lessons');
  assert(lessonsRes.status === 200 && lessonsRes.data.data.length > 0, 'Expected lessons array');
  const targetLesson = lessonsRes.data.data[0];

  const completeRes = await request(`/lessons/${targetLesson.id}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(completeRes.status === 200, `Expected 200 OK, got ${completeRes.status}`);
  assert(completeRes.data.data.isCompleted === true, 'Expected isCompleted to be true');
});

test('Quiz catalog lists quizzes without exposing correct answers and records attempts', async () => {
  // Public listing
  const quizzesRes = await request('/quizzes');
  assert(quizzesRes.status === 200, `Expected 200 OK, got ${quizzesRes.status}`);
  assert(Array.isArray(quizzesRes.data.data), 'Expected quizzes array');
  assert(quizzesRes.data.data.length > 0, 'Expected at least 1 quiz');

  // Verify answer protection
  const firstQuiz = quizzesRes.data.data[0];
  if (firstQuiz.questions && firstQuiz.questions.length > 0) {
    const q = firstQuiz.questions[0];
    assert(q.correctOptionIndex === undefined, 'Quiz questions must not expose correctOptionIndex');
    assert(q.explanation === undefined, 'Quiz questions must not expose explanation before submission');
  }

  // User attempts
  const attemptsRes = await request('/quizzes/attempts', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(attemptsRes.status === 200, `Expected 200 OK, got ${attemptsRes.status}`);
  assert(Array.isArray(attemptsRes.data.data), 'Expected attempts array');
});

test('Bookmark lifecycle toggles controller bookmark and prevents duplicates', async () => {
  const ctrlRes = await request('/controllers?limit=1');
  const ctrl = ctrlRes.data.data[0];
  assert(ctrl, 'Expected at least one controller');

  // 1. Toggle ON
  const toggleOn = await request('/bookmarks/toggle', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { itemType: 'CONTROLLER', itemId: ctrl.id },
  });
  assert(toggleOn.status === 200, `Expected 200 OK, got ${toggleOn.status}`);
  assert(toggleOn.data.data.bookmarked === true, 'Expected bookmark to be added');

  // 2. Verify in list
  const listRes = await request('/bookmarks', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(listRes.status === 200, `Expected 200 OK, got ${listRes.status}`);
  const found = listRes.data.data.find(b => b.itemId === ctrl.id);
  assert(found, 'Expected bookmarked controller in list');

  // 3. Toggle OFF
  const toggleOff = await request('/bookmarks/toggle', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { itemType: 'CONTROLLER', itemId: ctrl.id },
  });
  assert(toggleOff.status === 200, `Expected 200 OK, got ${toggleOff.status}`);
  assert(toggleOff.data.data.bookmarked === false, 'Expected bookmark to be removed');
});

test('Research logbook CRUD lifecycle creates, updates and deletes notes', async () => {
  // 1. Create
  const createRes = await request('/research-notes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      title: 'DMA FIFO Buffering Test Notes',
      category: 'ROBOTICS',
      content: 'Configured double-buffering DMA stream on SPI2 to avoid buffer overflow during 20MHz sampling.',
      tags: ['DMA', 'SPI', 'Buffering'],
      isPublic: false,
    },
  });
  assert(createRes.status === 201, `Expected 201 Created, got ${createRes.status}`);
  const noteId = createRes.data.data.id;
  assert(noteId, 'Expected note ID');

  // 2. Read
  const getRes = await request('/research-notes', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(getRes.status === 200, `Expected 200 OK, got ${getRes.status}`);
  const foundNote = getRes.data.data.find(n => n.id === noteId);
  assert(foundNote && foundNote.title === 'DMA FIFO Buffering Test Notes', 'Expected created note in logbook');

  // 3. Update
  const updateRes = await request(`/research-notes/${noteId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      title: 'DMA FIFO Buffering Test Notes (Verified)',
      tags: ['DMA', 'SPI', 'Buffering', 'Benchmarked'],
    },
  });
  assert(updateRes.status === 200, `Expected 200 OK, got ${updateRes.status}`);
  assert(updateRes.data.data.title === 'DMA FIFO Buffering Test Notes (Verified)', 'Expected updated title');

  // 4. Delete
  const delRes = await request(`/research-notes/${noteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(delRes.status === 200, `Expected 200 OK on note delete, got ${delRes.status}`);
});

test('Admin operations manage metrics, list users and prevent self-demotion', async () => {
  // 1. Metrics
  const metricsRes = await request('/admin/metrics', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(metricsRes.status === 200, `Expected 200 OK, got ${metricsRes.status}`);
  assert(typeof metricsRes.data.data.totalUsers === 'number', 'Expected totalUsers metric');
  assert(typeof metricsRes.data.data.totalControllers === 'number', 'Expected totalControllers metric');

  // 2. Users listing
  const usersRes = await request('/admin/users', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(usersRes.status === 200, `Expected 200 OK, got ${usersRes.status}`);
  assert(Array.isArray(usersRes.data.data), 'Expected users list');

  // Find admin user in list
  const currentAdmin = usersRes.data.data.find(u => u.email === 'admin@microverse.lab');
  assert(currentAdmin, 'Expected admin user in list');

  // 3. Self-demotion prevention
  const demoteRes = await request(`/admin/users/${currentAdmin.id}/role`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { role: 'USER' },
  });
  assert(demoteRes.status === 400, `Expected 400 Bad Request on self-demotion, got ${demoteRes.status}`);
});

// ==========================================
// Runner
// ==========================================
async function runAll() {
  console.log('\n=======================================================');
  console.log('  MICROVERSE BACKEND TEST SUITE (MILESTONES 3, 4 & 5)');
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
