/**
 * MICROVERSE END-TO-END USER JOURNEY VERIFICATION SUITE
 * Milestone 8 - Production Readiness & Journey Verification
 *
 * Covers:
 *   Journey 1: Anonymous Visitor Exploration
 *   Journey 2: Authenticated Learner Lifecycle
 *   Journey 3: System Administrator Governance
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

// Global Journey State
const testRunId = Date.now();
const testUserEmail = `engineer_${testRunId}@microverse.lab`;
const testUserPassword = `Password123!#${testRunId}`;
let registeredUserToken = null;
let registeredUserId = null;
let adminToken = null;
let createdTestControllerId = null;
let createdTestLessonId = null;
let targetChapterId = null;
let targetQuizId = null;

// ========================================================
// JOURNEY 1: ANONYMOUS VISITOR EXPLORATION
// ========================================================

test('[VISITOR] Health check confirms system online and PostgreSQL connected', async () => {
  const res = await request('/health');
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  assert(res.data.status === 'ONLINE', `Expected status ONLINE, got ${res.data.status}`);
  assert(res.data.database?.status === 'CONNECTED', `Expected database CONNECTED, got ${res.data.database?.status}`);
});

test('[VISITOR] Explores syllabus and retrieves all 14 published curriculum chapters', async () => {
  const res = await request('/chapters');
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const chapters = res.data.data;
  assert(Array.isArray(chapters), 'Expected array of chapters');
  assert(chapters.length >= 14, `Expected at least 14 chapters, found ${chapters.length}`);
  
  // Verify first chapter has expected curriculum metadata
  const ch1 = chapters.find(c => c.chapterNumber === 1);
  assert(ch1 && ch1.title, 'Expected Chapter 1 with title');
  assert(ch1.lessons && ch1.lessons.length > 0, 'Expected Chapter 1 to have sub-lessons');
  targetChapterId = ch1.id;
});

test('[VISITOR] Retrieves detailed chapter content and lesson breakdown by slug', async () => {
  const res = await request('/chapters/what-is-a-microcontroller');
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const ch = res.data.data;
  assert(ch.chapterNumber === 1, 'Expected chapter 1');
  assert(Array.isArray(ch.lessons), 'Expected lessons array');
  assert(ch.lessons.length > 0, 'Expected lessons in chapter');
});

test('[VISITOR] Searches silicon archive with multi-attribute filters', async () => {
  // Search query
  const searchRes = await request('/controllers?search=cortex');
  assert(searchRes.status === 200, `Expected 200 OK, got ${searchRes.status}`);
  assert(searchRes.data.data.length > 0, 'Expected search results for "cortex"');

  // Family filter
  const famRes = await request('/controllers?family=STM32');
  assert(famRes.status === 200, `Expected 200 OK, got ${famRes.status}`);
  assert(famRes.data.data.every(c => c.family === 'STM32'), 'Expected all results to have family STM32');
});

test('[VISITOR] Opens detailed controller profile and verifies technical specs and pinout', async () => {
  const res = await request('/controllers/stm32f401ret6');
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const ctrl = res.data.data;
  assert(ctrl.name.includes('STM32F401RET6') || ctrl.slug === 'stm32f401ret6', 'Expected STM32F401RET6 controller');
  assert(ctrl.maxClockSpeedMHz > 0, 'Expected clock speed');
  assert(ctrl.flashKb > 0, 'Expected flash size');
  assert(ctrl.sramKb > 0, 'Expected SRAM size');
  assert(ctrl.pinoutConfig, 'Expected pinout configuration');
});

test('[VISITOR] Uses comparison tool to align multiple microcontroller specifications', async () => {
  const res = await request('/controllers/compare?ids=stm32f401ret6,esp32-s3');
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  assert(Array.isArray(res.data.data), 'Expected array of compared controllers');
  assert(res.data.data.length === 2, `Expected 2 controllers, found ${res.data.data.length}`);
});

test('[VISITOR] Public quiz inspection strips correct answer keys and explanations', async () => {
  const res = await request('/quizzes');
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const quizzes = res.data.data;
  assert(Array.isArray(quizzes) && quizzes.length > 0, 'Expected quizzes array');

  targetQuizId = quizzes[0].id;
  const questions = quizzes[0].questions || [];
  if (questions.length > 0) {
    const q = questions[0];
    assert(q.correctOptionIndex === undefined, 'Quiz questions must not expose correctOptionIndex to visitors');
    assert(q.explanation === undefined, 'Quiz questions must not expose explanation before submission');
  }
});

// ========================================================
// JOURNEY 2: REGISTERED USER LIFECYCLE
// ========================================================

test('[USER] Registers a new laboratory engineer account', async () => {
  const res = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'E2E Flight Engineer',
      username: `e2e_engineer_${testRunId}`,
      email: testUserEmail,
      password: testUserPassword,
      bio: 'Robotics Embedded Firmware Specialist',
    },
  });
  assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
  assert(res.data.success === true, 'Expected registration success');
  const payload = res.data.data || res.data;
  assert(payload.user.email === testUserEmail, 'Expected matching email');
  registeredUserId = payload.user.id;
  registeredUserToken = payload.token;
});

test('[USER] Logs in and receives valid JWT token and session cookie', async () => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: {
      email: testUserEmail,
      password: testUserPassword,
    },
  });
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const payload = res.data.data || res.data;
  assert(payload.token, 'Expected JWT token');
  registeredUserToken = payload.token;
});

test('[USER] Retrieves profile via /auth/me with Bearer token', async () => {
  const res = await request('/auth/me', {
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const user = res.data.data?.user || res.data.user;
  assert(user.id === registeredUserId, 'Expected matching user ID');
  assert(user.role === 'USER', 'Default role should be USER');
  assert(user.passwordHash === undefined, 'Must never return passwordHash');
});

test('[USER] Studies and completes curriculum lesson, recording progress', async () => {
  const lessonsRes = await request('/lessons');
  const firstLesson = lessonsRes.data.data[0];
  assert(firstLesson, 'Expected at least one lesson');

  const completeRes = await request(`/lessons/${firstLesson.id}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(completeRes.status === 200, `Expected 200 OK, got ${completeRes.status}`);
  assert(completeRes.data.data.isCompleted === true, 'Expected lesson marked as completed');
});

test('[USER] Takes assessment quiz, submits answers, and receives graded evaluation', async () => {
  assert(targetQuizId, 'Target quiz must be defined');

  // Fetch quiz to get valid question IDs
  const quizRes = await request(`/quizzes/${targetQuizId}`);
  assert(quizRes.status === 200, `Expected 200 OK, got ${quizRes.status}`);
  const quizData = quizRes.data.data || quizRes.data;
  const questions = quizData.questions || [];

  const answers = {};
  questions.forEach(q => {
    answers[q.id] = 0;
  });

  // Submit assessment answers
  const submitRes = await request(`/quizzes/${targetQuizId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${registeredUserToken}` },
    body: { answers },
  });
  assert(submitRes.status === 200, `Expected 200 OK, got ${submitRes.status}`);
  assert(typeof submitRes.data.data.score === 'number', 'Expected numerical score');
  assert(typeof submitRes.data.data.percentage === 'number', 'Expected percentage');
  assert(Array.isArray(submitRes.data.data.review), 'Expected post-submission review breakdown');

  // Verify attempt is recorded in history
  const historyRes = await request('/quizzes/attempts', {
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(historyRes.status === 200, `Expected 200 OK, got ${historyRes.status}`);
  assert(historyRes.data.data.length > 0, 'Expected attempt recorded in user history');
});

test('[USER] Bookmarks a target microcontroller and verifies persistence', async () => {
  const ctrlRes = await request('/controllers?limit=1');
  const targetCtrl = ctrlRes.data.data[0];

  // Toggle bookmark on
  const toggleRes = await request('/bookmarks/toggle', {
    method: 'POST',
    headers: { Authorization: `Bearer ${registeredUserToken}` },
    body: { itemType: 'CONTROLLER', itemId: targetCtrl.id },
  });
  assert(toggleRes.status === 200, `Expected 200 OK, got ${toggleRes.status}`);
  assert(toggleRes.data.data.bookmarked === true, 'Expected bookmark added');

  // Verify bookmark listed
  const listRes = await request('/bookmarks', {
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(listRes.status === 200, `Expected 200 OK, got ${listRes.status}`);
  const found = listRes.data.data.find(b => b.itemId === targetCtrl.id);
  assert(found, 'Expected bookmarked controller in bookmark list');
});

test('[USER] Saves virtual experiment circuit configuration', async () => {
  const expRes = await request('/experiments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${registeredUserToken}` },
    body: {
      title: 'E2E PID Motor Tuning Circuit',
      experimentType: 'PWM',
      description: 'H-bridge motor drive with 20kHz PWM carrier and encoder feedback.',
      configState: {
        frequencyHz: 20000,
        dutyCyclePercent: 65,
        supplyVoltage: 5.0,
      },
    },
  });
  assert(expRes.status === 201, `Expected 201 Created, got ${expRes.status}`);
  assert(expRes.data.data.id, 'Expected experiment ID');
});

test('[USER] Creates engineering research log note with tags', async () => {
  const noteRes = await request('/research-notes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${registeredUserToken}` },
    body: {
      title: 'DMA Stream Arbiter Latency Analysis',
      category: 'ARCHITECTURE',
      content: 'Benchmarked circular buffer interrupt latency: under 4.2us at 84MHz clock speed.',
      tags: ['DMA', 'Circular Buffer', 'Latency'],
      isPublic: true,
    },
  });
  assert(noteRes.status === 201, `Expected 201 Created, got ${noteRes.status}`);
  assert(noteRes.data.data.id, 'Expected research note ID');
});

test('[USER] Dashboard aggregates all live progress, quiz, bookmarks, and experiment data', async () => {
  const res = await request('/dashboard/stats', {
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const data = res.data.data || res.data.stats;
  assert(data.user.email === testUserEmail, 'Expected matching user in stats');
  assert(data.bookmarks.length >= 1, 'Expected at least 1 bookmark');
  assert(data.savedExperiments.length >= 1, 'Expected at least 1 experiment');
  assert(data.researchNotes.length >= 1, 'Expected at least 1 research note');
  assert(data.quizStats.totalAttempts >= 1, 'Expected at least 1 quiz attempt');
});

test('[USER] Logs out and logs back in with saved credentials', async () => {
  // Logout
  const logoutRes = await request('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(logoutRes.status === 200, `Expected 200 OK on logout, got ${logoutRes.status}`);

  // Re-login
  const reLoginRes = await request('/auth/login', {
    method: 'POST',
    body: {
      email: testUserEmail,
      password: testUserPassword,
    },
  });
  assert(reLoginRes.status === 200, `Expected 200 OK on re-login, got ${reLoginRes.status}`);
  registeredUserToken = reLoginRes.data.data?.token || reLoginRes.data.token;
  assert(registeredUserToken, 'Expected new valid JWT token');
});

// ========================================================
// JOURNEY 3: SYSTEM ADMINISTRATOR GOVERNANCE
// ========================================================

test('[ADMIN] Logs into administrator console', async () => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@microverse.lab',
      password: 'AdminPass123!',
    },
  });
  assert(res.status === 200, `Admin login failed: ${res.status}`);
  adminToken = res.data.data?.token || res.data.token;
  assert(adminToken, 'Expected admin JWT token');
});

test('[ADMIN] Retrieves comprehensive laboratory operational metrics', async () => {
  const res = await request('/admin/metrics', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
  const totals = res.data.data.totals;
  assert(totals.users >= 2, 'Expected at least 2 users');
  assert(totals.controllers >= 19, 'Expected at least 19 controllers');
  assert(totals.chapters >= 14, 'Expected at least 14 chapters');
});

test('[ADMIN] Creates a new verified silicon controller record', async () => {
  const uniqueSlug = `e2e-stm32h7-test-${testRunId}`;
  const res = await request('/controllers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: `STM32H753ZI Dual-Core Lab Target (${testRunId})`,
      commonName: `STM32H753ZI DevBoard (${testRunId})`,
      slug: uniqueSlug,
      manufacturer: 'STMicroelectronics',
      family: 'STM32',
      architecture: 'ARM Cortex-M7/M4',
      core: 'Dual Cortex-M7/M4 32-bit RISC',
      coreCount: 2,
      maxClockSpeedMHz: 480,
      bitWidth: 32,
      flashKb: 2048,
      sramKb: 1024,
      operatingVoltageMin: 1.62,
      operatingVoltageMax: 3.6,
      logicLevel: '3.3V',
      gpioCount: 168,
      adcChannels: 36,
      adcResolutionBits: 16,
      dacChannels: 2,
      timers: 22,
      pwmChannels: 32,
      uartCount: 4,
      spiCount: 6,
      i2cCount: 4,
      usbSupport: true,
      packageTypes: 'LQFP-208',
      description: 'E2E Automated test silicon target with dual-core Cortex-M architecture.',
      architecturalNotes: 'Dual-core heterogeneous architecture with 480MHz Cortex-M7 and 240MHz Cortex-M4.',
      datasheetUrl: 'https://www.st.com/resource/en/datasheet/stm32h753zi.pdf',
    },
  });
  assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
  createdTestControllerId = res.data.data.id;
  assert(createdTestControllerId, 'Expected created controller ID');
});

test('[ADMIN] Updates silicon controller specifications', async () => {
  assert(createdTestControllerId, 'Controller must exist');
  const res = await request(`/controllers/${createdTestControllerId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      maxClockSpeedMHz: 550,
      description: 'Updated E2E Automated test silicon target with 550MHz overclock rating.',
    },
  });
  assert(res.status === 200, `Expected 200 OK on update, got ${res.status}`);
  assert(res.data.data.maxClockSpeedMHz === 550, 'Expected updated clock speed');
});

test('[ADMIN] Creates a new curriculum lesson under Chapter 1', async () => {
  assert(targetChapterId, 'Target chapter ID must exist');
  const uniqueLessonSlug = `e2e-lesson-${testRunId}`;
  const res = await request('/lessons', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      chapterId: targetChapterId,
      lessonNumber: 99,
      title: `E2E Verified DMA Channels (${testRunId})`,
      slug: uniqueLessonSlug,
      summary: 'Analysis of DMA burst transfers and circular buffering in real-time control.',
      content: '### Direct Memory Access\nDMA offloads bulk transfers from CPU cycles to preserve real-time responsiveness.',
      difficulty: 'INTERMEDIATE',
      estimatedMinutes: 20,
      order: 99,
      isPublished: true,
    },
  });
  assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
  createdTestLessonId = res.data.data.id;
  assert(createdTestLessonId, 'Expected created lesson ID');
});

test('[ADMIN] Publishes and unpublishes curriculum content state', async () => {
  assert(createdTestLessonId, 'Lesson must exist');

  // Toggle to draft (unpublished)
  const unpubRes = await request(`/lessons/${createdTestLessonId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isPublished: false },
  });
  assert(unpubRes.status === 200, `Expected 200 OK, got ${unpubRes.status}`);
  assert(unpubRes.data.data.isPublished === false, 'Expected lesson to be unpublished');

  // Regular user querying drafts should get 404
  const visitorDraftRes = await request(`/lessons/${createdTestLessonId}`);
  assert(visitorDraftRes.status === 404, `Unpublished lesson must return 404 to visitors, got ${visitorDraftRes.status}`);

  // Re-publish
  const pubRes = await request(`/lessons/${createdTestLessonId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isPublished: true },
  });
  assert(pubRes.status === 200, `Expected 200 OK, got ${pubRes.status}`);
  assert(pubRes.data.data.isPublished === true, 'Expected lesson to be published');
});

test('[ADMIN] Creates a new quiz question under an existing quiz', async () => {
  assert(targetQuizId, 'Target quiz must exist');
  const res = await request('/quizzes/question', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      quizId: targetQuizId,
      question: `Which bus interface provides full-duplex synchronous data transmission at highest speeds? (${testRunId})`,
      options: ['I2C (Inter-Integrated Circuit)', 'SPI (Serial Peripheral Interface)', 'UART (Universal Asynchronous)', '1-Wire Bus'],
      correctOptionIndex: 1,
      explanation: 'SPI provides dedicated MOSI, MISO, SCK, and CS lines for full-duplex operation exceeding 50MHz.',
      points: 10,
    },
  });
  assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
  assert(res.data.data.id, 'Expected question ID');
});

test('[ADMIN] Lists registered users and updates user roles', async () => {
  // List users
  const listRes = await request('/admin/users', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(listRes.status === 200, `Expected 200 OK, got ${listRes.status}`);
  const userList = listRes.data.data;
  assert(Array.isArray(userList), 'Expected users array');

  // Find test user and promote to ADMIN
  const targetUser = userList.find(u => u.email === testUserEmail);
  assert(targetUser, 'Expected created test user in user list');

  const promoteRes = await request(`/admin/users/${targetUser.id}/role`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { role: 'ADMIN' },
  });
  assert(promoteRes.status === 200, `Expected 200 OK, got ${promoteRes.status}`);
  assert(promoteRes.data.data.role === 'ADMIN', 'Expected role elevated to ADMIN');

  // Revert back to USER
  const revertRes = await request(`/admin/users/${targetUser.id}/role`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { role: 'USER' },
  });
  assert(revertRes.status === 200, `Expected 200 OK, got ${revertRes.status}`);
  assert(revertRes.data.data.role === 'USER', 'Expected role reverted to USER');
});

test('[SECURITY] Regular user cannot access protected admin endpoints (403 Forbidden)', async () => {
  // Regular user attempts to access /admin/metrics
  const res = await request('/admin/metrics', {
    headers: { Authorization: `Bearer ${registeredUserToken}` },
  });
  assert(res.status === 403, `Expected 403 Forbidden for regular user, got ${res.status}`);
});

test('[SECURITY] Admin self-demotion is strictly rejected (400 Bad Request)', async () => {
  const usersRes = await request('/admin/users', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const currentAdmin = usersRes.data.data.find(u => u.email === 'admin@microverse.lab');
  assert(currentAdmin, 'Expected admin in users list');

  const demoteRes = await request(`/admin/users/${currentAdmin.id}/role`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { role: 'USER' },
  });
  assert(demoteRes.status === 400, `Expected 400 Bad Request for self-demotion, got ${demoteRes.status}`);
});

test('[CLEANUP] Admin cleans up temporary test controller, lesson, and user', async () => {
  // Delete test controller
  if (createdTestControllerId) {
    const delCtrl = await request(`/controllers/${createdTestControllerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delCtrl.status === 200, `Expected 200 OK on controller cleanup, got ${delCtrl.status}`);
  }

  // Delete test lesson
  if (createdTestLessonId) {
    const delLesson = await request(`/lessons/${createdTestLessonId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delLesson.status === 200, `Expected 200 OK on lesson cleanup, got ${delLesson.status}`);
  }

  // Delete test user
  if (registeredUserId) {
    const delUser = await request(`/admin/users/${registeredUserId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delUser.status === 200, `Expected 200 OK on user cleanup, got ${delUser.status}`);
  }
});

// ========================================================
// RUNNER
// ========================================================
async function runAll() {
  console.log('\n================================================================');
  console.log('  MICROVERSE END-TO-END JOURNEY TEST SUITE (MILESTONE 8)');
  console.log('================================================================\n');

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

  console.log('\n----------------------------------------------------------------');
  console.log(`  TOTAL: ${tests.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('----------------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAll().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
