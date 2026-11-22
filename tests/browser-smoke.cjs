const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const XLSX = require('xlsx');

const root = process.cwd();
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, relative);
  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) { response.writeHead(404).end('Not found'); return; }
    const extension = path.extname(filePath);
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
    response.writeHead(200, { 'content-type': types[extension] || 'application/octet-stream' });
    response.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('https://cdn.jsdelivr.net/npm/chart.js@4.4.1', route => route.abort());
  await page.addInitScript(() => { if (!sessionStorage.getItem('__teacher_test_reset')) { localStorage.clear(); sessionStorage.setItem('__teacher_test_reset', '1'); } });

  try {
    await page.goto('http://127.0.0.1:4173/primary.html', { waitUntil: 'domcontentloaded' });
    await page.locator('#btnNewGroupModal').waitFor();

    const initialNames = await page.locator('#subjectTableBody input[data-field="name"]').count();
    assert.equal(initialNames, 0, 'new profile must not contain demo students');

    await page.locator('#btnNewGroupModal').click();
    await page.locator('#newGroupNameInput').fill('فوج اختبار');
    await page.locator('#newGroupSubjectInput').fill('الرياضيات');
    await page.locator('#btnConfirmNewGroup').click();
    const afterGroup = await page.evaluate(() => JSON.parse(localStorage.getItem('dz_teacher_grade_dashboard_v4_multi') || '{}'));
    assert.equal(afterGroup.groups?.length, 1, 'new group is persisted');
    await page.locator('#subjectYearLevelSelect').selectOption('p2');
    await page.locator('#btnStageSubSubject').click();
    await page.locator('#searchSubjectStudent').fill('');
    await page.locator('#btnAddStudentSubject').click();
    await page.locator('#subjectTableBody input[data-field="name"]').first().waitFor();

    await page.locator('#subjectTableBody .btn-open-rubric').first().click();
    await page.locator('#modalRubricCalc').waitFor({ state: 'visible' });
    for (const selector of ['#rub_p1', '#rub_p2', '#rub_p3']) {
      assert.equal(await page.locator(selector).inputValue(), '0', 'new rubric criteria must start at zero');
    }
    await page.locator('#btnCancelRubric').click();

    const manualName = page.locator('#subjectTableBody input[data-field="name"]').first();
    assert.equal(await manualName.inputValue(), '', 'manual student name starts blank');
    assert.equal(await page.locator('#subjectTableBody input[data-field="cont"]').first().inputValue(), '0');
    assert.equal(await page.locator('#subjectTableBody input[data-field="exam"]').first().inputValue(), '0');
    await manualName.fill('<img src=x onerror=alert(1)>');
    await manualName.dispatchEvent('change');
    assert.equal(await page.locator('#subjectTableBody img').count(), 0, 'student text must not become HTML');

    await page.locator('#btnOpenPasteModal').click();
    await page.locator('#importTargetSelect').selectOption('subject');
    await page.locator('#importNamesTextarea').fill('اللقب والاسم\tالتقييم المستمر\tالاختبار\nتلميذ مستورد\t8\t7');
    await page.locator('#btnConfirmImport').click();
    await page.locator('#importPreview').waitFor({ state: 'visible' });
    assert.match(await page.locator('#importPreview').innerText(), /تلميذ مستورد/);
    await page.locator('#btnConfirmImport').click();
    assert.equal(await page.locator('#subjectTableBody input[data-field="name"]').count(), 2);
    const importedRow = page.locator('#subjectTableBody tr').nth(1);
    assert.equal(await importedRow.locator('input[data-field="cont"]').inputValue(), '8');
    assert.equal(await importedRow.locator('input[data-field="exam"]').inputValue(), '7');

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
      ['اللقب والاسم', 'التقييم المستمر', 'الاختبار'],
      ['تلميذ من ملف Excel', 6, 9]
    ]), 'القائمة');
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await page.locator('#excelFileInput').setInputFiles({ name: 'roster.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: excelBuffer });
    await page.locator('#importPreview').waitFor({ state: 'visible' });
    assert.match(await page.locator('#importPreview').innerText(), /تلميذ من ملف Excel/);
    await page.locator('#btnConfirmImport').click();
    assert.equal(await page.locator('#subjectTableBody input[data-field="name"]').count(), 3);
    const excelRow = page.locator('#subjectTableBody tr').nth(2);
    assert.equal(await excelRow.locator('input[data-field="cont"]').inputValue(), '6');
    assert.equal(await excelRow.locator('input[data-field="exam"]').inputValue(), '9');

    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('#subjectTableBody input[data-field="name"]').count(), 3, 'roster persists after reload');
    assert.equal(await page.locator('#subjectTableBody img').count(), 0, 'stored names remain escaped after reload');

    await page.locator('#btnOpenSchedule').click();
    await page.locator('#scheduleTerm').selectOption('1');
    await page.locator('#scheduleTestDate').fill('2026-11-20');
    await page.locator('#scheduleCorrectionDate').fill('2026-11-21');
    await page.locator('#scheduleRemediationDate').fill('2026-11-22');
    await page.locator('#scheduleExamStartDate').fill('2026-11-30');
    await page.locator('#btnSaveScheduledTest').click();
    assert.match(await page.locator('#scheduleEntriesList').innerText(), /الرياضيات/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);
    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(widths.document <= widths.viewport + 2, `mobile horizontal overflow: ${JSON.stringify(widths)}`);
    await page.locator('#btnCloseSchedule').click();
    for (const route of ['middle.html', 'secondary.html', 'index.html', 'rules.html']) {
      await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: 'domcontentloaded' });
      const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
      assert.ok(dimensions.document <= dimensions.viewport + 2, `mobile overflow on ${route}: ${JSON.stringify(dimensions)}`);
    }
    assert.deepEqual(pageErrors, [], `browser runtime errors: ${pageErrors.join('; ')}`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
