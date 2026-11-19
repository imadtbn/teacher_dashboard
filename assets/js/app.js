(function () {
  const STORAGE_KEY = 'dz_teacher_grade_dashboard_v4_multi';
  const LEGACY_STORAGE_KEY = 'dz_teacher_grade_dashboard_v3_multi';

  const STAGE_META = {
    primary: {
      id: 'primary',
      title: 'طور التعليم الابتدائي',
      badge: 'سلم التنقيط /10 + التقييم الوصفي',
      color: 'sky',
      scaleMax: 10,
      passMark: 5,
      levels: [
        { value: 'p1', label: 'السنة 1 ابتدائي (تقييم وصفي + انتقال آلي)' },
        { value: 'p2', label: 'السنة 2 ابتدائي' },
        { value: 'p3', label: 'السنة 3 ابتدائي (إنجليزية وصفية في ف1)' },
        { value: 'p4', label: 'السنة 4 ابتدائي (فرنسية وأمازيغية وصفية في ف1)' },
        { value: 'p5', label: 'السنة 5 ابتدائي' }
      ],
      categories: [
        { value: 'pri_core', label: 'مادة أساسية (تقييم مستمر للميادين + اختبار /10)' },
        { value: 'pri_activity', label: 'تربية فنية/بدنية (تقييم مستمر فقط بدون اختبار)' },
        { value: 'pri_eng_p3', label: 'اللغة الإنجليزية - سنة 3 (وصفي في الفصل 1)' },
        { value: 'pri_fr_amz_p4', label: 'الفرنسية / الأمازيغية - سنة 4 (وصفي في الفصل 1)' }
      ],
      presets: [
        { value: 'pri_y1', label: 'السنة الأولى ابتدائي (تقييم وصفي + انتقال آلي)' },
        { value: 'pri_y2', label: 'السنة الثانية ابتدائي (/10)' },
        { value: 'pri_y3', label: 'السنة الثالثة ابتدائي (إنجليزية وصفية في ف1)' },
        { value: 'pri_y4', label: 'السنة الرابعة ابتدائي (فرنسية وأمازيغية وصفية في ف1)' },
        { value: 'pri_y5', label: 'السنة الخامسة ابتدائي (/10)' }
      ]
    },
    middle: {
      id: 'middle',
      title: 'طور التعليم المتوسط',
      badge: 'سلم /20 • م.ت.م = (نشاطات+فرض)÷2 • م.ف.م.ت ÷3',
      color: 'emerald',
      scaleMax: 20,
      passMark: 10,
      levels: [
        { value: 'm1', label: 'السنة 1 متوسط' },
        { value: 'm2', label: 'السنة 2 متوسط' },
        { value: 'm3', label: 'السنة 3 متوسط' },
        { value: 'm4', label: 'السنة 4 متوسط' }
      ],
      categories: [
        { value: 'mid_standard', label: 'مادة مقررة: (م.ت.م + الاختبار/40) ÷ 3' }
      ],
      presets: [
        { value: 'mid_y1', label: 'السنة الأولى متوسط' },
        { value: 'mid_y2', label: 'السنة الثانية متوسط' },
        { value: 'mid_y3', label: 'السنة الثالثة متوسط' },
        { value: 'mid_y4', label: 'السنة الرابعة متوسط (شهادة التعليم المتوسط)' }
      ]
    },
    secondary: {
      id: 'secondary',
      title: 'طور التعليم الثانوي العام والتكنولوجي',
      badge: 'سلم /20 • لغات وتطبيقي ÷5 • بقية المواد ÷4 • مشاريع ومطالعة',
      color: 'teal',
      scaleMax: 20,
      passMark: 10,
      levels: [
        { value: 's1', label: 'السنة 1 ثانوي (جذع مشترك)' },
        { value: 's2', label: 'السنة 2 ثانوي' },
        { value: 's3', label: 'السنة 3 ثانوي (بكالوريا)' }
      ],
      categories: [
        { value: 'languages', label: 'مواد اللغات (مستمر + فرض + شفوي + اختبار/40) ÷ 5' },
        { value: 'practical', label: 'مواد الأعمال التطبيقية (مستمر + فرض + تطبيقي + اختبار/40) ÷ 5' },
        { value: 'other', label: 'بقية المواد (مستمر + فرض + اختبار/40) ÷ 4' }
      ],
      presets: [
        { value: 'sec_sci', label: 'جذع مشترك علوم وتكنولوجيا / علوم تجريبية' },
        { value: 'sec_math', label: 'شعبة الرياضيات / تقني رياضي' },
        { value: 'sec_lit', label: 'جذع مشترك آداب / آداب وفلسفة' },
        { value: 'sec_lang', label: 'شعبة لغات أجنبية' },
        { value: 'sec_eco', label: 'شعبة تسيير واقتصاد' }
      ]
    }
  };

  const QUALITATIVE_LEVELS = [
    { value: 'A', label: 'تحكم أقصى (ممتاز)', numEquiv: 9.5 },
    { value: 'B', label: 'تحكم مقبول (جيد)', numEquiv: 7.5 },
    { value: 'C', label: 'تحكم جزئي (متوسط)', numEquiv: 5.5 },
    { value: 'D', label: 'تحكم أدنى (يحتاج لمرافقة)', numEquiv: 3.5 }
  ];

  const HOMEROOM_SUBJECT_PRESETS = {
    pri_y1: [
      { id: 'arab', name: 'اللغة العربية', coeff: 1 },
      { id: 'math', name: 'الرياضيات', coeff: 1 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'sci', name: 'التربية العلمية والتكنولوجية', coeff: 1 },
      { id: 'art', name: 'التربية الفنية والبدنية', coeff: 1 }
    ],
    pri_y2: [
      { id: 'arab', name: 'اللغة العربية', coeff: 1 },
      { id: 'math', name: 'الرياضيات', coeff: 1 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'sci', name: 'التربية العلمية والتكنولوجية', coeff: 1 },
      { id: 'art', name: 'التربية الفنية والبدنية', coeff: 1 }
    ],
    pri_y3: [
      { id: 'arab', name: 'اللغة العربية', coeff: 1 },
      { id: 'math', name: 'الرياضيات', coeff: 1 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 1 },
      { id: 'en', name: 'اللغة الإنجليزية (وصفية ف1)', coeff: 1, qualInT1: true },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 1 },
      { id: 'sci', name: 'التربية العلمية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'art', name: 'التربية الفنية والبدنية', coeff: 1 }
    ],
    pri_y4: [
      { id: 'arab', name: 'اللغة العربية', coeff: 1 },
      { id: 'math', name: 'الرياضيات', coeff: 1 },
      { id: 'fr', name: 'اللغة الفرنسية (وصفية ف1)', coeff: 1, qualInT1: true },
      { id: 'amz', name: 'اللغة الأمازيغية (وصفية ف1)', coeff: 1, qualInT1: true },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 1 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 1 },
      { id: 'sci', name: 'التربية العلمية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'art', name: 'التربية الفنية والبدنية', coeff: 1 }
    ],
    pri_y5: [
      { id: 'arab', name: 'اللغة العربية', coeff: 1 },
      { id: 'math', name: 'الرياضيات', coeff: 1 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 1 },
      { id: 'amz', name: 'اللغة الأمازيغية', coeff: 1 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 1 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 1 },
      { id: 'sci', name: 'التربية العلمية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'art', name: 'التربية الفنية والبدنية', coeff: 1 }
    ],
    mid_y1: [
      { id: 'arab', name: 'اللغة العربية', coeff: 2 },
      { id: 'math', name: 'الرياضيات', coeff: 2 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 1 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 1 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 2 },
      { id: 'phys', name: 'العلوم الفيزيائية', coeff: 1 },
      { id: 'snv', name: 'علوم الطبيعة والحياة', coeff: 1 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'sport', name: 'التربية البدنية والفنية', coeff: 1 }
    ],
    mid_y2: [
      { id: 'arab', name: 'اللغة العربية', coeff: 3 },
      { id: 'math', name: 'الرياضيات', coeff: 3 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 2 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 1 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 2 },
      { id: 'phys', name: 'العلوم الفيزيائية', coeff: 2 },
      { id: 'snv', name: 'علوم الطبيعة والحياة', coeff: 2 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'sport', name: 'التربية البدنية والفنية', coeff: 1 }
    ],
    mid_y3: [
      { id: 'arab', name: 'اللغة العربية', coeff: 3 },
      { id: 'math', name: 'الرياضيات', coeff: 3 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 2 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 1 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 2 },
      { id: 'phys', name: 'العلوم الفيزيائية', coeff: 2 },
      { id: 'snv', name: 'علوم الطبيعة والحياة', coeff: 2 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 1 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'sport', name: 'التربية البدنية والفنية', coeff: 1 }
    ],
    mid_y4: [
      { id: 'arab', name: 'اللغة العربية', coeff: 5 },
      { id: 'math', name: 'الرياضيات', coeff: 4 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 3 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 2 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 3 },
      { id: 'phys', name: 'العلوم الفيزيائية', coeff: 2 },
      { id: 'snv', name: 'علوم الطبيعة والحياة', coeff: 2 },
      { id: 'isl', name: 'التربية الإسلامية', coeff: 2 },
      { id: 'civ', name: 'التربية المدنية', coeff: 1 },
      { id: 'sport', name: 'التربية البدنية والفنية', coeff: 1 }
    ],
    sec_sci: [
      { id: 'math', name: 'الرياضيات', coeff: 5 },
      { id: 'phys', name: 'العلوم الفيزيائية', coeff: 4 },
      { id: 'snv', name: 'علوم الطبيعة والحياة', coeff: 4 },
      { id: 'arab', name: 'اللغة العربية', coeff: 3 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 2 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 2 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 2 },
      { id: 'isl', name: 'العلوم الإسلامية', coeff: 2 },
      { id: 'info', name: 'المعلوماتية / التكنولوجيا', coeff: 2 },
      { id: 'sport', name: 'التربية البدنية', coeff: 1 }
    ],
    sec_math: [
      { id: 'math', name: 'الرياضيات', coeff: 7 },
      { id: 'phys', name: 'العلوم الفيزيائية', coeff: 6 },
      { id: 'arab', name: 'اللغة العربية', coeff: 3 },
      { id: 'snv', name: 'علوم الطبيعة / التكنولوجيا', coeff: 2 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 2 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 2 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 2 },
      { id: 'isl', name: 'العلوم الإسلامية', coeff: 2 },
      { id: 'sport', name: 'التربية البدنية', coeff: 1 }
    ],
    sec_lit: [
      { id: 'arab', name: 'اللغة العربية وآدابها', coeff: 5 },
      { id: 'phil', name: 'الفلسفة', coeff: 5 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 4 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 3 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 3 },
      { id: 'isl', name: 'العلوم الإسلامية', coeff: 2 },
      { id: 'math', name: 'الرياضيات', coeff: 2 },
      { id: 'sport', name: 'التربية البدنية', coeff: 1 }
    ],
    sec_lang: [
      { id: 'arab', name: 'اللغة العربية', coeff: 4 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 4 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 4 },
      { id: 'lang3', name: 'اللغة الأجنبية الثالثة', coeff: 4 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 2 },
      { id: 'isl', name: 'العلوم الإسلامية', coeff: 2 },
      { id: 'math', name: 'الرياضيات', coeff: 2 },
      { id: 'sport', name: 'التربية البدنية', coeff: 1 }
    ],
    sec_eco: [
      { id: 'acc', name: 'التسيير المحاسبي والمالي', coeff: 5 },
      { id: 'eco', name: 'الاقتصاد والمناجمنت', coeff: 4 },
      { id: 'math', name: 'الرياضيات', coeff: 4 },
      { id: 'hist', name: 'التاريخ والجغرافيا', coeff: 4 },
      { id: 'arab', name: 'اللغة العربية', coeff: 3 },
      { id: 'law', name: 'القانون', coeff: 2 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 2 },
      { id: 'en', name: 'اللغة الإنجليزية', coeff: 2 },
      { id: 'isl', name: 'العلوم الإسلامية', coeff: 2 },
      { id: 'sport', name: 'التربية البدنية', coeff: 1 }
    ]
  };

  function getDefaultState() {
    const makeHomeroom = (stage, preset) => ({
      stage, preset, className: '', activeTerm: 1,
      subjects: JSON.parse(JSON.stringify(HOMEROOM_SUBJECT_PRESETS[preset] || [])),
      students: []
    });
    return {
      teacherName: '', schoolName: '', schoolYear: '2026 / 2027',
      currentPage: 'home',
      stageSubTab: { primary: 'subject', middle: 'subject', secondary: 'subject' },
      activeGroupByStage: { primary: '', middle: '', secondary: '' },
      groups: [],
      assessmentSchedule: [],
      closedWeeks: [],
      homeroomByStage: {
        primary: makeHomeroom('primary', 'pri_y3'),
        middle: makeHomeroom('middle', 'mid_y4'),
        secondary: makeHomeroom('secondary', 'sec_sci')
      }
    };
  }

  function migrateLegacyState(parsed) {
    if (!parsed || !Array.isArray(parsed.groups) || !parsed.homeroomByStage) return null;
    const demoSubjectStudentIds = new Set(['p1','p2','p3','p4','p1_1','p1_2','p1_3','m1','m2','m3','m4','m5','s1','s2','s3','s4','s5','s6']);
    const demoHomeroomStudentIds = new Set(['hp1','hp2','hp3','hm1','hm2','hm3','hm4','hs1','hs2','hs3','hs4']);
    parsed.groups = parsed.groups.filter(Boolean).map(group => ({
      ...group,
      students: (Array.isArray(group.students) ? group.students : []).filter(student => student && !demoSubjectStudentIds.has(String(student.id)))
    })).filter(group => group.students.length > 0 || (!/^grp_(pri|mid|sec)_1$/.test(String(group.id || '')) && group.id !== 'grp_pri_2'));
    Object.values(parsed.homeroomByStage).forEach(hr => {
      if (!hr) return;
      hr.students = (Array.isArray(hr.students) ? hr.students : []).filter(student => student && !demoHomeroomStudentIds.has(String(student.id)));
      if (/^(السنة 3 ابتدائي - الفوج 1|السنة 4 متوسط - القسم 1|2 ثانوي علوم تجريبية 1)$/.test(hr.className || '')) hr.className = '';
    });
    if (parsed.teacherName === 'الأستاذ(ة): بن سالم عبد القادر') parsed.teacherName = '';
    if (parsed.schoolName === 'مؤسسة التربية والتعليم - سيدي داود (بومرداس)') parsed.schoolName = '';
    parsed.assessmentSchedule = Array.isArray(parsed.assessmentSchedule) ? parsed.assessmentSchedule : [];
    parsed.closedWeeks = Array.isArray(parsed.closedWeeks) ? parsed.closedWeeks : [];
    parsed.activeGroupByStage = parsed.activeGroupByStage || { primary: '', middle: '', secondary: '' };
    Object.keys(parsed.activeGroupByStage).forEach(stage => {
      if (!parsed.groups.some(group => group.stage === stage && group.id === parsed.activeGroupByStage[stage])) parsed.activeGroupByStage[stage] = '';
    });
    return parsed;
  }

  let state = loadState();
  let searchSubjectQuery = '';
  let activeRubricStudentId = null;
  let chartInstances = { brackets: null, awards: null, components: null };

  function loadState() {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEY);
      if (currentRaw) {
        const current = JSON.parse(currentRaw);
        if (current && Array.isArray(current.groups) && current.homeroomByStage) return current;
      }
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const migrated = migrateLegacyState(JSON.parse(legacyRaw));
        if (migrated) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
    } catch (error) {
      console.error('تعذر تحميل بيانات لوحة الأستاذ:', error);
    }
    return getDefaultState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    syncProfileUI();
  }

  function showToast(msg, icon = '✅') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastMessage').textContent = msg;
    container.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      container.classList.add('hidden');
    }, 3000);
  }

  function clamp(val, min, max) {
    const n = parseFloat(val);
    if (isNaN(n)) return 0;
    return Math.min(max, Math.max(min, n));
  }

  function getActiveStage() {
    // Check if body has a fixed stage attribute (for standalone primary.html, middle.html, secondary.html)
    const bodyStage = document.body.getAttribute('data-fixed-stage');
    if (bodyStage && STAGE_META[bodyStage]) return bodyStage;
    if (STAGE_META[state.currentPage]) return state.currentPage;
    return 'secondary';
  }

  function getStageGroups(stage) {
    return state.groups.filter(g => g.stage === stage);
  }

  function getCurrentStageGroup(stage) {
    const stageGroups = getStageGroups(stage);
    const activeId = state.activeGroupByStage[stage];
    return stageGroups.find(g => g.id === activeId) || stageGroups[0];
  }

  function getStageHomeroom(stage) {
    return state.homeroomByStage[stage] || state.homeroomByStage.secondary;
  }
  function normalizeStudentName(value) {
    return String(value || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ar');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function createStudentId(prefix) {
    return (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  }

  function normalizeImportHeader(value) {
    return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('ar').replace(/[\s_\-./()]+/g, '');
  }

  function parseCsvRows(text) {
    const rows = [];
    let row = [], cell = '', quoted = false;
    const source = String(text || '').replace(/^\uFEFF/, '');
    const firstLine = source.split(/\r?\n/).find(line => line.trim()) || '';
    const delimiterCounts = ['\t', ';', ','].map(delimiter => {
      let count = 0, inQuotes = false;
      for (let i = 0; i < firstLine.length; i++) {
        if (firstLine[i] === '"') inQuotes = !inQuotes;
        else if (firstLine[i] === delimiter && !inQuotes) count++;
      }
      return count;
    });
    const delimiter = delimiterCounts[0] > 0 ? '\t' : delimiterCounts[1] > 0 ? ';' : ',';
    for (let i = 0; i < source.length; i++) {
      const ch = source[i];
      if (ch === '"' && quoted && source[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = !quoted;
      else if (ch === delimiter && !quoted) { row.push(cell.trim()); cell = ''; }
      else if ((ch === '\n' || ch === '\r') && !quoted) {
        if (ch === '\r' && source[i + 1] === '\n') i++;
        row.push(cell.trim());
        if (row.some(value => value !== '')) rows.push(row);
        row = []; cell = '';
      } else cell += ch;
    }
    row.push(cell.trim());
    if (row.some(value => value !== '')) rows.push(row);
    return rows;
  }

  function importHeaderIndex(headers, aliases) {
    const normalized = headers.map(normalizeImportHeader);
    return normalized.findIndex(value => aliases.some(alias => value === normalizeImportHeader(alias) || value.includes(normalizeImportHeader(alias))));
  }

  function importNumber(row, headers, aliases, min, max) {
    const index = importHeaderIndex(headers, aliases);
    if (index < 0 || row[index] === undefined || String(row[index]).trim() === '') return null;
    const value = Number(String(row[index]).replace(',', '.'));
    return Number.isFinite(value) ? clamp(value, min, max) : null;
  }

  function importRosterRows(inputRows, target) {
    const stage = getActiveStage();
    const group = getCurrentStageGroup(stage);
    const homeroom = getStageHomeroom(stage);
    const rows = (inputRows || []).filter(row => Array.isArray(row) && row.some(cell => String(cell || '').trim()));
    if (!rows.length) return { added: 0, skipped: 0, updated: 0 };

    const nameAliases = ['الاسم واللقب','اللقب والاسم','اسم التلميذ','اسم الطالب','التلميذ','الاسم الكامل','الاسم','nom et prenom','nom complet','student name','name'];
    let headerIndex = rows.findIndex(row => row.some(cell => nameAliases.some(alias => normalizeImportHeader(cell).includes(normalizeImportHeader(alias)))));
    const hasHeader = headerIndex >= 0;
    const headers = hasHeader ? rows[headerIndex].map(String) : [];
    const dataRows = hasHeader ? rows.slice(headerIndex + 1) : rows;
    const surnameIndex = hasHeader ? importHeaderIndex(headers, ['اللقب','النسب','nom','surname','last name']) : -1;
    const firstNameIndex = hasHeader ? importHeaderIndex(headers, ['الاسم','prénom','prenom','first name']) : -1;
    const nameIndex = hasHeader ? importHeaderIndex(headers, nameAliases) : 0;

    const existingSubject = new Set((group?.students || []).map(student => normalizeStudentName(student.name)));
    const existingHomeroom = new Set(homeroom.students.map(student => normalizeStudentName(student.name)));
    let added = 0, skipped = 0, updated = 0;

    dataRows.forEach(row => {
      const cells = row.map(value => String(value == null ? '' : value).trim());
      let name = '';
      if (hasHeader && surnameIndex >= 0 && firstNameIndex >= 0 && surnameIndex !== firstNameIndex) {
        name = [cells[surnameIndex], cells[firstNameIndex]].filter(Boolean).join(' ');
      } else if (hasHeader && nameIndex >= 0) {
        name = cells[nameIndex] || '';
      } else {
        const textCells = cells.filter(value => value.length >= 2 && !/^[0-9.,/-]+$/.test(value));
        name = textCells.length ? textCells.slice(0, 2).join(' ') : '';
      }
      name = name.trim().replace(/\s+/g, ' ');
      if (!name) return;

      const key = normalizeStudentName(name);
      const wantsSubject = target === 'subject' || target === 'both';
      const wantsHomeroom = target === 'homeroom' || target === 'both';
      if (wantsSubject && !group) { skipped++; return; }
      if ((wantsSubject && existingSubject.has(key)) || (wantsHomeroom && existingHomeroom.has(key))) { skipped++; return; }

      const studentKey = createStudentId('student');
      if (wantsSubject) {
        const student = { id: createStudentId('st'), studentKey, name, cont: 0, devoir: 0, extra: 0, exam: 0, qualLevel: '', customRemark: '', rubric: {} };
        if (hasHeader) {
          const max = stage === 'primary' ? 10 : 20;
          const cont = importNumber(cells, headers, ['التقييم المستمر','تقييم النشاطات','النشاطات','المستمر','continuous','cont'], 0, max);
          const devoir = importNumber(cells, headers, ['الفرض','علامة الفرض','devoir','assignment'], 0, 20);
          const extra = importNumber(cells, headers, ['التعبير الشفوي','الأعمال التطبيقية','الشفوي','التطبيقي','oral','practical','extra'], 0, 20);
          const examMax = stage === 'primary' ? 10 : Number(group.examScale) === 20 ? 20 : 40;
          const exam = importNumber(cells, headers, ['الاختبار','علامة الاختبار','exam'], 0, examMax);
          if (cont !== null) student.cont = cont;
          if (devoir !== null) student.devoir = devoir;
          if (extra !== null) student.extra = extra;
          if (exam !== null) student.exam = exam;
        }
        group.students.push(student);
        existingSubject.add(key);
        added++;
      }
      if (wantsHomeroom) {
        const linked = wantsSubject ? group.students.find(student => student.studentKey === studentKey) : null;
        const grades = {};
        homeroom.subjects.forEach(subject => {
          let grade = hasHeader ? importNumber(cells, headers, [subject.name, subject.id], 0, stage === 'primary' ? 10 : 20) : null;
          grades[subject.id] = grade === null ? 0 : grade;
        });
        const examMarks = {}, devoirMarks = {};
        homeroom.subjects.forEach(subject => {
          const exam = hasHeader ? importNumber(cells, headers, [subject.name + ' اختبار', 'اختبار ' + subject.name, subject.id + '_exam'], 0, 40) : null;
          const devoir = hasHeader ? importNumber(cells, headers, [subject.name + ' فرض', 'فرض ' + subject.name, subject.id + '_devoir'], 0, 20) : null;
          if (exam !== null) examMarks[subject.id] = exam > 20 ? exam / 2 : exam;
          if (devoir !== null) devoirMarks[subject.id] = devoir;
        });
        const student = { id: createStudentId('hr'), studentKey: linked?.studentKey || studentKey, name, grades, projectScore: 0, readingScore: 0, examMarks, devoirMarks, t2Avg: 0, t3Avg: 0, attendanceRegular: false };
        if (hasHeader) {
          const project = importNumber(cells, headers, ['المشاريع الدراسية','المشروع','project'], 0, 20);
          const reading = importNumber(cells, headers, ['المطالعة','القراءة','reading'], 0, 20);
          const t2 = importNumber(cells, headers, ['معدل الفصل الثاني','الفصل الثاني','t2avg'], 0, stage === 'primary' ? 10 : 20);
          const t3 = importNumber(cells, headers, ['معدل الفصل الثالث','الفصل الثالث','t3avg'], 0, stage === 'primary' ? 10 : 20);
          if (project !== null) student.projectScore = project;
          if (reading !== null) student.readingScore = reading;
          if (t2 !== null) student.t2Avg = t2;
          if (t3 !== null) student.t3Avg = t3;
        }
        homeroom.students.push(student);
        existingHomeroom.add(key);
        if (!wantsSubject) added++;
      }
    });
    return { added, skipped, updated };
  }

  function googleSheetsCsvUrl(value) {
    const url = new URL(String(value || '').trim());
    if (!['docs.google.com', 'drive.google.com'].includes(url.hostname)) throw new Error('أدخل رابط Google Sheets صالحاً');
    if (url.pathname.includes('/spreadsheets/d/e/') && url.pathname.includes('/pub')) {
      url.searchParams.set('output', 'csv');
      return url.toString();
    }
    const match = url.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) throw new Error('الرابط لا يشير إلى جدول بيانات Google Sheets');
    const gid = url.searchParams.get('gid') || (url.hash.match(/gid=(\d+)/) || [])[1] || '0';
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
  }

  function renderScheduleManager() {
    const stage = getActiveStage();
    const group = getCurrentStageGroup(stage);
    const list = document.getElementById('scheduleEntriesList');
    const closedList = document.getElementById('closedWeeksList');
    const subjectInput = document.getElementById('scheduleSubject');
    const termInput = document.getElementById('scheduleTerm');
    if (subjectInput && group && !subjectInput.value) subjectInput.value = group.subjectName || '';
    if (termInput && group) termInput.value = String(group.term || 1);

    if (list) {
      const entries = state.assessmentSchedule.filter(item => item.stage === stage && (!group || item.groupId === group.id));
      list.innerHTML = entries.length ? entries.map(item => `
        <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs">
          <div><strong>${escapeHtml(item.subjectName)}</strong><span class="mx-1 text-slate-500">— الفصل ${escapeHtml(item.term)}</span><span class="text-slate-600">فرض: ${escapeHtml(item.testDate)}</span><span class="block text-slate-500">التصحيح: ${escapeHtml(item.correctionDate)} | المعالجة: ${escapeHtml(item.remediationDate)} | الاختبارات: ${escapeHtml(item.examStartDate)}</span></div>
          <button type="button" data-delete-schedule="${escapeHtml(item.id)}" class="rounded bg-rose-50 px-2 py-1 font-bold text-rose-700">حذف</button>
        </div>`).join('') : '<p class="text-xs text-slate-500">لا توجد فروض مجدولة لهذا الفوج.</p>';
    }
    if (closedList) {
      const ranges = state.closedWeeks.filter(item => item.stage === stage && (!group || item.groupId === group.id));
      closedList.innerHTML = ranges.length ? ranges.map(item => `
        <div class="flex items-center justify-between gap-2 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-900">
          <span>أسبوع مغلق: ${escapeHtml(item.startDate)} إلى ${escapeHtml(item.endDate)}</span>
          <button type="button" data-delete-closed-week="${escapeHtml(item.id)}" class="font-bold text-rose-700">حذف</button>
        </div>`).join('') : '<p class="text-xs text-slate-500">لم تُحدد فترة أسبوع مغلق لهذا الفوج.</p>';
    }
  }

  function validateScheduledTest(candidate) {
    const sameGroup = item => item.stage === candidate.stage && item.groupId === candidate.groupId;
    if (state.assessmentSchedule.some(item => sameGroup(item) && Number(item.term) === Number(candidate.term) && normalizeStudentName(item.subjectName) === normalizeStudentName(candidate.subjectName))) {
      return 'يوجد فرض مسجل مسبقاً للمادة نفسها في هذا الفصل.';
    }
    const sameDayCount = state.assessmentSchedule.filter(item => sameGroup(item) && item.testDate === candidate.testDate).length;
    if (sameDayCount >= 2) return 'لا يمكن برمجة أكثر من فرضين في اليوم نفسه للقسم.';
    const inClosedWeek = state.closedWeeks.some(item => sameGroup(item) && candidate.testDate >= item.startDate && candidate.testDate <= item.endDate);
    if (inClosedWeek) return 'التاريخ المختار يقع ضمن الأسبوع المغلق.';
    if (candidate.testDate >= candidate.examStartDate) return 'يجب أن يسبق الفرض تاريخ انطلاق الاختبارات الفصلية.';
    const deadline = new Date(candidate.examStartDate + 'T00:00:00');
    deadline.setDate(deadline.getDate() - 7);
    const latestAllowed = [deadline.getFullYear(), String(deadline.getMonth() + 1).padStart(2, '0'), String(deadline.getDate()).padStart(2, '0')].join('-');
    if (candidate.correctionDate > latestAllowed || candidate.remediationDate > latestAllowed) return 'يجب إنهاء التصحيح والمعالجة قبل الاختبارات بسبعة أيام على الأقل.';
    if (candidate.correctionDate < candidate.testDate || candidate.remediationDate < candidate.correctionDate) return 'تحقق من ترتيب تواريخ الفرض والتصحيح والمعالجة.';
    return '';
  }

  function isPrimaryQualitativeOnly(group) {
    if (group.stage !== 'primary') return false;
    if (group.yearLevel === 'p1') return true;
    if (Number(group.term) === 1 && group.yearLevel === 'p3' && group.category === 'pri_eng_p3') return true;
    if (Number(group.term) === 1 && group.yearLevel === 'p4' && group.category === 'pri_fr_amz_p4') return true;
    return false;
  }

  function computeStudentSubjectGrade(student, group) {
    const isPrimary = (group.stage === 'primary');
    const maxBase = isPrimary ? 10 : 20;
    const qualOnly = isPrimaryQualitativeOnly(group);
    const isActivityNoExam = (isPrimary && group.category === 'pri_activity');

    const cont = clamp(student.cont, 0, maxBase);
    const devoir = clamp(student.devoir, 0, maxBase);
    const extra = clamp(student.extra, 0, maxBase);

    let examOn40 = 0, examOn20 = 0, examOn10 = 0;
    if (isPrimary) {
      examOn10 = clamp(student.exam, 0, 10);
      examOn20 = examOn10 * 2;
      examOn40 = examOn10 * 4;
    } else {
      const rawExam = parseFloat(student.exam) || 0;
      examOn40 = Number(group.examScale) === 20 ? clamp(rawExam, 0, 20) * 2 : clamp(rawExam, 0, 40);
      examOn20 = examOn40 / 2;
    }

    let mtm = 0, avg = 0;
    const qualInfo = QUALITATIVE_LEVELS.find(q => q.value === student.qualLevel) || { value: '', label: 'لم يقيّم بعد', numEquiv: 0 };

    if (qualOnly) {
      avg = qualInfo.numEquiv;
      mtm = qualInfo.numEquiv;
    } else if (isPrimary) {
      avg = isActivityNoExam ? cont : (cont + examOn10) / 2;
      mtm = cont;
    } else if (group.stage === 'middle') {
      mtm = (cont + devoir) / 2;
      avg = (mtm + examOn40) / 3;
    } else {
      if (group.category === 'languages' || group.category === 'practical') {
        avg = (cont + devoir + extra + examOn40) / 5;
      } else {
        avg = (cont + devoir + examOn40) / 4;
      }
      mtm = (group.category === 'other') ? ((cont + devoir) / 2) : ((cont + devoir + extra) / 3);
    }

    const warnings = [];
    if (!isPrimary) {
      if (Math.abs(cont - devoir) < 0.001 || Math.abs(cont - examOn20) < 0.001) {
        warnings.push(`تطابق نقطة التقييم المستمر/النشاطات (${cont}) مع نقطة الفرض أو الاختبار`);
      }
      if (group.stage === 'secondary' && (group.category === 'languages' || group.category === 'practical')) {
        const extraName = group.category === 'languages' ? 'التعبير الشفوي' : 'الأعمال التطبيقية';
        if (Math.abs(extra - devoir) < 0.001 || Math.abs(extra - examOn20) < 0.001) {
          warnings.push(`تطابق نقطة ${extraName} (${extra}) مع نقطة الفرض أو الاختبار`);
        }
      }
    }

    const coeff = Math.max(1, parseInt(group.coeff, 10) || 1);
    const weighted = avg * coeff;
    const autoRemark = qualOnly
      ? `${qualInfo.label} ${group.yearLevel === 'p1' ? '— تقييم وصفي نوعي، والانتقال مشروط بالمواظبة المنتظمة' : '— تقييم وصفي نوعي (ف1)'}`
      : generatePedagogicalRemark(avg, maxBase, isPrimary ? examOn10 : examOn20);

    return {
      isPrimary, qualOnly, isActivityNoExam, qualInfo,
      cont, devoir, extra, examOn10, examOn20, examOn40, mtm, avg, weighted, warnings,
      remark: student.customRemark && student.customRemark.trim() !== '' ? student.customRemark : autoRemark
    };
  }

  function generatePedagogicalRemark(avg, scaleMax, examNorm) {
    const ratio = avg / scaleMax;
    if (ratio >= 0.9) return 'تحكم ممتاز جداً، واصل التألق';
    if (ratio >= 0.8) return 'نتائج جيدة جداً ومجهود مشرف';
    if (ratio >= 0.7) return 'عمل جيد ومنتظم، يمكنك بلوغ التميز';
    if (ratio >= 0.6) return 'نتائج حسنة، واصل الاجتهاد';
    if (ratio >= 0.5) {
      if (examNorm < scaleMax * 0.5) return 'معدل مقبول لكن يحتاج لتدارك النقائص في الاختبار';
      return 'تحكم مقبول، بحاجة لمزيد من التركيز';
    }
    if (ratio >= 0.4) return 'نتائج دون المتوسط، يجب مضاعفة المجهود';
    return 'تحكم أدنى، يحتاج لمرافقة ومعالجة بيداغوجية';
  }

  function computeHomeroomStudent(student, homeroom) {
    const isPrimary = (homeroom.stage === 'primary');
    const isPriY1 = (isPrimary && homeroom.preset === 'pri_y1');
    const scaleMax = isPrimary ? 10 : 20;

    let sumWeightedSubjects = 0, sumCoeffs = 0;
    homeroom.subjects.forEach(sub => {
      if (isPrimary && Number(homeroom.activeTerm) === 1 && sub.qualInT1) return;
      const c = Math.max(1, parseInt(sub.coeff, 10) || 1);
      const g = clamp(student.grades && student.grades[sub.id] !== undefined ? student.grades[sub.id] : 0, 0, scaleMax);
      sumWeightedSubjects += g * c;
      sumCoeffs += c;
    });

    const projectScore = clamp(student.projectScore, 0, 20);
    const readingScore = clamp(student.readingScore, 0, 20);
    const bonusProject = homeroom.stage === 'secondary' ? Math.max(0, projectScore - 10) : 0;
    const bonusReading = homeroom.stage === 'secondary' ? Math.max(0, readingScore - 10) : 0;
    const totalBonus = bonusProject + bonusReading;
    const warnings = [];
    if (homeroom.stage === 'secondary') {
      const assessmentMarks = [...Object.values(student.devoirMarks || {}), ...Object.values(student.examMarks || {})].map(value => clamp(value, 0, 40)).filter(value => value > 0);
      if (projectScore > 0 && assessmentMarks.some(value => Math.abs(value - projectScore) < 0.001)) warnings.push('علامة المشروع تطابق علامة فرض أو اختبار مسجلة لأحد المواد');
      if (readingScore > 0 && assessmentMarks.some(value => Math.abs(value - readingScore) < 0.001)) warnings.push('علامة المطالعة تطابق علامة فرض أو اختبار مسجلة لأحد المواد');
    }

    const finalWeightedSum = sumWeightedSubjects + totalBonus;
    const termAvg = sumCoeffs > 0 ? (finalWeightedSum / sumCoeffs) : 0;
    const t2 = clamp(student.t2Avg !== undefined ? student.t2Avg : termAvg, 0, scaleMax);
    const t3 = clamp(student.t3Avg !== undefined ? student.t3Avg : termAvg, 0, scaleMax);
    const annualAvg = (termAvg + t2 + t3) / 3;

    const autoPassEligible = isPriY1 && student.attendanceRegular === true;
    const award = isPriY1
      ? (autoPassEligible
        ? { label: 'انتقال آلي — مواظب', cls: 'bg-sky-100 text-sky-900 border-sky-300' }
        : { label: 'المواظبة غير مؤكدة', cls: 'bg-amber-100 text-amber-900 border-amber-300' })
      : getCouncilAward(termAvg, scaleMax);

    return {
      isPrimary, isPriY1, scaleMax, sumWeightedSubjects, sumCoeffs,
      projectScore, readingScore, bonusProject, bonusReading, totalBonus,
      finalWeightedSum, termAvg, t2, t3, annualAvg, autoPassEligible, warnings, award
    };
  }

  function getCouncilAward(avg, scaleMax = 20) {
    const norm20 = (scaleMax === 10) ? (avg * 2) : avg;
    if (norm20 >= 18) return { label: 'امتياز', cls: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (norm20 >= 16) return { label: 'تهنئة', cls: 'bg-teal-100 text-teal-900 border-teal-300' };
    if (norm20 >= 14) return { label: 'تشجيع', cls: 'bg-blue-100 text-blue-900 border-blue-300' };
    if (norm20 >= 12) return { label: 'لوحة شرف', cls: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    if (norm20 >= 10) return { label: 'تحكم مقبول', cls: 'bg-slate-100 text-slate-700 border-slate-300' };
    if (norm20 >= 8) return { label: 'إنذار / معالجة', cls: 'bg-amber-100 text-amber-900 border-amber-300' };
    return { label: 'توبيخ / دعم عاجل', cls: 'bg-rose-100 text-rose-900 border-rose-300' };
  }

  function syncProfileUI() {
    const tInput = document.getElementById('teacherNameInput');
    const sInput = document.getElementById('schoolNameInput');
    const yInput = document.getElementById('schoolYearInput');
    if (tInput && document.activeElement !== tInput) tInput.value = state.teacherName || '';
    if (sInput && document.activeElement !== sInput) sInput.value = state.schoolName || '';
    if (yInput && document.activeElement !== yInput) yInput.value = state.schoolYear || '2026 / 2027';

    const pt = document.getElementById('printTeacherName');
    const ps = document.getElementById('printSchoolName');
    const py = document.getElementById('printSchoolYear');
    if (pt) pt.textContent = state.teacherName || '....................';
    if (ps) ps.textContent = state.schoolName || '....................';
    if (py) py.textContent = state.schoolYear || '2026 / 2027';
  }

  // Render Landing Page Summary KPIs
  function renderHomeOverview() {
    syncProfileUI();
    ['primary', 'middle', 'secondary'].forEach(stg => {
      const grps = getStageGroups(stg);
      const hr = getStageHomeroom(stg);
      const totalSubStudents = grps.reduce((acc, g) => acc + g.students.length, 0);
      const gCountEl = document.getElementById(`homeStatGroups_${stg}`);
      const sCountEl = document.getElementById(`homeStatStudents_${stg}`);
      const hClassEl = document.getElementById(`homeStatHomeroom_${stg}`);
      if (gCountEl) gCountEl.textContent = `${grps.length} أفواج`;
      if (sCountEl) sCountEl.textContent = `${totalSubStudents} تلميذ`;
      if (hClassEl) hClassEl.textContent = `${hr.className} (${hr.students.length} تلميذ)`;
    });
  }

  // Render Active Stage Workspace (Primary, Middle, or Secondary)
  function renderStageWorkspace() {
    const stage = getActiveStage();
    const meta = STAGE_META[stage];
    if (!meta) return;

    syncProfileUI();

    // Update Stage Header Banner
    const stgTitle = document.getElementById('stageWorkspaceTitle');
    const stgBadge = document.getElementById('stageWorkspaceBadge');
    if (stgTitle) stgTitle.textContent = meta.title;
    if (stgBadge) stgBadge.textContent = meta.badge;

    // Sub-tabs within the stage page ('subject' | 'homeroom' | 'analytics')
    const subTab = state.stageSubTab[stage] || 'subject';
    const secSub = document.getElementById('stageSectionSubject');
    const secHome = document.getElementById('stageSectionHomeroom');
    const secAna = document.getElementById('stageSectionAnalytics');

    const btnSub = document.getElementById('btnStageSubSubject');
    const btnHome = document.getElementById('btnStageSubHomeroom');
    const btnAna = document.getElementById('btnStageSubAnalytics');

    if (secSub && secHome && secAna) {
      secSub.classList.toggle('hidden', subTab !== 'subject');
      secHome.classList.toggle('hidden', subTab !== 'homeroom');
      secAna.classList.toggle('hidden', subTab !== 'analytics');
    }

    const activeBtnCls = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-900 text-white shadow-sm transition flex items-center gap-1.5';
    const idleBtnCls = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5';
    if (btnSub) btnSub.className = subTab === 'subject' ? activeBtnCls : idleBtnCls;
    if (btnHome) btnHome.className = subTab === 'homeroom' ? activeBtnCls : idleBtnCls;
    if (btnAna) btnAna.className = subTab === 'analytics' ? activeBtnCls : idleBtnCls;

    if (subTab === 'subject') renderSubjectModeForStage(stage);
    if (subTab === 'homeroom') {
      const vbox = document.getElementById('validationAlertBox');
      if (vbox) vbox.classList.add('hidden');
      renderHomeroomModeForStage(stage);
    }
    if (subTab === 'analytics') {
      const vbox = document.getElementById('validationAlertBox');
      if (vbox) vbox.classList.add('hidden');
      renderAnalyticsForStage(stage);
    }
  }

  function renderSubjectModeForStage(stage) {
    const meta = STAGE_META[stage];
    const stageGroups = getStageGroups(stage);
    let group = getCurrentStageGroup(stage);
    if (!group) return;

    const groupSelect = document.getElementById('selectSubjectGroup');
    if (groupSelect) {
      groupSelect.innerHTML = stageGroups.map(g =>
        `<option value="${escapeHtml(g.id)}" ${g.id === group.id ? 'selected' : ''}>${escapeHtml(g.groupName)} — ${escapeHtml(g.subjectName)}</option>`
      ).join('');
    }

    const levelSelect = document.getElementById('subjectYearLevelSelect');
    if (levelSelect) {
      if (!meta.levels.some(l => l.value === group.yearLevel)) group.yearLevel = meta.levels[0].value;
      levelSelect.innerHTML = meta.levels.map(l =>
        `<option value="${escapeHtml(l.value)}" ${l.value === group.yearLevel ? 'selected' : ''}>${escapeHtml(l.label)}</option>`
      ).join('');
    }

    const catSelect = document.getElementById('subjectCategorySelect');
    if (catSelect) {
      if (!meta.categories.some(c => c.value === group.category)) group.category = meta.categories[0].value;
      catSelect.innerHTML = meta.categories.map(c =>
        `<option value="${escapeHtml(c.value)}" ${c.value === group.category ? 'selected' : ''}>${escapeHtml(c.label)}</option>`
      ).join('');
    }

    const nameIn = document.getElementById('subjectNameInput');
    if (nameIn && document.activeElement !== nameIn) nameIn.value = group.subjectName;
    const coeffIn = document.getElementById('subjectCoeffInput');
    if (coeffIn && document.activeElement !== coeffIn) coeffIn.value = group.coeff;

    const examScaleSel = document.getElementById('examScaleSelect');
    if (examScaleSel) {
      if (stage === 'primary') {
        group.examScale = 10;
        examScaleSel.innerHTML = `<option value="10">من 10 (نظام الابتدائي)</option>`;
      } else {
        if (Number(group.examScale) === 10) group.examScale = 20;
        examScaleSel.innerHTML = `
          <option value="20" ${Number(group.examScale) === 20 ? 'selected' : ''}>من 20 (تُضرب ×2 لـ 40)</option>
          <option value="40" ${Number(group.examScale) === 40 ? 'selected' : ''}>مباشرة من 40</option>
        `;
      }
    }

    const termSel = document.getElementById('subjectTermSelect');
    if (termSel) termSel.value = String(group.term || 1);

    // Formula description banner
    const formulaBadge = document.getElementById('activeFormulaBadge');
    const qualOnly = isPrimaryQualitativeOnly(group);
    const isActivityNoExam = (stage === 'primary' && group.category === 'pri_activity');

    if (formulaBadge) {
      if (qualOnly) {
        formulaBadge.textContent = group.yearLevel === 'p1'
          ? 'الطور الابتدائي (السنة 1 ابتدائي): تقييم وصفي نوعي لمستويات التحكم في الكفاءات طيلة الفصول الثلاثة + انتقال آلي للسنة 2 ابتدائي.'
          : 'الطور الابتدائي (استثناء الفصل الأول - سنة 3 إنجليزية / سنة 4 فرنسية وأمازيغية): تقييم وصفي نوعي فقط دون علامة عددية في الفصل الأول.';
      } else if (stage === 'primary') {
        formulaBadge.textContent = isActivityNoExam
          ? 'الطور الابتدائي (تربية موسيقية / تشكيلية / بدنية): تخضع للتقييم المستمر فقط (/10) دون اختبار فصلي.'
          : 'الطور الابتدائي: معدل المادة (/10) = (علامة التقييم المستمر للميادين + علامة الاختبار الفصلي) ÷ 2';
      } else if (stage === 'middle') {
        formulaBadge.textContent = 'الطور المتوسط: م.ت.م = (تقييم النشاطات + الفرض) ÷ 2  |  المعدل الفصلي للمادة = (م.ت.م + الاختبار/40) ÷ 3';
      } else {
        if (group.category === 'languages') {
          formulaBadge.textContent = 'الطور الثانوي (مواد اللغات): المعدل الفصلي للمادة = (التقييم المستمر + الفرض + التعبير الشفوي + الاختبار/40) ÷ 5';
        } else if (group.category === 'practical') {
          formulaBadge.textContent = 'الطور الثانوي (مواد الأعمال التطبيقية): المعدل الفصلي للمادة = (التقييم المستمر + الفرض + الأعمال التطبيقية + الاختبار/40) ÷ 5';
        } else {
          formulaBadge.textContent = 'الطور الثانوي (بقية المواد): المعدل الفصلي للمادة = (التقييم المستمر + الفرض + الاختبار/40) ÷ 4';
        }
      }
    }

    const termNames = { 1: 'الفصل الأول', 2: 'الفصل الثاني', 3: 'الفصل الثالث' };
    const tblTitle = document.getElementById('subjectTableTitle');
    if (tblTitle) {
      tblTitle.textContent = `كشف نقاط مادة ${group.subjectName} — الفوج: ${group.groupName} (${termNames[group.term || 1]}) — المعامل: ${group.coeff}`;
    }

    const computedList = group.students.map(st => ({
      student: st,
      calc: computeStudentSubjectGrade(st, group)
    }));

    // Validation Banner
    const box = document.getElementById('validationAlertBox');
    const listEl = document.getElementById('validationAlertList');
    const allWarnings = [];
    computedList.forEach(item => {
      item.calc.warnings.forEach(w => allWarnings.push(`التلميذ(ة) «${item.student.name}»: ${w}`));
    });
    const warnKpi = document.getElementById('kpiSubWarnings');
    if (warnKpi) warnKpi.textContent = String(allWarnings.length);
    if (box && listEl) {
      if (allWarnings.length > 0) {
        box.classList.remove('hidden');
        listEl.innerHTML = allWarnings.slice(0, 5).map(w => `<li>${escapeHtml(w)} — انقر على «🧮 المعايير» لتوليد علامة موضوعية مستقلة.</li>`).join('');
      } else {
        box.classList.add('hidden');
      }
    }

    const sortedForRank = [...computedList].sort((a, b) => b.calc.avg - a.calc.avg);
    const rankMap = {};
    sortedForRank.forEach((item, idx) => { rankMap[item.student.id] = idx + 1; });

    const count = computedList.length;
    const sumAvg = computedList.reduce((acc, i) => acc + i.calc.avg, 0);
    const classAvg = count > 0 ? (sumAvg / count) : 0;
    const passCount = computedList.filter(i => i.calc.avg >= meta.passMark).length;
    const passRate = count > 0 ? Math.round((passCount / count) * 100) : 0;

    document.getElementById('kpiSubCount').textContent = String(count);
    document.getElementById('kpiSubAvg').textContent = qualOnly ? 'وصفي' : classAvg.toFixed(2);
    document.getElementById('kpiSubScaleNote').textContent = qualOnly ? 'تقدير نوعي' : `من ${meta.scaleMax}`;
    document.getElementById('kpiSubPassRate').textContent = `${passRate}%`;
    document.getElementById('kpiSubPassCount').textContent = `${passCount} متحكم من ${count}`;

    if (count > 0) {
      const topItem = sortedForRank[0];
      const lowItem = sortedForRank[sortedForRank.length - 1];
      document.getElementById('kpiSubMax').textContent = qualOnly ? topItem.calc.qualInfo.value : topItem.calc.avg.toFixed(2);
      document.getElementById('kpiSubMaxName').textContent = topItem.student.name;
      document.getElementById('kpiSubMin').textContent = qualOnly ? lowItem.calc.qualInfo.value : lowItem.calc.avg.toFixed(2);
      document.getElementById('kpiSubMinName').textContent = lowItem.student.name;
    } else {
      document.getElementById('kpiSubMax').textContent = '0.00';
      document.getElementById('kpiSubMaxName').textContent = '-';
      document.getElementById('kpiSubMin').textContent = '0.00';
      document.getElementById('kpiSubMinName').textContent = '-';
    }

    const headRow = document.getElementById('subjectTableHeadRow');
    if (qualOnly) {
      headRow.innerHTML = `
        <th class="p-3 w-10 text-center">#</th>
        <th class="p-3 min-w-[190px]">اللقب والاسم</th>
        <th class="p-3 text-center bg-sky-50 text-sky-950">مستوى التحكم في الكفاءات (تقييم وصفي نوعي)</th>
        <th class="p-3 min-w-[260px]">الملاحظة الوصفية النوعية والقرار البيداغوجي</th>
        <th class="p-3 text-center no-print">حذف</th>
      `;
    } else if (stage === 'primary') {
      headRow.innerHTML = `
        <th class="p-3 w-10 text-center">#</th>
        <th class="p-3 min-w-[180px]">اللقب والاسم</th>
        <th class="p-3 text-center no-print">شبكة المعايير</th>
        <th class="p-3 text-center">التقييم المستمر للميادين (/10)</th>
        ${!isActivityNoExam ? `<th class="p-3 text-center">الاختبار الفصلي (/10)</th>` : ''}
        <th class="p-3 text-center bg-sky-100 text-sky-950">معدل المادة (/10)</th>
        <th class="p-3 text-center">الرتبة</th>
        <th class="p-3 min-w-[200px]">الملاحظة وتبرير دفتر التقويم</th>
        <th class="p-3 text-center no-print">حذف</th>
      `;
    } else if (stage === 'middle') {
      const examHeaderLabel = Number(group.examScale) === 20 ? 'الاختبار (/20)' : 'الاختبار (/40)';
      headRow.innerHTML = `
        <th class="p-3 w-10 text-center">#</th>
        <th class="p-3 min-w-[175px]">اللقب والاسم</th>
        <th class="p-3 text-center no-print">شبكة النشاطات</th>
        <th class="p-3 text-center">تقييم النشاطات (/20)</th>
        <th class="p-3 text-center">علامة الفرض (/20)</th>
        <th class="p-3 text-center bg-emerald-50 text-emerald-900">م.ت.م (/20)</th>
        <th class="p-3 text-center">${examHeaderLabel}</th>
        <th class="p-3 text-center bg-amber-50 text-amber-900">الاختبار (/40)</th>
        <th class="p-3 text-center bg-emerald-100 text-emerald-950">م.ف.م.ت (÷3)</th>
        <th class="p-3 text-center bg-purple-50 text-purple-900">الجداء (×${group.coeff})</th>
        <th class="p-3 text-center">الرتبة</th>
        <th class="p-3 min-w-[190px]">الملاحظة وتبرير دفتر التقويم</th>
        <th class="p-3 text-center no-print">حذف</th>
      `;
    } else {
      const examHeaderLabel = Number(group.examScale) === 20 ? 'الاختبار (/20)' : 'الاختبار (/40)';
      const hasExtra = (group.category === 'languages' || group.category === 'practical');
      const extraLabel = group.category === 'languages' ? 'التعبير الشفوي (/20)' : 'الأعمال التطبيقية (/20)';
      const divisor = hasExtra ? 5 : 4;
      headRow.innerHTML = `
        <th class="p-3 w-10 text-center">#</th>
        <th class="p-3 min-w-[175px]">اللقب والاسم</th>
        <th class="p-3 text-center no-print">شبكة المعايير</th>
        <th class="p-3 text-center">التقييم المستمر (/20)</th>
        <th class="p-3 text-center">علامة الفرض (/20)</th>
        ${hasExtra ? `<th class="p-3 text-center bg-teal-50 text-teal-900">${extraLabel}</th>` : ''}
        <th class="p-3 text-center">${examHeaderLabel}</th>
        <th class="p-3 text-center bg-amber-50 text-amber-900">الاختبار (/40)</th>
        <th class="p-3 text-center bg-emerald-100 text-emerald-950">معدل المادة (÷${divisor})</th>
        <th class="p-3 text-center bg-purple-50 text-purple-900">الجداء (×${group.coeff})</th>
        <th class="p-3 text-center">الرتبة</th>
        <th class="p-3 min-w-[190px]">الملاحظة وتبرير دفتر التقويم</th>
        <th class="p-3 text-center no-print">حذف</th>
      `;
    }

    const filtered = computedList.filter(item =>
      !searchSubjectQuery || item.student.name.toLowerCase().includes(searchSubjectQuery.toLowerCase())
    );

    const tbody = document.getElementById('subjectTableBody');
    tbody.innerHTML = filtered.map((item, idx) => {
      const st = item.student;
      const c = item.calc;
      const hasWarn = c.warnings && c.warnings.length > 0;

      if (qualOnly) {
        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-2.5 text-center font-bold text-slate-400 num-cell">${idx + 1}</td>
            <td class="p-2.5">
              <input type="text" value="${escapeHtml(st.name)}" data-field="name" data-id="${escapeHtml(st.id)}"
                class="sub-student-input w-full bg-transparent font-bold text-slate-800 px-1.5 py-1 rounded" />
            </td>
            <td class="p-2.5 text-center bg-sky-50/40">
              <select data-field="qualLevel" data-id="${escapeHtml(st.id)}" class="sub-student-input rounded-xl border border-sky-300 bg-white px-3 py-1.5 text-xs font-bold text-sky-950">
                <option value="" disabled ${!st.qualLevel ? 'selected' : ''}>اختر مستوى التحكم</option>
                ${QUALITATIVE_LEVELS.map(q => `<option value="${q.value}" ${st.qualLevel === q.value ? 'selected' : ''}>${q.label}</option>`).join('')}
              </select>
            </td>
            <td class="p-2.5">
              <input type="text" value="${escapeHtml(c.remark)}" data-field="customRemark" data-id="${escapeHtml(st.id)}"
                class="sub-student-input w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5" />
            </td>
            <td class="p-2.5 text-center no-print">
              <button type="button" data-del-sub="${escapeHtml(st.id)}" class="btn-del-sub-student text-rose-500 hover:text-rose-700 font-bold px-2 py-1">✕</button>
            </td>
          </tr>
        `;
      }

      if (stage === 'primary') {
        const avgColor = c.avg >= 5 ? 'text-sky-900 bg-sky-50 font-extrabold' : 'text-rose-700 bg-rose-50 font-extrabold';
        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-2.5 text-center font-bold text-slate-400 num-cell">${idx + 1}</td>
            <td class="p-2.5">
              <input type="text" value="${escapeHtml(st.name)}" data-field="name" data-id="${escapeHtml(st.id)}"
                class="sub-student-input w-full bg-transparent font-bold text-slate-800 px-1.5 py-1 rounded" />
            </td>
            <td class="p-2.5 text-center no-print">
              <button type="button" data-rubric-id="${escapeHtml(st.id)}" class="btn-open-rubric px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold">
                🧮 الميادين
              </button>
            </td>
            <td class="p-2.5 text-center">
              <input type="number" min="0" max="10" step="0.25" value="${clamp(st.cont, 0, stage === 'primary' ? 10 : 20)}" data-field="cont" data-id="${escapeHtml(st.id)}"
                class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold" />
            </td>
            ${!isActivityNoExam ? `
              <td class="p-2.5 text-center">
                <input type="number" min="0" max="10" step="0.25" value="${clamp(st.exam, 0, stage === 'primary' ? 10 : 40)}" data-field="exam" data-id="${escapeHtml(st.id)}"
                  class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold" />
              </td>
            ` : ''}
            <td class="p-2.5 text-center text-sm ${avgColor} num-cell">${c.avg.toFixed(2)}</td>
            <td class="p-2.5 text-center font-bold text-slate-700 num-cell">${isPriY1 ? '—' : rankMap[st.id]}</td>
            <td class="p-2.5">
              <input type="text" value="${escapeHtml(c.remark)}" data-field="customRemark" data-id="${escapeHtml(st.id)}"
                class="sub-student-input w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" />
            </td>
            <td class="p-2.5 text-center no-print">
              <button type="button" data-del-sub="${escapeHtml(st.id)}" class="btn-del-sub-student text-rose-500 hover:text-rose-700 font-bold px-2 py-1">✕</button>
            </td>
          </tr>
        `;
      }

      const maxExamInput = Number(group.examScale) === 20 ? 20 : 40;
      const avgColor = c.avg >= 10 ? 'text-emerald-800 bg-emerald-50 font-extrabold' : 'text-rose-700 bg-rose-50 font-extrabold';
      const hasExtra = (stage === 'secondary' && (group.category === 'languages' || group.category === 'practical'));
      const contBorder = hasWarn ? 'border-amber-500 bg-amber-50' : 'border-slate-300';

      return `
        <tr class="hover:bg-slate-50/90 transition" data-student-id="${escapeHtml(st.id)}">
          <td class="p-2.5 text-center font-bold text-slate-400 num-cell">${idx + 1}</td>
          <td class="p-2.5">
            <div class="flex items-center gap-1">
              ${hasWarn ? `<span title="${escapeHtml(c.warnings.join(' | '))}" class="text-amber-500 cursor-help">⚠️</span>` : ''}
              <input type="text" value="${escapeHtml(st.name)}" data-field="name" data-id="${escapeHtml(st.id)}"
                class="sub-student-input w-full bg-transparent font-bold text-slate-800 px-1.5 py-1 rounded" />
            </div>
          </td>
          <td class="p-2.5 text-center no-print">
            <button type="button" data-rubric-id="${escapeHtml(st.id)}" class="btn-open-rubric px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold shadow-sm">
              🧮 المعايير
            </button>
          </td>
          <td class="p-2.5 text-center">
            <input type="number" min="0" max="20" step="0.25" value="${clamp(st.cont, 0, 20)}" data-field="cont" data-id="${escapeHtml(st.id)}"
              class="sub-student-input num-input w-20 rounded-lg border ${contBorder} px-2 py-1 text-xs sm:text-sm font-bold" />
          </td>
          <td class="p-2.5 text-center">
            <input type="number" min="0" max="20" step="0.25" value="${clamp(st.devoir, 0, 20)}" data-field="devoir" data-id="${escapeHtml(st.id)}"
              class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs sm:text-sm font-bold" />
          </td>
          ${stage === 'middle' ? `
            <td class="p-2.5 text-center font-bold text-emerald-800 bg-emerald-50/50 num-cell">${c.mtm.toFixed(2)}</td>
          ` : ''}
          ${hasExtra ? `
            <td class="p-2.5 text-center bg-teal-50/30">
              <input type="number" min="0" max="20" step="0.25" value="${clamp(st.extra, 0, 20)}" data-field="extra" data-id="${escapeHtml(st.id)}"
                class="sub-student-input num-input w-20 rounded-lg border border-teal-300 px-2 py-1 text-xs sm:text-sm font-bold" />
            </td>
          ` : ''}
          <td class="p-2.5 text-center">
            <input type="number" min="0" max="${maxExamInput}" step="0.25" value="${clamp(st.exam, 0, 40)}" data-field="exam" data-id="${escapeHtml(st.id)}"
              class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs sm:text-sm font-bold" />
          </td>
          <td class="p-2.5 text-center font-bold text-amber-900 bg-amber-50/50 num-cell">${c.examOn40.toFixed(2)}</td>
          <td class="p-2.5 text-center text-sm ${avgColor} num-cell">${c.avg.toFixed(2)}</td>
          <td class="p-2.5 text-center font-bold text-purple-900 bg-purple-50/40 num-cell">${c.weighted.toFixed(2)}</td>
          <td class="p-2.5 text-center font-bold text-slate-700 num-cell">${rankMap[st.id]}</td>
          <td class="p-2.5">
            <input type="text" value="${escapeHtml(c.remark)}" data-field="customRemark" data-id="${escapeHtml(st.id)}"
              class="sub-student-input w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" />
          </td>
          <td class="p-2.5 text-center no-print">
            <button type="button" data-del-sub="${escapeHtml(st.id)}" class="btn-del-sub-student text-rose-500 hover:text-rose-700 font-bold px-2 py-1">✕</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderHomeroomModeForStage(stage) {
    const meta = STAGE_META[stage];
    const hr = getStageHomeroom(stage);
    const presetSel = document.getElementById('homeroomPresetSelect');
    if (presetSel) {
      if (!meta.presets.some(p => p.value === hr.preset)) hr.preset = meta.presets[0].value;
      presetSel.innerHTML = meta.presets.map(p =>
        `<option value="${escapeHtml(p.value)}" ${p.value === hr.preset ? 'selected' : ''}>${escapeHtml(p.label)}</option>`
      ).join('');
    }

    const cNameIn = document.getElementById('homeroomClassName');
    if (cNameIn && document.activeElement !== cNameIn) cNameIn.value = hr.className || '';
    const termSel = document.getElementById('homeroomActiveTerm');
    if (termSel) termSel.value = String(hr.activeTerm || 1);

    const isPrimary = (stage === 'primary');
    const isPriY1 = (isPrimary && hr.preset === 'pri_y1');
    const scaleMax = meta.scaleMax;

    const totalCoeffs = hr.subjects.reduce((acc, s) => {
      if (isPrimary && Number(hr.activeTerm) === 1 && s.qualInT1) return acc;
      return acc + (parseInt(s.coeff, 10) || 1);
    }, 0);
    document.getElementById('homeroomTotalCoeffsBadge').textContent = String(totalCoeffs);

    const formulaTextEl = document.getElementById('homeroomFormulaText');
    if (isPriY1) {
      formulaTextEl.textContent = 'السنة الأولى ابتدائي: تقييم وصفي نوعي في الفصول الثلاثة + انتقال آلي إلى السنة الثانية ابتدائي لكل تلميذ واظب بانتظام.';
    } else if (isPrimary) {
      formulaTextEl.textContent = 'الطور الابتدائي (/10): مجموع معدلات المواد المقررة ÷ عددها (مع إعفاء الإنجليزية سنة 3 والفرنسية/الأمازيغية سنة 4 من الحساب العددي في الفصل 1).';
    } else if (stage === 'secondary') {
      formulaTextEl.textContent = 'الطور الثانوي (/20): (مجموع (معدل المادة × معاملها) + ما فاق 10 من المشاريع الدراسية + ما فاق 10 من المطالعة) ÷ مجموع المعاملات.';
    } else {
      formulaTextEl.textContent = 'الطور المتوسط (/20): مجموع (المعدلات الفصلية للمواد × معاملاتها) ÷ مجموع المعاملات.';
    }

    document.getElementById('homeroomTableTitle').textContent =
      `الجدول الجامع لمجلس القسم — ${hr.className} (السلم: /${scaleMax} | مجموع المعاملات: ${totalCoeffs})`;

    const computedList = hr.students.map(st => ({
      student: st,
      calc: computeHomeroomStudent(st, hr)
    }));

    const sortedForRank = [...computedList].sort((a, b) => b.calc.termAvg - a.calc.termAvg);
    const rankMap = {};
    sortedForRank.forEach((item, idx) => { rankMap[item.student.id] = idx + 1; });

    const count = computedList.length;
    const avgTerm = count > 0 ? computedList.reduce((a, b) => a + b.calc.termAvg, 0) / count : 0;
    const avgAnnual = count > 0 ? computedList.reduce((a, b) => a + b.calc.annualAvg, 0) / count : 0;
    const passCount = isPriY1 ? computedList.filter(i => i.calc.autoPassEligible).length : computedList.filter(i => i.calc.termAvg >= meta.passMark).length;
    const passRate = count > 0 ? Math.round((passCount / count) * 100) : 0;
    const avgBonus = count > 0 ? computedList.reduce((a, b) => a + b.calc.totalBonus, 0) / count : 0;
    const honorCount = isPriY1 ? 0 : computedList.filter(i => (scaleMax === 10 ? i.calc.termAvg >= 6 : i.calc.termAvg >= 12)).length;

    document.getElementById('kpiHomeCount').textContent = String(count);
    document.getElementById('kpiHomeTermAvg').textContent = isPriY1 ? 'وصفي' : avgTerm.toFixed(2);
    document.getElementById('kpiHomeScaleLabel').textContent = isPriY1 ? 'انتقال آلي' : `من ${scaleMax}`;
    document.getElementById('kpiHomeAnnualAvg').textContent = isPriY1 ? 'آلي' : avgAnnual.toFixed(2);
    document.getElementById('kpiHomePassRate').textContent = `${passRate}%`;
    document.getElementById('kpiHomePassCount').textContent = `${passCount} ناجح من ${count}`;
    document.getElementById('kpiHomeBonusAvg').textContent = stage === 'secondary' ? `+${avgBonus.toFixed(2)}` : 'غير معني';
    document.getElementById('kpiHomeHonorCount').textContent = String(honorCount);

    const headRow = document.getElementById('homeroomTableHeadRow');
    const subjectColsHtml = hr.subjects.map(sub => {
      const isQualT1 = (isPrimary && Number(hr.activeTerm) === 1 && sub.qualInT1);
      return `<th class="p-2 text-center min-w-[78px] border-l border-slate-200 ${isQualT1 ? 'bg-sky-50 text-sky-900' : ''}">
        <div class="truncate max-w-[95px]" title="${escapeHtml(sub.name)}">${escapeHtml(sub.name)}</div>
        <div class="text-[10px] ${isQualT1 ? 'text-sky-700' : 'text-teal-700'} font-bold">${isQualT1 ? 'وصفي (ف1)' : `معامل ${escapeHtml(sub.coeff)}`}</div>
      </th>`;
    }).join('');

    const secondaryBonusColsHtml = stage === 'secondary' ? `
      <th class="p-2 text-center bg-amber-50 text-amber-900 min-w-[85px] border-l border-amber-200">
        <div>المشاريع (/20)</div>
        <div class="text-[10px] text-amber-700">دون معامل</div>
      </th>
      <th class="p-2 text-center bg-amber-50 text-amber-900 min-w-[85px] border-l border-amber-200">
        <div>المطالعة (/20)</div>
        <div class="text-[10px] text-amber-700">دون معامل</div>
      </th>
      <th class="p-2 text-center bg-amber-100/80 text-amber-950 min-w-[75px] border-l border-amber-200">
        <div>فائض (+)</div>
        <div class="text-[10px]">فوق 10/20</div>
      </th>
    ` : '';

    headRow.innerHTML = `
      <th class="p-2.5 text-center w-8">#</th>
      <th class="p-2.5 min-w-[165px] border-l border-slate-200">اللقب والاسم</th>
      ${subjectColsHtml}
      ${secondaryBonusColsHtml}
      <th class="p-2 text-center bg-purple-50 text-purple-900 min-w-[85px]">مجموع الجداء</th>
      <th class="p-2 text-center bg-emerald-100 text-emerald-950 min-w-[85px]">المعدل الفصلي</th>
      <th class="p-2 text-center bg-slate-50 text-slate-700 min-w-[75px]">م. ف2</th>
      <th class="p-2 text-center bg-slate-50 text-slate-700 min-w-[75px]">م. ف3</th>
      <th class="p-2 text-center bg-indigo-100 text-indigo-950 min-w-[85px]">المعدل السنوي</th>
      <th class="p-2 text-center min-w-[55px]">الرتبة</th>
      <th class="p-2 text-center min-w-[85px]">القرار / التقدير</th>
      <th class="p-2 text-center no-print min-w-[95px]">إجراءات</th>
    `;

    const tbody = document.getElementById('homeroomTableBody');
    tbody.innerHTML = computedList.map((item, idx) => {
      const st = item.student;
      const c = item.calc;

      const subInputsHtml = hr.subjects.map(sub => {
        const isQualT1 = (isPrimary && Number(hr.activeTerm) === 1 && sub.qualInT1);
        if (isQualT1 || isPriY1) {
          return `<td class="p-1.5 text-center bg-sky-50/40 border-l border-sky-100"><span class="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[11px] font-bold">تقييم وصفي نوعي</span></td>`;
        }
        const defaultVal = isPrimary ? 7 : 12;
        const val = clamp(st.grades && st.grades[sub.id] !== undefined ? st.grades[sub.id] : 0, 0, scaleMax);
        return `
          <td class="p-1.5 text-center border-l border-slate-100">
            <input type="number" min="0" max="${scaleMax}" step="0.25" value="${val}"
              data-hr-student="${escapeHtml(st.id)}" data-hr-sub="${escapeHtml(sub.id)}"
              class="hr-grade-input num-input w-16 rounded-lg border border-slate-200 px-1.5 py-1 text-xs font-bold" />
          </td>
        `;
      }).join('');

      const secCellsHtml = stage === 'secondary' ? `
        <td class="p-1.5 text-center bg-amber-50/40 border-l border-amber-100">
          <input type="number" min="0" max="20" step="0.25" value="${clamp(st.projectScore, 0, 20)}"
            data-hr-student="${escapeHtml(st.id)}" data-hr-field="projectScore"
            class="hr-meta-input num-input w-16 rounded-lg border border-amber-300 px-1.5 py-1 text-xs font-bold" />
          <span class="block mt-1 max-w-[110px] text-[9px] leading-3 text-rose-700">${escapeHtml(c.warnings.join("، "))}</span>
        </td>
        <td class="p-1.5 text-center bg-amber-50/40 border-l border-amber-100">
          <input type="number" min="0" max="20" step="0.25" value="${clamp(st.readingScore, 0, 20)}"
            data-hr-student="${escapeHtml(st.id)}" data-hr-field="readingScore"
            class="hr-meta-input num-input w-16 rounded-lg border border-amber-300 px-1.5 py-1 text-xs font-bold" />
          <span class="block mt-1 max-w-[110px] text-[9px] leading-3 text-rose-700">${escapeHtml(c.warnings.join("، "))}</span>
        </td>
        <td class="p-2 text-center font-extrabold text-amber-800 bg-amber-100/50 border-l border-amber-200 num-cell">+${c.totalBonus.toFixed(2)}</td>
      ` : '';

      const termAvgCls = c.termAvg >= meta.passMark ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'bg-rose-50 text-rose-800 font-extrabold';
      const annualAvgCls = c.annualAvg >= meta.passMark ? 'bg-indigo-50 text-indigo-900 font-extrabold' : 'bg-rose-50 text-rose-800 font-extrabold';

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-2 text-center font-bold text-slate-400 num-cell">${idx + 1}</td>
          <td class="p-2 border-l border-slate-100">
            <input type="text" value="${escapeHtml(st.name)}" data-hr-student="${escapeHtml(st.id)}" data-hr-field="name"
              class="hr-meta-input w-full bg-transparent font-bold text-slate-800 px-1 py-0.5 rounded" />
            ${isPriY1 ? `<label class="mt-1 flex items-center gap-1 text-[10px] font-semibold text-sky-800"><input type="checkbox" class="hr-attendance-input" data-hr-student="${escapeHtml(st.id)}" ${st.attendanceRegular === true ? 'checked' : ''} /> مواظب بانتظام (شرط الانتقال)</label>` : ''}
          </td>
          ${subInputsHtml}
          ${secCellsHtml}
          <td class="p-2 text-center font-bold text-purple-900 bg-purple-50/40 num-cell">${isPriY1 ? '-' : c.finalWeightedSum.toFixed(2)}</td>
          <td class="p-2 text-center text-sm ${termAvgCls} num-cell">${isPriY1 ? 'وصفي' : c.termAvg.toFixed(2)}</td>
          <td class="p-1.5 text-center bg-slate-50/60">
            ${isPriY1 ? '—' : `<input type="number" min="0" max="${scaleMax}" step="0.25" value="${clamp(st.t2Avg, 0, scaleMax)}"
              data-hr-student="${escapeHtml(st.id)}" data-hr-field="t2Avg"
              class="hr-meta-input num-input w-16 rounded-lg border border-slate-200 px-1 py-1 text-xs font-semibold" />`}
          </td>
          <td class="p-1.5 text-center bg-slate-50/60">
            ${isPriY1 ? '—' : `<input type="number" min="0" max="${scaleMax}" step="0.25" value="${clamp(st.t3Avg, 0, scaleMax)}"
              data-hr-student="${escapeHtml(st.id)}" data-hr-field="t3Avg"
              class="hr-meta-input num-input w-16 rounded-lg border border-slate-200 px-1 py-1 text-xs font-semibold" />`}
          </td>
          <td class="p-2 text-center text-sm ${annualAvgCls} num-cell">${isPriY1 ? (c.autoPassEligible ? 'ينتقل آلياً' : 'غير مؤهل بعد') : c.annualAvg.toFixed(2)}</td>
          <td class="p-2 text-center font-bold text-slate-700 num-cell">${isPriY1 ? '—' : rankMap[st.id]}</td>
          <td class="p-2 text-center">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${c.award.cls}">${c.award.label}</span>
          </td>
          <td class="p-2 text-center no-print">
            <div class="flex items-center justify-center gap-1">
              <button type="button" data-report-id="${escapeHtml(st.id)}" class="btn-open-report px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold shadow-sm">
                📄 كشف
              </button>
              <button type="button" data-del-hr="${escapeHtml(st.id)}" class="btn-del-hr-student px-1.5 py-1 rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-bold">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderAnalyticsForStage(stage) {
    if (typeof Chart === 'undefined') return;
    const source = document.getElementById('analyticsSourceSelect')?.value || 'subject';
    const mult = stage === 'primary' ? 2 : 1;
    let averagesNorm20 = [], thirdLabels = [], thirdValues = [];

    if (source === 'subject') {
      const group = getCurrentStageGroup(stage);
      const computed = group.students.map(st => computeStudentSubjectGrade(st, group));
      averagesNorm20 = computed.map(c => c.avg * mult);
      const n = computed.length || 1;
      const avgCont = computed.reduce((a, b) => a + b.cont, 0) / n;
      const avgDevoir = computed.reduce((a, b) => a + b.devoir, 0) / n;
      const avgExam = computed.reduce((a, b) => a + (stage === 'primary' ? b.examOn10 : b.examOn20), 0) / n;
      const avgFinal = computed.reduce((a, b) => a + b.avg, 0) / n;

      if (stage === 'primary') {
        thirdLabels = ['التقييم المستمر للميادين (/10)', 'الاختبار الفصلي (/10)', 'معدل المادة (/10)'];
        thirdValues = [avgCont, avgExam, avgFinal];
      } else if (stage === 'middle') {
        const avgMtm = computed.reduce((a, b) => a + b.mtm, 0) / n;
        thirdLabels = ['تقييم النشاطات', 'علامة الفرض', 'م.ت.م', 'الاختبار (/20)', 'م.ف.م.ت'];
        thirdValues = [avgCont, avgDevoir, avgMtm, avgExam, avgFinal];
      } else {
        thirdLabels = ['التقييم المستمر', 'علامة الفرض', 'الاختبار (/20)', 'معدل المادة'];
        thirdValues = [avgCont, avgDevoir, avgExam, avgFinal];
      }
    } else {
      const hr = getStageHomeroom(stage);
      const computed = hr.students.map(st => computeHomeroomStudent(st, hr));
      averagesNorm20 = computed.map(c => c.termAvg * mult);
      const n = hr.students.length || 1;
      thirdLabels = hr.subjects.map(s => s.name);
      thirdValues = hr.subjects.map(s => {
        const sum = hr.students.reduce((acc, st) => acc + (parseFloat(st.grades[s.id]) || 0), 0);
        return sum / n;
      });
    }

    const brackets = [0, 0, 0, 0, 0, 0];
    averagesNorm20.forEach(a => {
      if (a < 8) brackets[0]++;
      else if (a < 10) brackets[1]++;
      else if (a < 12) brackets[2]++;
      else if (a < 14) brackets[3]++;
      else if (a < 16) brackets[4]++;
      else brackets[5]++;
    });

    const awardsCounts = [0, 0, 0, 0, 0, 0, 0];
    averagesNorm20.forEach(a => {
      if (a >= 18) awardsCounts[0]++;
      else if (a >= 16) awardsCounts[1]++;
      else if (a >= 14) awardsCounts[2]++;
      else if (a >= 12) awardsCounts[3]++;
      else if (a >= 10) awardsCounts[4]++;
      else if (a >= 8) awardsCounts[5]++;
      else awardsCounts[6]++;
    });

    if (chartInstances.brackets) chartInstances.brackets.destroy();
    if (chartInstances.awards) chartInstances.awards.destroy();
    if (chartInstances.components) chartInstances.components.destroy();

    const c1 = document.getElementById('chartGradeBrackets');
    const c2 = document.getElementById('chartCouncilAwards');
    const c3 = document.getElementById('chartComponentsComparison');
    if (!c1 || !c2 || !c3) return;

    chartInstances.brackets = new Chart(c1.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['ضعيف', 'دون المتوسط', 'مقبول', 'لوحة شرف', 'تشجيع', 'تهنئة وامتياز'],
        datasets: [{ label: 'عدد التلاميذ', data: brackets, backgroundColor: ['#f43f5e', '#f59e0b', '#64748b', '#3b82f6', '#0d9488', '#10b981'], borderRadius: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });

    chartInstances.awards = new Chart(c2.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['امتياز', 'تهنئة', 'تشجيع', 'لوحة شرف', 'تحكم مقبول', 'إنذار/معالجة', 'توبيخ/دعم'],
        datasets: [{ data: awardsCounts, backgroundColor: ['#059669', '#0d9488', '#2563eb', '#4f46e5', '#94a3b8', '#f59e0b', '#e11d48'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Cairo' } } } } }
    });

    chartInstances.components = new Chart(c3.getContext('2d'), {
      type: 'bar',
      data: {
        labels: thirdLabels,
        datasets: [{ label: 'المتوسط', data: thirdValues.map(v => Number(v.toFixed(2))), backgroundColor: '#0f766e', borderRadius: 8 }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  // Rubric Modal
  function openRubricModal(studentId) {
    const stage = getActiveStage();
    const group = getCurrentStageGroup(stage);
    const st = group.students.find(s => s.id === studentId);
    if (!st) return;
    activeRubricStudentId = studentId;
    if (!st.rubric) st.rubric = {};
    const r = st.rubric;

    const container = document.getElementById('rubricSectionsContainer');
    const subtitle = document.getElementById('rubricModalSubtitle');

    if (stage === 'primary') {
      subtitle.textContent = `التلميذ(ة): ${st.name} — شبكة التقييم المستمر للطور الابتدائي (/10) وفق الصفحة 2 من المنشور 522/2026`;
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-sky-50 p-3 rounded-xl border border-sky-200">
            <label class="block text-xs font-extrabold text-sky-950 mb-1">أ- مشاركة التلميذ في القسم (/4)</label>
            <input id="rub_p1" type="number" min="0" max="4" step="0.25" value="${r.p1 !== undefined ? r.p1 : 3.5}" class="rub-input num-input w-full rounded-lg border border-sky-300 px-2 py-1.5 text-sm font-bold" />
          </div>
          <div class="bg-sky-50 p-3 rounded-xl border border-sky-200">
            <label class="block text-xs font-extrabold text-sky-950 mb-1">ب- المنتجات الكتابية (/4)</label>
            <input id="rub_p2" type="number" min="0" max="4" step="0.25" value="${r.p2 !== undefined ? r.p2 : 3.5}" class="rub-input num-input w-full rounded-lg border border-sky-300 px-2 py-1.5 text-sm font-bold" />
          </div>
          <div class="bg-sky-50 p-3 rounded-xl border border-sky-200">
            <label class="block text-xs font-extrabold text-sky-950 mb-1">ج- المنتجات الفنية والأداء العملي (/2)</label>
            <input id="rub_p3" type="number" min="0" max="2" step="0.25" value="${r.p3 !== undefined ? r.p3 : 2.0}" class="rub-input num-input w-full rounded-lg border border-sky-300 px-2 py-1.5 text-sm font-bold" />
          </div>
        </div>
      `;
    } else if (stage === 'middle') {
      subtitle.textContent = `التلميذ(ة): ${escapeHtml(st.name)} — شبكة معايير تقييم نشاطات التلاميذ للطور المتوسط (/20) وفق الصفحة 3 من المنشور 522/2026`;
      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <label class="block text-xs font-extrabold text-emerald-950 mb-1">1. الانضباط والمواظبة (/7)</label>
            <input id="rub_m1" type="number" min="0" max="7" step="0.25" value="${r.m1 !== undefined ? r.m1 : 6.0}" class="rub-input num-input w-full rounded-lg border border-emerald-300 px-2 py-1.5 text-sm font-bold" />
          </div>
          <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <label class="block text-xs font-extrabold text-emerald-950 mb-1">2. أنشطة التعلم داخل القسم (/7)</label>
            <input id="rub_m2" type="number" min="0" max="7" step="0.25" value="${r.m2 !== undefined ? r.m2 : 6.0}" class="rub-input num-input w-full rounded-lg border border-emerald-300 px-2 py-1.5 text-sm font-bold" />
          </div>
          <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <label class="block text-xs font-extrabold text-emerald-950 mb-1">3. أنشطة التعلم خارج القسم (/6)</label>
            <input id="rub_m3" type="number" min="0" max="6" step="0.25" value="${r.m3 !== undefined ? r.m3 : 5.0}" class="rub-input num-input w-full rounded-lg border border-emerald-300 px-2 py-1.5 text-sm font-bold" />
          </div>
        </div>
      `;
    } else {
      const hasExtra = (group.category === 'languages' || group.category === 'practical');
      const extraTitle = group.category === 'languages' ? 'ثانياً: شبكة التعبير الشفوي (/20)' : 'ثانياً: شبكة الأعمال التطبيقية (/20)';
      subtitle.textContent = `التلميذ(ة): ${escapeHtml(st.name)} — شبكة المراقبة المستمرة للطور الثانوي وفق الصفحة 5 من المنشور 522/2026`;
      container.innerHTML = `
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <label class="block text-xs font-extrabold text-emerald-950 mb-1">1. الانضباط والمواظبة (/10)</label>
              <input id="rub_c1" type="number" min="0" max="10" step="0.25" value="${r.c1 !== undefined ? r.c1 : 8.0}" class="rub-input num-input w-full rounded-lg border border-emerald-300 px-2 py-1.5 text-sm font-bold" />
            </div>
            <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <label class="block text-xs font-extrabold text-emerald-950 mb-1">2. النشاط داخل القسم (/10)</label>
              <input id="rub_c2" type="number" min="0" max="10" step="0.25" value="${r.c2 !== undefined ? r.c2 : 8.0}" class="rub-input num-input w-full rounded-lg border border-emerald-300 px-2 py-1.5 text-sm font-bold" />
            </div>
          </div>
          ${hasExtra ? `
            <div class="text-xs font-extrabold text-teal-950 pt-2">${extraTitle}:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="bg-teal-50 p-3 rounded-xl border border-teal-200">
                <label class="block text-xs font-extrabold text-teal-950 mb-1">المعيار التطبيقي / الشفوي الأول (/10)</label>
                <input id="rub_e1" type="number" min="0" max="10" step="0.25" value="${r.e1 !== undefined ? r.e1 : 8.0}" class="rub-input num-input w-full rounded-lg border border-teal-300 px-2 py-1.5 text-sm font-bold" />
              </div>
              <div class="bg-teal-50 p-3 rounded-xl border border-teal-200">
                <label class="block text-xs font-extrabold text-teal-950 mb-1">المعيار التطبيقي / الشفوي الثاني (/10)</label>
                <input id="rub_e2" type="number" min="0" max="10" step="0.25" value="${r.e2 !== undefined ? r.e2 : 8.0}" class="rub-input num-input w-full rounded-lg border border-teal-300 px-2 py-1.5 text-sm font-bold" />
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    recalcRubricModalPreview();
    const modal = document.getElementById('modalRubricCalc');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function recalcRubricModalPreview() {
    const stage = getActiveStage();
    const group = getCurrentStageGroup(stage);
    const previewEl = document.getElementById('rubricPreviewTotal');
    const justifEl = document.getElementById('rubricGeneratedJustification');

    if (stage === 'primary') {
      const p1 = clamp(document.getElementById('rub_p1')?.value, 0, 4);
      const p2 = clamp(document.getElementById('rub_p2')?.value, 0, 4);
      const p3 = clamp(document.getElementById('rub_p3')?.value, 0, 2);
      const total = p1 + p2 + p3;
      previewEl.textContent = `${total.toFixed(2)} / 10`;
      justifEl.value = `تقييم الميادين: مشاركة (${p1}/4) + منتجات كتابية (${p2}/4) + أداء عملي (${p3}/2)`;
    } else if (stage === 'middle') {
      const m1 = clamp(document.getElementById('rub_m1')?.value, 0, 7);
      const m2 = clamp(document.getElementById('rub_m2')?.value, 0, 7);
      const m3 = clamp(document.getElementById('rub_m3')?.value, 0, 6);
      const total = m1 + m2 + m3;
      previewEl.textContent = `${total.toFixed(2)} / 20`;
      justifEl.value = `شبكة النشاطات: مواظبة (${m1}/7) + أنشطة القسم (${m2}/7) + واجبات ومشاريع (${m3}/6)`;
    } else {
      const c1 = clamp(document.getElementById('rub_c1')?.value, 0, 10);
      const c2 = clamp(document.getElementById('rub_c2')?.value, 0, 10);
      const contTotal = c1 + c2;
      const hasExtra = (group.category === 'languages' || group.category === 'practical');
      if (hasExtra) {
        const e1 = clamp(document.getElementById('rub_e1')?.value, 0, 10);
        const e2 = clamp(document.getElementById('rub_e2')?.value, 0, 10);
        const extraTotal = e1 + e2;
        const extraLabel = group.category === 'languages' ? 'الشفوي' : 'التطبيقي';
        previewEl.textContent = `المستمر: ${contTotal.toFixed(2)}/20 | ${extraLabel}: ${extraTotal.toFixed(2)}/20`;
        justifEl.value = `تقييم مستمر (${contTotal}/20: مواظبة ${c1} + نشاط ${c2}) | ${extraLabel} (${extraTotal}/20)`;
      } else {
        previewEl.textContent = `${contTotal.toFixed(2)} / 20`;
        justifEl.value = `تقييم مستمر: انضباط ومواظبة (${c1}/10) + نشاط داخل القسم (${c2}/10)`;
      }
    }
  }

  function applyRubricToStudent() {
    const stage = getActiveStage();
    const group = getCurrentStageGroup(stage);
    const st = group.students.find(s => s.id === activeRubricStudentId);
    if (!st) return;

    st.customRemark = document.getElementById('rubricGeneratedJustification').value;
    if (stage === 'primary') {
      const p1 = clamp(document.getElementById('rub_p1')?.value, 0, 4);
      const p2 = clamp(document.getElementById('rub_p2')?.value, 0, 4);
      const p3 = clamp(document.getElementById('rub_p3')?.value, 0, 2);
      st.rubric = { p1, p2, p3 };
      st.cont = Number((p1 + p2 + p3).toFixed(2));
    } else if (stage === 'middle') {
      const m1 = clamp(document.getElementById('rub_m1')?.value, 0, 7);
      const m2 = clamp(document.getElementById('rub_m2')?.value, 0, 7);
      const m3 = clamp(document.getElementById('rub_m3')?.value, 0, 6);
      st.rubric = { m1, m2, m3 };
      st.cont = Number((m1 + m2 + m3).toFixed(2));
    } else {
      const c1 = clamp(document.getElementById('rub_c1')?.value, 0, 10);
      const c2 = clamp(document.getElementById('rub_c2')?.value, 0, 10);
      st.cont = Number((c1 + c2).toFixed(2));
      if (group.category === 'languages' || group.category === 'practical') {
        const e1 = clamp(document.getElementById('rub_e1')?.value, 0, 10);
        const e2 = clamp(document.getElementById('rub_e2')?.value, 0, 10);
        st.extra = Number((e1 + e2).toFixed(2));
        st.rubric = { c1, c2, e1, e2 };
      } else {
        st.rubric = { c1, c2 };
      }
    }

    saveState();
    const modal = document.getElementById('modalRubricCalc');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    renderStageWorkspace();
    showToast('تم اعتماد علامة شبكة المعايير وتوثيق التبرير البيداغوجي');
  }

  function openStudentReportModal(studentId) {
    const stage = getActiveStage();
    const hr = getStageHomeroom(stage);
    const st = hr.students.find(s => s.id === studentId);
    if (!st) return;

    const computedAll = hr.students.map(s => ({
      student: s,
      calc: computeHomeroomStudent(s, hr)
    })).sort((a, b) => b.calc.termAvg - a.calc.termAvg);

    const rank = computedAll.findIndex(x => x.student.id === st.id) + 1;
    const c = computeHomeroomStudent(st, hr);

    const subjectRowsHtml = hr.subjects.map(sub => {
      const isQualT1 = (c.isPrimary && Number(hr.activeTerm) === 1 && sub.qualInT1);
      if (isQualT1 || c.isPriY1) {
        return `
          <tr class="border-b border-slate-200 bg-sky-50/40">
            <td class="p-2.5 font-bold text-slate-800">${escapeHtml(sub.name)}</td>
            <td class="p-2.5 text-center font-bold text-sky-900" colspan="3">تقييم وصفي نوعي (تحكم مقبول في الكفاءات المستهدفة)</td>
            <td class="p-2.5 text-xs text-sky-900">وفق المنشور 522/2026</td>
          </tr>
        `;
      }
      const grade = clamp(st.grades[sub.id] !== undefined ? st.grades[sub.id] : (c.scaleMax / 2), 0, c.scaleMax);
      const coeff = Math.max(1, parseInt(sub.coeff, 10) || 1);
      const prod = grade * coeff;
      return `
        <tr class="border-b border-slate-200">
          <td class="p-2.5 font-bold text-slate-800">${escapeHtml(sub.name)}</td>
          <td class="p-2.5 text-center font-bold num-cell">${grade.toFixed(2)} / ${c.scaleMax}</td>
          <td class="p-2.5 text-center num-cell">${coeff}</td>
          <td class="p-2.5 text-center font-bold text-purple-900 num-cell">${prod.toFixed(2)}</td>
          <td class="p-2.5 text-xs text-slate-600">${grade >= c.scaleMax * 0.75 ? 'تحكم جيد جداً' : grade >= c.scaleMax * 0.5 ? 'تحكم مقبول' : 'يحتاج لمعالجة'}</td>
        </tr>
      `;
    }).join('');

    const secondaryProjectsRows = stage === 'secondary' ? `
      <tr class="border-b border-amber-200 bg-amber-50/60">
        <td class="p-2.5 font-bold text-amber-950">المشاريع الدراسية (يُضاف ما فاق 10/20)</td>
        <td class="p-2.5 text-center font-bold num-cell">${c.projectScore.toFixed(2)} / 20</td>
        <td class="p-2.5 text-center text-xs font-semibold text-amber-800">دون معامل</td>
        <td class="p-2.5 text-center font-extrabold text-amber-900 num-cell">+${c.bonusProject.toFixed(2)}</td>
        <td class="p-2.5 text-xs text-amber-900">نقاط إضافية في خانة الجداء</td>
      </tr>
      <tr class="border-b border-amber-200 bg-amber-50/60">
        <td class="p-2.5 font-bold text-amber-950">المطالعة (يُضاف ما فاق 10/20)</td>
        <td class="p-2.5 text-center font-bold num-cell">${c.readingScore.toFixed(2)} / 20</td>
        <td class="p-2.5 text-center text-xs font-semibold text-amber-800">دون معامل</td>
        <td class="p-2.5 text-center font-extrabold text-amber-900 num-cell">+${c.bonusReading.toFixed(2)}</td>
        <td class="p-2.5 text-xs text-amber-900">نقاط إضافية في خانة الجداء</td>
      </tr>
    ` : '';

    document.getElementById('reportCardContent').innerHTML = `
      <div class="border-2 border-slate-800 rounded-xl p-4 space-y-4">
        <div class="text-center border-b border-slate-300 pb-3">
          <div class="text-xs font-bold text-slate-600">الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</div>
          <div class="text-xs font-bold text-slate-700 mt-0.5">${escapeHtml(state.schoolName || '')} — السنة الدراسية: ${escapeHtml(state.schoolYear || '2026/2027')}</div>
          <h4 class="text-base sm:text-lg font-extrabold text-slate-900 mt-1">كشف نقاط التلميذ(ة): ${escapeHtml(st.name)}</h4>
          <div class="text-xs font-semibold text-slate-600 mt-1">
            القسم: <strong>${escapeHtml(hr.className)}</strong> | الأستاذ(ة): <strong>${escapeHtml(state.teacherName || '')}</strong>
          </div>
        </div>
        <table class="w-full text-right border-collapse border border-slate-300 text-xs sm:text-sm">
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="p-2.5">المادة التعليمية</th>
              <th class="p-2.5 text-center">المعدل الفصلي</th>
              <th class="p-2.5 text-center">المعامل</th>
              <th class="p-2.5 text-center">الجداء</th>
              <th class="p-2.5">الملاحظة البيداغوجية</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRowsHtml}
            ${secondaryProjectsRows}
          </tbody>
          <tfoot>
            <tr class="bg-slate-100 font-extrabold border-t-2 border-slate-400">
              <td class="p-2.5">المجموع العام</td>
              <td class="p-2.5 text-center">-</td>
              <td class="p-2.5 text-center num-cell">${c.sumCoeffs}</td>
              <td class="p-2.5 text-center text-purple-950 num-cell">${c.finalWeightedSum.toFixed(2)}</td>
              <td class="p-2.5 text-xs">${stage === 'secondary' ? `شامل لفائض المشاريع والمطالعة (+${c.totalBonus.toFixed(2)})` : 'مجموع جداءات المواد'}</td>
            </tr>
          </tfoot>
        </table>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <div class="text-xs font-bold text-emerald-800">المعدل الفصلي</div>
            <div class="text-xl font-extrabold text-emerald-950 mt-0.5 num-cell">${c.isPriY1 ? 'وصفي' : `${c.termAvg.toFixed(2)} / ${c.scaleMax}`}</div>
          </div>
          <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
            <div class="text-xs font-bold text-indigo-800">المعدل السنوي</div>
            <div class="text-xl font-extrabold text-indigo-950 mt-0.5 num-cell">${c.isPriY1 ? (c.autoPassEligible ? 'ينتقل آلياً' : 'غير مؤهل بعد') : `${c.annualAvg.toFixed(2)} / ${c.scaleMax}`}</div>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div class="text-xs font-bold text-slate-600">الرتبة في القسم</div>
            <div class="text-xl font-extrabold text-slate-900 mt-0.5 num-cell">${c.isPriY1 ? '—' : `${rank} / ${hr.students.length}`}</div>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <div class="text-xs font-bold text-amber-800">قرار مجلس القسم</div>
            <div class="text-base font-extrabold text-amber-950 mt-1">${c.award.label}</div>
          </div>
        </div>
      </div>
    `;
    const modal = document.getElementById('modalReportCard');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  // Excel Upload & Export
  function handleExcelFileUpload(file) {
    if (!file || typeof XLSX === 'undefined') return;
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const workbook = XLSX.read(new Uint8Array(event.target.result), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        const target = document.getElementById('importTargetSelect')?.value || 'subject';
        const result = importRosterRows(rows, target);
        saveState();
        renderStageWorkspace();
        showToast(`استيراد Excel: ${result.added} تلميذاً، ${result.skipped} مكرر/متجاوز`);
      } catch (error) {
        console.error('Excel import failed:', error);
        showToast('تعذر قراءة ملف Excel أو مطابقة أعمدته', '⚠️');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function exportToExcelFile() {
    const stage = getActiveStage();
    const subTab = state.stageSubTab[stage] || 'subject';
    const aoa = [];
    aoa.push(['الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التربية الوطنية']);
    aoa.push([`المؤسسة: ${state.schoolName || ''}`, `الأستاذ(ة): ${state.teacherName || ''}`, `السنة الدراسية: ${state.schoolYear || '2026/2027'}`]);
    aoa.push([]);

    if (subTab === 'homeroom') {
      const hr = getStageHomeroom(stage);
      aoa.push([`كشف المعدلات الشامل للقسم: ${hr.className} (الفصل ${hr.activeTerm})`]);
      const headers = ['الرقم', 'اللقب والاسم', ...hr.subjects.map(s => `${s.name} (معامل ${s.coeff})`)];
      if (stage === 'secondary') headers.push('المشاريع الدراسية (/20)', 'المطالعة (/20)', 'فائض النقاط (+)');
      headers.push('مجموع الجداءات', 'المعدل الفصلي', 'معدل الفصل 2', 'معدل الفصل 3', 'المعدل السنوي', 'قرار مجلس القسم');
      aoa.push(headers);

      hr.students.forEach((st, idx) => {
        const c = computeHomeroomStudent(st, hr);
        const row = [idx + 1, st.name];
        hr.subjects.forEach(s => row.push(Number((parseFloat(st.grades[s.id]) || 0).toFixed(2))));
        if (stage === 'secondary') row.push(Number(c.projectScore.toFixed(2)), Number(c.readingScore.toFixed(2)), Number(c.totalBonus.toFixed(2)));
        row.push(Number(c.finalWeightedSum.toFixed(2)), Number(c.termAvg.toFixed(2)), Number(c.t2.toFixed(2)), Number(c.t3.toFixed(2)), Number(c.annualAvg.toFixed(2)), c.award.label);
        aoa.push(row);
      });
    } else {
      const grp = getCurrentStageGroup(stage);
      aoa.push([`كشف نقاط مادة: ${grp.subjectName} — الفوج: ${grp.groupName} — المعامل: ${grp.coeff}`]);
      const hasExtra = (stage === 'secondary' && (grp.category === 'languages' || grp.category === 'practical'));
      const headers = ['الرقم', 'اللقب والاسم', 'التقييم المستمر / النشاطات'];
      if (stage !== 'primary') headers.push('علامة الفرض');
      if (stage === 'middle') headers.push('معدل التقييم المستمر (م.ت.م)');
      if (hasExtra) headers.push(grp.category === 'languages' ? 'التعبير الشفوي' : 'الأعمال التطبيقية');
      headers.push(stage === 'primary' ? 'الاختبار (/10)' : 'علامة الاختبار (/40)', 'المعدل الفصلي للمادة', `الجداء (×${grp.coeff})`, 'الملاحظة وتبرير دفتر التقويم');
      aoa.push(headers);

      grp.students.forEach((st, idx) => {
        const c = computeStudentSubjectGrade(st, grp);
        const row = [idx + 1, st.name, Number(c.cont.toFixed(2))];
        if (stage !== 'primary') row.push(Number(c.devoir.toFixed(2)));
        if (stage === 'middle') row.push(Number(c.mtm.toFixed(2)));
        if (hasExtra) row.push(Number(c.extra.toFixed(2)));
        row.push(Number((stage === 'primary' ? c.examOn10 : c.examOn40).toFixed(2)), Number(c.avg.toFixed(2)), Number(c.weighted.toFixed(2)), c.remark);
        aoa.push(row);
      });
    }

    if (typeof XLSX !== 'undefined') {
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws['!views'] = [{ rightToLeft: true }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'كشف_النقاط');
      XLSX.writeFile(wb, `كشف_النقاط_${stage}.xlsx`);
      showToast('تم تصدير ملف Excel (.xlsx) بنجاح!');
    }
  }

  // Page Navigation Router (works for both SPA in Canvas and standalone pages in Repo)
  window.navigateAppPage = function (pageName) {
    state.currentPage = pageName;
    saveState();

    const pageHome = document.getElementById('pageHome');
    const pageStage = document.getElementById('pageStageWorkspace');
    const pageRules = document.getElementById('pageRules');

    // If we are in the single-file SPA mode (all page containers exist)
    if (pageHome && pageStage && pageRules) {
      pageHome.classList.toggle('hidden', pageName !== 'home');
      pageStage.classList.toggle('hidden', !['primary', 'middle', 'secondary'].includes(pageName));
      pageRules.classList.toggle('hidden', pageName !== 'rules');

      // Highlight top nav page buttons
      ['home', 'primary', 'middle', 'secondary', 'rules'].forEach(p => {
        const btn = document.getElementById(`topNav_${p}`);
        if (!btn) return;
        if (p === pageName) {
          btn.className = 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-1.5 bg-white text-emerald-950 shadow-sm shrink-0';
        } else {
          btn.className = 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 bg-white/10 text-white hover:bg-white/20 shrink-0';
        }
      });

      if (pageName === 'home') renderHomeOverview();
      if (['primary', 'middle', 'secondary'].includes(pageName)) renderStageWorkspace();
    }
  };

  window.switchStageSubTab = function (subTabName) {
    const stage = getActiveStage();
    state.stageSubTab[stage] = subTabName;
    saveState();
    renderStageWorkspace();
  };

  window.addEventListener('DOMContentLoaded', () => {
    // Bind profile inputs
    document.getElementById('teacherNameInput')?.addEventListener('input', (e) => {
      state.teacherName = e.target.value;
      saveState();
    });
    document.getElementById('schoolNameInput')?.addEventListener('input', (e) => {
      state.schoolName = e.target.value;
      saveState();
    });
    document.getElementById('schoolYearInput')?.addEventListener('input', (e) => {
      state.schoolYear = e.target.value;
      saveState();
    });

    // Bind Top Page Navigation buttons (SPA mode)
    ['home', 'primary', 'middle', 'secondary', 'rules'].forEach(p => {
      document.getElementById(`topNav_${p}`)?.addEventListener('click', () => window.navigateAppPage(p));
    });

    // Bind Landing Page Portal Cards (SPA mode)
    document.querySelectorAll('[data-goto-page]').forEach(el => {
      el.addEventListener('click', () => {
        const target = el.getAttribute('data-goto-page');
        const sub = el.getAttribute('data-goto-subtab');
        if (sub && STAGE_META[target]) state.stageSubTab[target] = sub;
        window.navigateAppPage(target);
      });
    });

    // Sub-tab buttons inside Stage Workspace
    document.getElementById('btnStageSubSubject')?.addEventListener('click', () => window.switchStageSubTab('subject'));
    document.getElementById('btnStageSubHomeroom')?.addEventListener('click', () => window.switchStageSubTab('homeroom'));
    document.getElementById('btnStageSubAnalytics')?.addEventListener('click', () => window.switchStageSubTab('analytics'));

    // Global Excel Import / Export / Print / Reset
    const fileInput = document.getElementById('excelFileInput');
    document.getElementById('btnTriggerExcelImport')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleExcelFileUpload(e.target.files[0]);
        e.target.value = '';
      }
    });
    document.getElementById('btnExportExcel')?.addEventListener('click', exportToExcelFile);
    document.getElementById('btnPrintCurrent')?.addEventListener('click', () => window.print());
    document.getElementById('btnResetDemo')?.addEventListener('click', () => {
      if (!window.confirm('سيتم مسح بيانات الأستاذ الحالية من هذا المتصفح وإعادة تهيئة لوحة فارغة. هل أنشأت نسخة احتياطية؟')) return;
      state = getDefaultState();
      saveState();
      const fixedStage = document.body.getAttribute('data-fixed-stage');
      if (fixedStage) renderStageWorkspace();
      else window.navigateAppPage(state.currentPage || 'home');
      showToast('تمت إعادة تهيئة لوحة فارغة بنجاح', '🔄');
    });

    // Subject Mode Controls
    document.getElementById('selectSubjectGroup')?.addEventListener('change', (e) => {
      const stage = getActiveStage();
      state.activeGroupByStage[stage] = e.target.value;
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('subjectYearLevelSelect')?.addEventListener('change', (e) => {
      const grp = getCurrentStageGroup(getActiveStage());
      if (grp) { grp.yearLevel = e.target.value; saveState(); renderStageWorkspace(); }
    });

    document.getElementById('subjectCategorySelect')?.addEventListener('change', (e) => {
      const grp = getCurrentStageGroup(getActiveStage());
      if (grp) { grp.category = e.target.value; saveState(); renderStageWorkspace(); }
    });

    document.getElementById('subjectNameInput')?.addEventListener('input', (e) => {
      const grp = getCurrentStageGroup(getActiveStage());
      if (grp) { grp.subjectName = e.target.value; saveState(); }
    });

    document.getElementById('subjectCoeffInput')?.addEventListener('input', (e) => {
      const grp = getCurrentStageGroup(getActiveStage());
      if (grp) { grp.coeff = Math.max(1, parseInt(e.target.value, 10) || 1); saveState(); renderStageWorkspace(); }
    });

    document.getElementById('examScaleSelect')?.addEventListener('change', (e) => {
      const grp = getCurrentStageGroup(getActiveStage());
      if (grp) { grp.examScale = parseInt(e.target.value, 10); saveState(); renderStageWorkspace(); }
    });

    document.getElementById('subjectTermSelect')?.addEventListener('change', (e) => {
      const grp = getCurrentStageGroup(getActiveStage());
      if (grp) { grp.term = parseInt(e.target.value, 10); saveState(); renderStageWorkspace(); }
    });

    document.getElementById('btnAddStudentSubject')?.addEventListener('click', () => {
      const stage = getActiveStage();
      const grp = getCurrentStageGroup(stage);
      grp.students.push({
        id: createStudentId('st'), studentKey: createStudentId('student'),
        name: '', cont: 0, devoir: 0, extra: 0, exam: 0,
        qualLevel: '', customRemark: '', rubric: {}
      });
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('btnSyncToHomeroom')?.addEventListener('click', () => {
      const stage = getActiveStage();
      const grp = getCurrentStageGroup(stage);
      const hr = getStageHomeroom(stage);
      let targetSub = hr.subjects.find(s => s.name.includes(grp.subjectName) || grp.subjectName.includes(s.name));
      if (!targetSub) {
        targetSub = { id: 'sub_' + Date.now(), name: grp.subjectName, coeff: grp.coeff };
        hr.subjects.push(targetSub);
      }
      grp.students.forEach(st => {
        if (!String(st.name || '').trim()) return;
        const calc = computeStudentSubjectGrade(st, grp);
        let hrStudent = hr.students.find(h => (st.studentKey && h.studentKey === st.studentKey) || h.name.trim() === st.name.trim());
        if (!hrStudent) {
          hrStudent = {
            id: createStudentId('hr'), studentKey: st.studentKey || createStudentId('student'),
            name: st.name, grades: {}, projectScore: 0, readingScore: 0, examMarks: {}, devoirMarks: {},
            t2Avg: 0, t3Avg: 0, attendanceRegular: false
          };
          hr.students.push(hrStudent);
        }
        if (!hrStudent.studentKey) hrStudent.studentKey = st.studentKey || createStudentId('student');
        if (!st.studentKey) st.studentKey = hrStudent.studentKey;
        hrStudent.grades[targetSub.id] = Number(calc.avg.toFixed(2));
        hrStudent.examMarks = hrStudent.examMarks || {};
        hrStudent.devoirMarks = hrStudent.devoirMarks || {};
        hrStudent.examMarks[targetSub.id] = Number(calc.examOn20.toFixed(2));
        hrStudent.devoirMarks[targetSub.id] = Number(calc.devoir.toFixed(2));
      });
      saveState();
      showToast(`تم ترحيل معدلات "${grp.subjectName}" إلى كشف الأستاذ الرئيسي لهذا الطور!`);
    });

    document.getElementById('searchSubjectStudent')?.addEventListener('input', (e) => {
      searchSubjectQuery = e.target.value;
      renderStageWorkspace();
    });

    document.getElementById('btnSortSubjectByRank')?.addEventListener('click', () => {
      const grp = getCurrentStageGroup(getActiveStage());
      grp.students.sort((a, b) => computeStudentSubjectGrade(b, grp).avg - computeStudentSubjectGrade(a, grp).avg);
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('subjectTableBody')?.addEventListener('change', (e) => {
      const target = e.target;
      if (!target.classList.contains('sub-student-input')) return;
      const stage = getActiveStage();
      const grp = getCurrentStageGroup(stage);
      const student = grp.students.find(s => s.id === target.getAttribute('data-id'));
      if (!student) return;
      const field = target.getAttribute('data-field');
      if (field === 'name' || field === 'customRemark' || field === 'qualLevel') {
        student[field] = target.value;
      } else {
        const maxVal = stage === 'primary' ? 10 : ((field === 'exam' && Number(grp.examScale) === 40) ? 40 : 20);
        student[field] = clamp(target.value, 0, maxVal);
      }
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('subjectTableBody')?.addEventListener('click', (e) => {
      const rubBtn = e.target.closest('.btn-open-rubric');
      if (rubBtn) {
        openRubricModal(rubBtn.getAttribute('data-rubric-id'));
        return;
      }
      const delBtn = e.target.closest('.btn-del-sub-student');
      if (delBtn) {
        const grp = getCurrentStageGroup(getActiveStage());
        grp.students = grp.students.filter(s => s.id !== delBtn.getAttribute('data-del-sub'));
        saveState();
        renderStageWorkspace();
      }
    });

    // Rubric Modal Listeners
    const modalRubric = document.getElementById('modalRubricCalc');
    const closeRubric = () => { modalRubric?.classList.add('hidden'); modalRubric?.classList.remove('flex'); };
    document.getElementById('btnCloseRubricModal')?.addEventListener('click', closeRubric);
    document.getElementById('btnCancelRubric')?.addEventListener('click', closeRubric);
    document.getElementById('rubricSectionsContainer')?.addEventListener('input', recalcRubricModalPreview);
    document.getElementById('btnApplyRubric')?.addEventListener('click', applyRubricToStudent);

    // Homeroom Controls
    document.getElementById('homeroomPresetSelect')?.addEventListener('change', (e) => {
      const stage = getActiveStage();
      const hr = getStageHomeroom(stage);
      const presetKey = e.target.value;
      hr.preset = presetKey;
      if (HOMEROOM_SUBJECT_PRESETS[presetKey]) {
        hr.subjects = JSON.parse(JSON.stringify(HOMEROOM_SUBJECT_PRESETS[presetKey]));
      }
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('homeroomClassName')?.addEventListener('input', (e) => {
      const hr = getStageHomeroom(getActiveStage());
      hr.className = e.target.value;
      saveState();
    });

    document.getElementById('homeroomActiveTerm')?.addEventListener('change', (e) => {
      const hr = getStageHomeroom(getActiveStage());
      hr.activeTerm = parseInt(e.target.value, 10);
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('btnAddHomeroomStudent')?.addEventListener('click', () => {
      const stage = getActiveStage();
      const hr = getStageHomeroom(stage);
      const grades = {};
      hr.subjects.forEach(subject => { grades[subject.id] = 0; });
      hr.students.push({
        id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'hrs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        name: '', grades, projectScore: 0, readingScore: 0, t2Avg: 0, t3Avg: 0, attendanceRegular: false
      });
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('btnSortHomeroomRank')?.addEventListener('click', () => {
      const hr = getStageHomeroom(getActiveStage());
      hr.students.sort((a, b) => computeHomeroomStudent(b, hr).termAvg - computeHomeroomStudent(a, hr).termAvg);
      saveState();
      renderStageWorkspace();
    });

    document.getElementById('homeroomTableBody')?.addEventListener('change', (e) => {
      const t = e.target;
      const stage = getActiveStage();
      const hr = getStageHomeroom(stage);
      const scaleMax = stage === 'primary' ? 10 : 20;
      if (t.classList.contains('hr-attendance-input')) {
        const st = hr.students.find(student => student.id === t.getAttribute('data-hr-student'));
        if (st) { st.attendanceRegular = t.checked; saveState(); renderStageWorkspace(); }
      } else if (t.classList.contains('hr-grade-input')) {
        const st = hr.students.find(s => s.id === t.getAttribute('data-hr-student'));
        if (st) {
          st.grades[t.getAttribute('data-hr-sub')] = clamp(t.value, 0, scaleMax);
          saveState();
          renderStageWorkspace();
        }
      } else if (t.classList.contains('hr-meta-input')) {
        const st = hr.students.find(s => s.id === t.getAttribute('data-hr-student'));
        const field = t.getAttribute('data-hr-field');
        if (st) {
          st[field] = field === 'name' ? t.value : clamp(t.value, 0, 20);
          saveState();
          renderStageWorkspace();
        }
      }
    });

    document.getElementById('homeroomTableBody')?.addEventListener('click', (e) => {
      const reportBtn = e.target.closest('.btn-open-report');
      if (reportBtn) {
        openStudentReportModal(reportBtn.getAttribute('data-report-id'));
        return;
      }
      const delBtn = e.target.closest('.btn-del-hr-student');
      if (delBtn) {
        const hr = getStageHomeroom(getActiveStage());
        hr.students = hr.students.filter(s => s.id !== delBtn.getAttribute('data-del-hr'));
        saveState();
        renderStageWorkspace();
      }
    });

    // Report Modal
    const modalReport = document.getElementById('modalReportCard');
    document.getElementById('btnCloseReportModal')?.addEventListener('click', () => {
      modalReport?.classList.add('hidden');
      modalReport?.classList.remove('flex');
    });
    document.getElementById('btnPrintModalReport')?.addEventListener('click', () => window.print());

    // Paste Modal
    const modalImport = document.getElementById('modalImportNames');
    const closeImport = () => { modalImport?.classList.add('hidden'); modalImport?.classList.remove('flex'); };
    document.getElementById('btnOpenPasteModal')?.addEventListener('click', () => {
      modalImport?.classList.remove('hidden');
      modalImport?.classList.add('flex');
    });
    document.getElementById('btnCloseImportModal')?.addEventListener('click', closeImport);
    document.getElementById('btnCancelImport')?.addEventListener('click', closeImport);
    document.getElementById('btnConfirmImport')?.addEventListener('click', () => {
      const raw = document.getElementById('importNamesTextarea').value;
      const rows = parseCsvRows(raw);
      if (!rows.length) return;
      const target = document.getElementById('importTargetSelect').value;
      const result = importRosterRows(rows, target);
      document.getElementById('importNamesTextarea').value = '';
      saveState();
      closeImport();
      renderStageWorkspace();
      showToast(`استيراد مكتمل: ${result.added} تلميذاً، ${result.skipped} مكرر/متجاوز`);
    });

    document.getElementById('btnImportGoogleSheet')?.addEventListener('click', async () => {
      const input = document.getElementById('googleSheetUrl');
      const button = document.getElementById('btnImportGoogleSheet');
      try {
        const csvUrl = googleSheetsCsvUrl(input?.value);
        button.disabled = true;
        button.textContent = 'جارٍ جلب الجدول...';
        const response = await fetch(csvUrl, { mode: 'cors', credentials: 'omit' });
        if (!response.ok) throw new Error('تعذر الوصول إلى الجدول. تحقق من نشره أو صلاحية العرض عبر الرابط');
        const rows = parseCsvRows(await response.text());
        const target = document.getElementById('importTargetSelect').value;
        const result = importRosterRows(rows, target);
        saveState();
        renderStageWorkspace();
        showToast(`استيراد Google Sheets: ${result.added} تلميذاً، ${result.skipped} مكرر/متجاوز`);
      } catch (error) {
        showToast(error.message || 'تعذر استيراد Google Sheets؛ تحقق من صلاحية المشاركة', '⚠️');
      } finally {
        if (button) { button.disabled = false; button.textContent = 'استيراد من Google Sheets'; }
      }
    });

    // Assessment schedule controls and ministerial validation.
    const scheduleModal = document.getElementById('modalSchedule');
    const closeSchedule = () => { scheduleModal?.classList.add('hidden'); scheduleModal?.classList.remove('flex'); };
    document.getElementById('btnOpenSchedule')?.addEventListener('click', () => {
      renderScheduleManager();
      scheduleModal?.classList.remove('hidden');
      scheduleModal?.classList.add('flex');
    });
    document.getElementById('btnCloseSchedule')?.addEventListener('click', closeSchedule);
    document.getElementById('btnSaveScheduledTest')?.addEventListener('click', () => {
      const stage = getActiveStage();
      const group = getCurrentStageGroup(stage);
      if (!group) { showToast('أنشئ فوجاً قبل جدولة الفروض.', '⚠️'); return; }
      const candidate = {
        id: createStudentId('schedule'), stage, groupId: group.id, groupName: group.groupName,
        subjectName: document.getElementById('scheduleSubject').value.trim(),
        term: Number(document.getElementById('scheduleTerm').value),
        testDate: document.getElementById('scheduleTestDate').value,
        correctionDate: document.getElementById('scheduleCorrectionDate').value,
        remediationDate: document.getElementById('scheduleRemediationDate').value,
        examStartDate: document.getElementById('scheduleExamStartDate').value
      };
      if (!candidate.subjectName || !candidate.testDate || !candidate.correctionDate || !candidate.remediationDate || !candidate.examStartDate) {
        showToast('أكمل المادة وجميع التواريخ المطلوبة.', '⚠️'); return;
      }
      const error = validateScheduledTest(candidate);
      if (error) { showToast(error, '⚠️'); return; }
      state.assessmentSchedule.push(candidate);
      saveState();
      renderScheduleManager();
      showToast('تمت إضافة الفرض بعد اجتياز قيود الجدولة.');
    });
    document.getElementById('btnAddClosedWeek')?.addEventListener('click', () => {
      const group = getCurrentStageGroup(getActiveStage());
      if (!group) { showToast('أنشئ فوجاً أولاً.', '⚠️'); return; }
      const startDate = document.getElementById('closedWeekStart').value;
      const endDate = document.getElementById('closedWeekEnd').value;
      if (!startDate || !endDate || startDate > endDate) { showToast('أدخل بداية ونهاية صحيحتين للأسبوع المغلق.', '⚠️'); return; }
      const stage = getActiveStage();
      const exists = state.closedWeeks.some(item => item.stage === stage && item.groupId === group.id && item.startDate === startDate && item.endDate === endDate);
      if (exists) { showToast('فترة الأسبوع المغلق مسجلة مسبقاً.', '⚠️'); return; }
      state.closedWeeks.push({ id: createStudentId('closed'), stage, groupId: group.id, startDate, endDate });
      saveState();
      renderScheduleManager();
      showToast('تم حفظ فترة الأسبوع المغلق.');
    });
    document.getElementById('scheduleEntriesList')?.addEventListener('click', event => {
      const button = event.target.closest('[data-delete-schedule]');
      if (!button) return;
      state.assessmentSchedule = state.assessmentSchedule.filter(item => item.id !== button.getAttribute('data-delete-schedule'));
      saveState(); renderScheduleManager();
    });
    document.getElementById('closedWeeksList')?.addEventListener('click', event => {
      const button = event.target.closest('[data-delete-closed-week]');
      if (!button) return;
      state.closedWeeks = state.closedWeeks.filter(item => item.id !== button.getAttribute('data-delete-closed-week'));
      saveState(); renderScheduleManager();
    });

    // New Group Modal
    const modalNewGroup = document.getElementById('modalNewGroup');
    const closeNewGroup = () => { modalNewGroup?.classList.add('hidden'); modalNewGroup?.classList.remove('flex'); };
    document.getElementById('btnNewGroupModal')?.addEventListener('click', () => {
      modalNewGroup?.classList.remove('hidden');
      modalNewGroup?.classList.add('flex');
    });
    document.getElementById('btnCloseNewGroupModal')?.addEventListener('click', closeNewGroup);
    document.getElementById('btnCancelNewGroup')?.addEventListener('click', closeNewGroup);
    document.getElementById('btnConfirmNewGroup')?.addEventListener('click', () => {
      const stage = getActiveStage();
      const meta = STAGE_META[stage];
      const name = document.getElementById('newGroupNameInput').value.trim() || `فوج جديد`;
      const subjectName = document.getElementById('newGroupSubjectInput').value.trim() || 'مادة تعليمية';
      const coeff = Math.max(1, parseInt(document.getElementById('newGroupCoeffInput').value, 10) || 1);
      const newGrp = {
        id: 'grp_' + Date.now(),
        stage,
        groupName: name,
        yearLevel: meta.levels[0].value,
        category: meta.categories[0].value,
        subjectName,
        coeff,
        examScale: stage === 'primary' ? 10 : 20,
        term: 1,
        students: []
      };
      state.groups.push(newGrp);
      state.activeGroupByStage[stage] = newGrp.id;
      saveState();
      closeNewGroup();
      renderStageWorkspace();
    });

    document.getElementById('btnDeleteGroup')?.addEventListener('click', () => {
      const stage = getActiveStage();
      const stgGroups = getStageGroups(stage);
      if (stgGroups.length <= 1) {
        showToast('يجب الإبقاء على فوج واحد على الأقل في هذا الطور', '⚠️');
        return;
      }
      const activeId = state.activeGroupByStage[stage];
      state.groups = state.groups.filter(g => g.id !== activeId);
      state.activeGroupByStage[stage] = getStageGroups(stage)[0].id;
      saveState();
      renderStageWorkspace();
    });

    // Subjects Config Modal
    const modalSubjects = document.getElementById('modalEditSubjects');
    const renderSubjectsConfigList = () => {
      const hr = getStageHomeroom(getActiveStage());
      document.getElementById('subjectsConfigList').innerHTML = hr.subjects.map((sub, i) => `
        <div class="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <input type="text" value="${escapeHtml(sub.name)}" data-cfg-idx="${i}" data-cfg-field="name"
            class="cfg-sub-input flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold" />
          <input type="number" min="1" max="10" value="${escapeHtml(sub.coeff)}" data-cfg-idx="${i}" data-cfg-field="coeff"
            class="cfg-sub-input num-input w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-bold" />
          <button type="button" data-cfg-del="${i}" class="btn-cfg-del-sub px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold">✕</button>
        </div>
      `).join('');
    };
    document.getElementById('btnOpenSubjectsModal')?.addEventListener('click', () => {
      renderSubjectsConfigList();
      modalSubjects?.classList.remove('hidden');
      modalSubjects?.classList.add('flex');
    });
    const closeSubModal = () => { modalSubjects?.classList.add('hidden'); modalSubjects?.classList.remove('flex'); };
    document.getElementById('btnCloseSubjectsModal')?.addEventListener('click', closeSubModal);
    document.getElementById('btnCancelSubjectsModal')?.addEventListener('click', closeSubModal);
    document.getElementById('subjectsConfigList')?.addEventListener('input', (e) => {
      const t = e.target;
      if (!t.classList.contains('cfg-sub-input')) return;
      const hr = getStageHomeroom(getActiveStage());
      const idx = parseInt(t.getAttribute('data-cfg-idx'), 10);
      const f = t.getAttribute('data-cfg-field');
      if (hr.subjects[idx]) {
        hr.subjects[idx][f] = f === 'name' ? t.value : Math.max(1, parseInt(t.value, 10) || 1);
      }
    });
    document.getElementById('subjectsConfigList')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-cfg-del-sub');
      const hr = getStageHomeroom(getActiveStage());
      if (!btn || hr.subjects.length <= 1) return;
      hr.subjects.splice(parseInt(btn.getAttribute('data-cfg-del'), 10), 1);
      renderSubjectsConfigList();
    });
    document.getElementById('btnAddConfigSubject')?.addEventListener('click', () => {
      const hr = getStageHomeroom(getActiveStage());
      hr.subjects.push({ id: 'custom_' + Date.now(), name: 'مادة جديدة', coeff: 1 });
      renderSubjectsConfigList();
    });
    document.getElementById('btnSaveSubjectsModal')?.addEventListener('click', () => {
      saveState();
      closeSubModal();
      renderStageWorkspace();
    });

    document.getElementById('analyticsSourceSelect')?.addEventListener('change', () => renderAnalyticsForStage(getActiveStage()));

    // Initial boot depending on standalone file vs SPA
    const fixedStage = document.body.getAttribute('data-fixed-stage');
    const fixedPage = document.body.getAttribute('data-fixed-page');
    if (fixedStage) {
      state.currentPage = fixedStage;
      renderStageWorkspace();
    } else if (fixedPage === 'home') {
      renderHomeOverview();
    } else if (fixedPage === 'rules') {
      syncProfileUI();
    } else {
      window.navigateAppPage(state.currentPage || 'home');
    }
  });
})();
