const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const source = fs.readFileSync('assets/js/app.js', 'utf8');

function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing function: ${name}`);
  const open = source.indexOf('{', start);
  const nextFunction = source.indexOf('\n  function ', open + 1);
  const segmentEnd = nextFunction < 0 ? source.length : nextFunction;
  const close = source.lastIndexOf('\n  }', segmentEnd);
  assert.notEqual(close, -1, `Could not locate end of function: ${name}`);
  return source.slice(start, close + 4);
}

const declarations = [
  `const QUALITATIVE_LEVELS = [
    { value: 'A', label: 'تحكم أقصى', numEquiv: 9.5 },
    { value: 'B', label: 'تحكم مقبول', numEquiv: 7.5 },
    { value: 'C', label: 'تحكم جزئي', numEquiv: 5.5 },
    { value: 'D', label: 'تحكم أدنى', numEquiv: 3.5 }
  ];`,
  'let state = { assessmentSchedule: [], closedWeeks: [] };',
  ...['clamp', 'escapeHtml', 'normalizeStudentName', 'parseCsvRows', 'googleSheetsCsvUrl', 'migrateLegacyState', 'isPrimaryQualitativeOnly', 'generatePedagogicalRemark', 'getCouncilAward', 'computeStudentSubjectGrade', 'computeHomeroomStudent', 'validateScheduledTest', 'getMiddleExamDuration'].map(extractFunction),
  'this.engine = { computeStudentSubjectGrade, computeHomeroomStudent, parseCsvRows, googleSheetsCsvUrl, escapeHtml, migrateLegacyState, validateScheduledTest, isPrimaryQualitativeOnly, getMiddleExamDuration, setScheduleState(value) { state = value; } };'
].join('\n');

const sandbox = { URL };
vm.runInNewContext(declarations, sandbox);
const engine = sandbox.engine;

test('primary regular subject averages continuous and exam marks', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 8, exam: 6, devoir: 0, extra: 0, qualLevel: 'A' },
    { stage: 'primary', yearLevel: 'p2', category: 'pri_core', term: 1, coeff: 1 }
  );
  assert.equal(result.avg, 7);
});

test('primary activity subjects use continuous assessment only', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 8, exam: 0, devoir: 0, extra: 0, qualLevel: 'A' },
    { stage: 'primary', yearLevel: 'p2', category: 'pri_activity', term: 1, coeff: 1 }
  );
  assert.equal(result.avg, 8);
  assert.equal(result.isActivityNoExam, true);
});

test('primary first grade is qualitative and has no numeric test field', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 0, exam: 0, qualLevel: 'A' },
    { stage: 'primary', yearLevel: 'p1', category: 'pri_core', term: 1, coeff: 1 }
  );
  assert.equal(result.qualOnly, true);
  assert.equal(result.avg, 9.5);
});

test('middle stage computes MTM and subject average with exam normalized to 40', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 16, devoir: 14, exam: 15, extra: 0 },
    { stage: 'middle', yearLevel: 'm3', category: 'mid_standard', examScale: 20, coeff: 2 }
  );
  assert.equal(result.mtm, 15);
  assert.equal(result.examOn40, 30);
  assert.equal(result.avg, 15);
});

test('middle stage flags reused continuous assessment marks', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 14, devoir: 14, exam: 14, extra: 0 },
    { stage: 'middle', yearLevel: 'm3', category: 'mid_standard', examScale: 20, coeff: 2 }
  );
  assert.ok(result.warnings.length > 0);
});

test('secondary language formula divides four components by five', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 15, devoir: 14, extra: 16, exam: 30 },
    { stage: 'secondary', yearLevel: 's2', category: 'languages', examScale: 40, coeff: 3 }
  );
  assert.equal(result.avg, 15);
});

test('secondary other-subject formula divides three components by four', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 15, devoir: 14, exam: 30 },
    { stage: 'secondary', yearLevel: 's2', category: 'other', examScale: 40, coeff: 2 }
  );
  assert.equal(result.avg, 14.75);
});

test('secondary projects and reading add only excess above ten', () => {
  const result = engine.computeHomeroomStudent(
    { grades: { math: 14 }, projectScore: 15, readingScore: 12, t2Avg: 0, t3Avg: 0 },
    { stage: 'secondary', preset: 'sec_sci', activeTerm: 1, subjects: [{ id: 'math', coeff: 1 }] }
  );
  assert.equal(result.bonusProject, 5);
  assert.equal(result.bonusReading, 2);
  assert.equal(result.totalBonus, 7);
  assert.equal(result.termAvg, 21);
});

test('first-grade automatic promotion requires regular attendance', () => {
  const homeroom = { stage: 'primary', preset: 'pri_y1', activeTerm: 1, subjects: [{ id: 'arab', coeff: 1 }] };
  const present = engine.computeHomeroomStudent({ grades: { arab: 0 }, attendanceRegular: true }, homeroom);
  const unknown = engine.computeHomeroomStudent({ grades: { arab: 0 }, attendanceRegular: false }, homeroom);
  assert.equal(present.autoPassEligible, true);
  assert.equal(unknown.autoPassEligible, false);
});

test('CSV parser preserves decimal commas when semicolon is the delimiter', () => {
  const rows = engine.parseCsvRows('الاسم;التقييم المستمر\n"بن علي، محمد";13,5');
  assert.deepEqual(JSON.parse(JSON.stringify(rows)), [['الاسم', 'التقييم المستمر'], ['بن علي، محمد', '13,5']]);
});

test('schedule blocks a second test for the same subject in the same term', () => {
  const existing = { stage: 'middle', groupId: 'g1', groupName: 'القسم 2م1', term: 1, subjectName: 'الرياضيات', testDate: '2026-11-01' };
  engine.setScheduleState({ assessmentSchedule: [existing], closedWeeks: [] });
  const candidate = { stage: 'middle', groupId: 'g2', groupName: 'القسم 2م1', term: 1, subjectName: 'الرياضيات', testDate: '2026-11-04', correctionDate: '2026-11-05', remediationDate: '2026-11-06', examStartDate: '2026-11-15' };
  assert.match(engine.validateScheduledTest(candidate), /فرض مسجل مسبقاً/);
});

test('schedule permits at most two tests per class per day', () => {
  const existing = [
    { stage: 'middle', groupId: 'g1', groupName: 'القسم 2م1', term: 1, subjectName: 'العربية', testDate: '2026-11-01' },
    { stage: 'middle', groupId: 'g2', groupName: 'القسم 2م1', term: 1, subjectName: 'الرياضيات', testDate: '2026-11-01' }
  ];
  engine.setScheduleState({ assessmentSchedule: existing, closedWeeks: [] });
  const candidate = { stage: 'middle', groupId: 'g1', groupName: 'القسم 2م1', term: 1, subjectName: 'العلوم', testDate: '2026-11-01', correctionDate: '2026-11-02', remediationDate: '2026-11-03', examStartDate: '2026-11-15' };
  assert.match(engine.validateScheduledTest(candidate), /فرضين في اليوم/);
});

test('schedule blocks tests inside the closed week', () => {
  engine.setScheduleState({ assessmentSchedule: [], closedWeeks: [{ stage: 'middle', groupId: 'g2', groupName: 'القسم 2م1', startDate: '2026-11-01', endDate: '2026-11-07' }] });
  const candidate = { stage: 'middle', groupId: 'g1', groupName: 'القسم 2م1', term: 1, subjectName: 'العلوم', testDate: '2026-11-04', correctionDate: '2026-11-05', remediationDate: '2026-11-06', examStartDate: '2026-11-20' };
  assert.match(engine.validateScheduledTest(candidate), /الأسبوع المغلق/);
});

test('schedule requires correction and remediation seven days before exams', () => {
  engine.setScheduleState({ assessmentSchedule: [], closedWeeks: [] });
  const candidate = { stage: 'middle', groupId: 'g1', term: 1, subjectName: 'العلوم', testDate: '2026-11-01', correctionDate: '2026-11-09', remediationDate: '2026-11-10', examStartDate: '2026-11-15' };
  assert.match(engine.validateScheduledTest(candidate), /بسبعة أيام/);
});

test('secondary project and reading marks are flagged when reused from subject tests', () => {
  const result = engine.computeHomeroomStudent(
    { grades: { math: 14 }, projectScore: 15, readingScore: 14, examMarks: { math: 15 }, devoirMarks: { math: 14 }, t2Avg: 0, t3Avg: 0 },
    { stage: 'secondary', preset: 'sec_sci', activeTerm: 1, subjects: [{ id: 'math', coeff: 1 }] }
  );
  assert.equal(result.warnings.length, 2);
});

test('HTML escaping treats imported student names as text', () => {
  assert.equal(engine.escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});

test('Google Sheets edit links are normalized to CSV export URLs', () => {
  assert.equal(
    engine.googleSheetsCsvUrl('https://docs.google.com/spreadsheets/d/abc123/edit#gid=42'),
    'https://docs.google.com/spreadsheets/d/abc123/export?format=csv&gid=42'
  );
});

test('legacy migration removes seeded demo records but preserves custom student rows', () => {
  const legacy = {
    teacherName: 'الأستاذ(ة): بن سالم عبد القادر',
    schoolName: 'مؤسسة التربية والتعليم - سيدي داود (بومرداس)',
    groups: [{ id: 'grp_pri_1', stage: 'primary', students: [{ id: 'p1', name: 'sample' }, { id: 'custom-1', name: 'real student' }] }],
    homeroomByStage: { primary: { className: 'السنة 3 ابتدائي - الفوج 1', students: [{ id: 'hp1', name: 'sample' }, { id: 'custom-2', name: 'real student' }] } }
  };
  const migrated = engine.migrateLegacyState(legacy);
  assert.equal(migrated.groups[0].students.length, 1);
  assert.equal(migrated.groups[0].students[0].id, 'custom-1');
  assert.equal(migrated.homeroomByStage.primary.students.length, 1);
  assert.equal(migrated.teacherName, '');
  assert.equal(migrated.schoolName, '');
});

test('primary term-one language exceptions remain qualitative only', () => {
  assert.equal(engine.isPrimaryQualitativeOnly({ stage: 'primary', yearLevel: 'p3', term: 1, category: 'pri_eng_p3' }), true);
  assert.equal(engine.isPrimaryQualitativeOnly({ stage: 'primary', yearLevel: 'p4', term: 1, category: 'pri_fr_amz_p4' }), true);
  assert.equal(engine.isPrimaryQualitativeOnly({ stage: 'primary', yearLevel: 'p3', term: 2, category: 'pri_eng_p3' }), false);
});

test('unassessed first-grade student does not receive a default qualitative level', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 0, exam: 0, qualLevel: '' },
    { stage: 'primary', yearLevel: 'p1', category: 'pri_core', term: 1, coeff: 1 }
  );
  assert.equal(result.qualInfo.label, 'لم يقيّم بعد');
  assert.equal(result.avg, 0);
});

test('empty assessment marks do not trigger duplicate-source warnings', () => {
  const result = engine.computeStudentSubjectGrade(
    { cont: 0, devoir: 0, exam: 0, extra: 0 },
    { stage: 'middle', yearLevel: 'm1', category: 'mid_standard', examScale: 20, coeff: 1 }
  );
  assert.deepEqual(JSON.parse(JSON.stringify(result.warnings)), []);
});

test('French middle-school exams are identified as 90 minutes in every grade', () => {
  for (const level of ['m1', 'm2', 'm3', 'm4']) {
    assert.equal(engine.getMiddleExamDuration('اللغة الفرنسية', 'middle', level), 90);
  }
  assert.equal(engine.getMiddleExamDuration('الرياضيات', 'middle', 'm1'), null);
  assert.equal(engine.getMiddleExamDuration('اللغة الفرنسية', 'secondary', 's1'), null);
});
