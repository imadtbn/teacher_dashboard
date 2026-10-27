(function () {
  const STORAGE_KEY = 'dz_teacher_grade_dashboard_v3_multi';

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
    return {
      teacherName: 'الأستاذ(ة): بن سالم عبد القادر',
      schoolName: 'مؤسسة التربية والتعليم - سيدي داود (بومرداس)',
      schoolYear: '2026 / 2027',
      currentPage: 'home', // 'home' | 'primary' | 'middle' | 'secondary' | 'rules'
      stageSubTab: {
        primary: 'subject',
        middle: 'subject',
        secondary: 'subject'
      },
      activeGroupByStage: {
        primary: 'grp_pri_1',
        middle: 'grp_mid_1',
        secondary: 'grp_sec_1'
      },
      groups: [
        // Primary Groups
        {
          id: 'grp_pri_1',
          stage: 'primary',
          groupName: '3 ابتدائي ف1',
          yearLevel: 'p3',
          category: 'pri_core',
          subjectName: 'اللغة العربية',
          coeff: 1,
          examScale: 10,
          term: 1,
          students: [
            { id: 'p1', name: 'بلقاسم ريان', cont: 8.5, devoir: 8.0, extra: 8.5, exam: 8.0, qualLevel: 'A', customRemark: '', rubric: { p1: 3.5, p2: 3.0, p3: 2.0 } },
            { id: 'p2', name: 'شتوح سيرين', cont: 9.5, devoir: 9.0, extra: 9.0, exam: 9.0, qualLevel: 'A', customRemark: '', rubric: { p1: 3.5, p2: 3.5, p3: 2.5 } },
            { id: 'p3', name: 'علاوي آدم', cont: 6.5, devoir: 6.0, extra: 6.5, exam: 6.0, qualLevel: 'B', customRemark: '', rubric: { p1: 2.5, p2: 2.0, p3: 2.0 } },
            { id: 'p4', name: 'مقراني يسرى', cont: 7.5, devoir: 7.0, extra: 7.5, exam: 8.0, qualLevel: 'A', customRemark: '', rubric: { p1: 3.0, p2: 2.5, p3: 2.0 } }
          ]
        },
        {
          id: 'grp_pri_2',
          stage: 'primary',
          groupName: '1 ابتدائي ف1 (وصفي)',
          yearLevel: 'p1',
          category: 'pri_core',
          subjectName: 'الرياضيات',
          coeff: 1,
          examScale: 10,
          term: 1,
          students: [
            { id: 'p1_1', name: 'حميدي أنس', cont: 9.0, devoir: 9.0, extra: 9.0, exam: 9.0, qualLevel: 'A', customRemark: '' },
            { id: 'p1_2', name: 'قندوز مرام', cont: 8.0, devoir: 8.0, extra: 8.0, exam: 8.0, qualLevel: 'B', customRemark: '' },
            { id: 'p1_3', name: 'زروقي لقمان', cont: 6.0, devoir: 6.0, extra: 6.0, exam: 6.0, qualLevel: 'C', customRemark: '' }
          ]
        },
        // Middle School Groups
        {
          id: 'grp_mid_1',
          stage: 'middle',
          groupName: '4 متوسط ف1',
          yearLevel: 'm4',
          category: 'mid_standard',
          subjectName: 'الرياضيات',
          coeff: 4,
          examScale: 20,
          term: 1,
          students: [
            { id: 'm1', name: 'مسعودي آدم', cont: 16.5, devoir: 15.0, extra: 15.0, exam: 16.0, qualLevel: 'A', customRemark: '', rubric: { m1: 6.0, m2: 5.5, m3: 5.0 } },
            { id: 'm2', name: 'رحماني آية', cont: 18.5, devoir: 19.0, extra: 18.0, exam: 18.0, qualLevel: 'A', customRemark: '', rubric: { m1: 6.5, m2: 6.0, m3: 6.0 } },
            { id: 'm3', name: 'مراد إسلام', cont: 11.5, devoir: 10.0, extra: 11.0, exam: 10.5, qualLevel: 'B', customRemark: '', rubric: { m1: 4.5, m2: 3.5, m3: 3.5 } },
            { id: 'm4', name: 'حمزاوي ريان', cont: 9.5, devoir: 8.0, extra: 9.0, exam: 8.5, qualLevel: 'C', customRemark: '', rubric: { m1: 4.0, m2: 3.0, m3: 2.5 } },
            { id: 'm5', name: 'بختي ملاك', cont: 14.5, devoir: 13.5, extra: 14.0, exam: 14.0, qualLevel: 'A', customRemark: '', rubric: { m1: 5.5, m2: 4.5, m3: 4.5 } }
          ]
        },
        // Secondary School Groups
        {
          id: 'grp_sec_1',
          stage: 'secondary',
          groupName: '2 ثانوي علوم تجريبية ف1',
          yearLevel: 's2',
          category: 'practical',
          subjectName: 'العلوم الفيزيائية',
          coeff: 4,
          examScale: 20,
          term: 1,
          students: [
            { id: 's1', name: 'بن عيسى عبد الرحمان', cont: 16.5, devoir: 15.0, extra: 17.0, exam: 16.0, qualLevel: 'A', customRemark: '', rubric: { c1: 8.5, c2: 8.0, e1: 8.5, e2: 8.5 } },
            { id: 's2', name: 'بوزيدي مريم', cont: 18.5, devoir: 17.5, extra: 19.0, exam: 18.0, qualLevel: 'A', customRemark: '', rubric: { c1: 9.5, c2: 9.0, e1: 9.5, e2: 9.5 } },
            { id: 's3', name: 'خليفي ياسين', cont: 13.5, devoir: 11.5, extra: 14.0, exam: 12.5, qualLevel: 'B', customRemark: '', rubric: { c1: 7.0, c2: 6.5, e1: 7.0, e2: 7.0 } },
            { id: 's4', name: 'قاسمي سارة', cont: 15.5, devoir: 14.0, extra: 16.0, exam: 14.5, qualLevel: 'A', customRemark: '', rubric: { c1: 8.0, c2: 7.5, e1: 8.0, e2: 8.0 } },
            { id: 's5', name: 'تواتي أيمن', cont: 11.0, devoir: 9.0, extra: 11.5, exam: 9.5, qualLevel: 'C', customRemark: '', rubric: { c1: 6.0, c2: 5.0, e1: 6.0, e2: 5.5 } },
            { id: 's6', name: 'سليماني لينا', cont: 17.5, devoir: 16.5, extra: 18.0, exam: 17.0, qualLevel: 'A', customRemark: '', rubric: { c1: 9.0, c2: 8.5, e1: 9.0, e2: 9.0 } }
          ]
        }
      ],
      homeroomByStage: {
        primary: {
          stage: 'primary',
          preset: 'pri_y3',
          className: 'السنة 3 ابتدائي - الفوج 1',
          activeTerm: 1,
          subjects: JSON.parse(JSON.stringify(HOMEROOM_SUBJECT_PRESETS.pri_y3)),
          students: [
            { id: 'hp1', name: 'بلقاسم ريان', grades: { arab: 8.5, math: 8.0, fr: 7.5, en: 8.0, isl: 9.0, hist: 8.0, sci: 8.5, civ: 9.0, art: 9.5 }, projectScore: 10, readingScore: 10, t2Avg: 8.4, t3Avg: 8.6 },
            { id: 'hp2', name: 'شتوح سيرين', grades: { arab: 9.5, math: 9.0, fr: 9.0, en: 9.0, isl: 9.5, hist: 9.0, sci: 9.5, civ: 9.5, art: 9.5 }, projectScore: 10, readingScore: 10, t2Avg: 9.3, t3Avg: 9.5 },
            { id: 'hp3', name: 'علاوي آدم', grades: { arab: 6.5, math: 6.0, fr: 5.5, en: 6.0, isl: 7.5, hist: 6.5, sci: 6.5, civ: 7.5, art: 8.5 }, projectScore: 10, readingScore: 10, t2Avg: 6.8, t3Avg: 7.1 }
          ]
        },
        middle: {
          stage: 'middle',
          preset: 'mid_y4',
          className: 'السنة 4 متوسط - القسم 1',
          activeTerm: 1,
          subjects: JSON.parse(JSON.stringify(HOMEROOM_SUBJECT_PRESETS.mid_y4)),
          students: [
            { id: 'hm1', name: 'مسعودي آدم', grades: { arab: 15.0, math: 16.0, fr: 14.0, en: 14.5, hist: 15.5, phys: 16.0, snv: 15.5, isl: 17.0, civ: 16.5, sport: 18.0 }, projectScore: 15, readingScore: 15, t2Avg: 15.6, t3Avg: 16.0 },
            { id: 'hm2', name: 'رحماني آية', grades: { arab: 18.0, math: 18.5, fr: 17.5, en: 18.0, hist: 18.0, phys: 18.5, snv: 18.0, isl: 19.0, civ: 18.5, sport: 18.5 }, projectScore: 18, readingScore: 18, t2Avg: 18.3, t3Avg: 18.6 },
            { id: 'hm3', name: 'مراد إسلام', grades: { arab: 11.5, math: 10.5, fr: 10.0, en: 11.0, hist: 12.0, phys: 11.0, snv: 11.5, isl: 13.5, civ: 13.0, sport: 16.0 }, projectScore: 12, readingScore: 12, t2Avg: 11.8, t3Avg: 12.2 },
            { id: 'hm4', name: 'حمزاوي ريان', grades: { arab: 9.5, math: 8.5, fr: 8.0, en: 9.0, hist: 9.5, phys: 8.5, snv: 9.0, isl: 11.5, civ: 11.0, sport: 15.0 }, projectScore: 10, readingScore: 10, t2Avg: 9.8, t3Avg: 10.4 }
          ]
        },
        secondary: {
          stage: 'secondary',
          preset: 'sec_sci',
          className: '2 ثانوي علوم تجريبية 1',
          activeTerm: 1,
          subjects: JSON.parse(JSON.stringify(HOMEROOM_SUBJECT_PRESETS.sec_sci)),
          students: [
            { id: 'hs1', name: 'بن عيسى عبد الرحمان', grades: { math: 15.5, phys: 16.1, snv: 15.0, arab: 14.5, fr: 13.5, en: 14.0, hist: 15.0, isl: 16.5, info: 16.0, sport: 17.5 }, projectScore: 16.0, readingScore: 15.0, t2Avg: 15.85, t3Avg: 16.20 },
            { id: 'hs2', name: 'بوزيدي مريم', grades: { math: 18.0, phys: 18.2, snv: 17.5, arab: 17.0, fr: 16.5, en: 17.5, hist: 17.0, isl: 18.5, info: 18.0, sport: 18.0 }, projectScore: 18.5, readingScore: 18.0, t2Avg: 18.10, t3Avg: 18.35 },
            { id: 'hs3', name: 'خليفي ياسين', grades: { math: 11.5, phys: 12.8, snv: 12.0, arab: 13.0, fr: 11.0, en: 11.5, hist: 13.5, isl: 14.0, info: 13.5, sport: 16.0 }, projectScore: 14.0, readingScore: 13.0, t2Avg: 12.90, t3Avg: 13.25 },
            { id: 'hs4', name: 'قاسمي سارة', grades: { math: 14.0, phys: 14.9, snv: 14.5, arab: 15.0, fr: 14.5, en: 15.0, hist: 14.0, isl: 16.0, info: 15.5, sport: 17.0 }, projectScore: 16.5, readingScore: 16.0, t2Avg: 15.20, t3Avg: 15.45 }
          ]
        }
      }
    };
  }

  let state = loadState();
  let searchSubjectQuery = '';
  let activeRubricStudentId = null;
  let chartInstances = { brackets: null, awards: null, components: null };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.groups) && parsed.homeroomByStage) {
          return parsed;
        }
      }
    } catch (e) {}
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
    const qualInfo = QUALITATIVE_LEVELS.find(q => q.value === (student.qualLevel || 'A')) || QUALITATIVE_LEVELS[0];

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
      ? `${qualInfo.label} ${group.yearLevel === 'p1' ? '— انتقال آلي للسنة 2 ابتدائي' : '— تقييم وصفي نوعي (ف1)'}`
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
      const defaultGrade = isPrimary ? 6 : 10;
      const g = clamp(student.grades[sub.id] !== undefined ? student.grades[sub.id] : defaultGrade, 0, scaleMax);
      sumWeightedSubjects += g * c;
      sumCoeffs += c;
    });

    const projectScore = clamp(student.projectScore, 0, 20);
    const readingScore = clamp(student.readingScore, 0, 20);
    const bonusProject = homeroom.stage === 'secondary' ? Math.max(0, projectScore - 10) : 0;
    const bonusReading = homeroom.stage === 'secondary' ? Math.max(0, readingScore - 10) : 0;
    const totalBonus = bonusProject + bonusReading;

    const finalWeightedSum = sumWeightedSubjects + totalBonus;
    const termAvg = sumCoeffs > 0 ? (finalWeightedSum / sumCoeffs) : 0;
    const t2 = clamp(student.t2Avg !== undefined ? student.t2Avg : termAvg, 0, scaleMax);
    const t3 = clamp(student.t3Avg !== undefined ? student.t3Avg : termAvg, 0, scaleMax);
    const annualAvg = (termAvg + t2 + t3) / 3;

    const award = isPriY1
      ? { label: 'انتقال آلي (سنة 1)', cls: 'bg-sky-100 text-sky-900 border-sky-300' }
      : getCouncilAward(termAvg, scaleMax);

    return {
      isPrimary, isPriY1, scaleMax, sumWeightedSubjects, sumCoeffs,
      projectScore, readingScore, bonusProject, bonusReading, totalBonus,
      finalWeightedSum, termAvg, t2, t3, annualAvg, award
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
        `<option value="${g.id}" ${g.id === group.id ? 'selected' : ''}>${g.groupName} — ${g.subjectName}</option>`
      ).join('');
    }

    const levelSelect = document.getElementById('subjectYearLevelSelect');
    if (levelSelect) {
      if (!meta.levels.some(l => l.value === group.yearLevel)) group.yearLevel = meta.levels[0].value;
      levelSelect.innerHTML = meta.levels.map(l =>
        `<option value="${l.value}" ${l.value === group.yearLevel ? 'selected' : ''}>${l.label}</option>`
      ).join('');
    }

    const catSelect = document.getElementById('subjectCategorySelect');
    if (catSelect) {
      if (!meta.categories.some(c => c.value === group.category)) group.category = meta.categories[0].value;
      catSelect.innerHTML = meta.categories.map(c =>
        `<option value="${c.value}" ${c.value === group.category ? 'selected' : ''}>${c.label}</option>`
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
        listEl.innerHTML = allWarnings.slice(0, 5).map(w => `<li>${w} — انقر على «🧮 المعايير» لتوليد علامة موضوعية مستقلة.</li>`).join('');
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
              <input type="text" value="${st.name}" data-field="name" data-id="${st.id}"
                class="sub-student-input w-full bg-transparent font-bold text-slate-800 px-1.5 py-1 rounded" />
            </td>
            <td class="p-2.5 text-center bg-sky-50/40">
              <select data-field="qualLevel" data-id="${st.id}" class="sub-student-input rounded-xl border border-sky-300 bg-white px-3 py-1.5 text-xs font-bold text-sky-950">
                ${QUALITATIVE_LEVELS.map(q => `<option value="${q.value}" ${(st.qualLevel || 'A') === q.value ? 'selected' : ''}>${q.label}</option>`).join('')}
              </select>
            </td>
            <td class="p-2.5">
              <input type="text" value="${c.remark}" data-field="customRemark" data-id="${st.id}"
                class="sub-student-input w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5" />
            </td>
            <td class="p-2.5 text-center no-print">
              <button type="button" data-del-sub="${st.id}" class="btn-del-sub-student text-rose-500 hover:text-rose-700 font-bold px-2 py-1">✕</button>
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
              <input type="text" value="${st.name}" data-field="name" data-id="${st.id}"
                class="sub-student-input w-full bg-transparent font-bold text-slate-800 px-1.5 py-1 rounded" />
            </td>
            <td class="p-2.5 text-center no-print">
              <button type="button" data-rubric-id="${st.id}" class="btn-open-rubric px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold">
                🧮 الميادين
              </button>
            </td>
            <td class="p-2.5 text-center">
              <input type="number" min="0" max="10" step="0.25" value="${st.cont}" data-field="cont" data-id="${st.id}"
                class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold" />
            </td>
            ${!isActivityNoExam ? `
              <td class="p-2.5 text-center">
                <input type="number" min="0" max="10" step="0.25" value="${st.exam}" data-field="exam" data-id="${st.id}"
                  class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold" />
              </td>
            ` : ''}
            <td class="p-2.5 text-center text-sm ${avgColor} num-cell">${c.avg.toFixed(2)}</td>
            <td class="p-2.5 text-center font-bold text-slate-700 num-cell">${rankMap[st.id]}</td>
            <td class="p-2.5">
              <input type="text" value="${c.remark}" data-field="customRemark" data-id="${st.id}"
                class="sub-student-input w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" />
            </td>
            <td class="p-2.5 text-center no-print">
              <button type="button" data-del-sub="${st.id}" class="btn-del-sub-student text-rose-500 hover:text-rose-700 font-bold px-2 py-1">✕</button>
            </td>
          </tr>
        `;
      }

      const maxExamInput = Number(group.examScale) === 20 ? 20 : 40;
      const avgColor = c.avg >= 10 ? 'text-emerald-800 bg-emerald-50 font-extrabold' : 'text-rose-700 bg-rose-50 font-extrabold';
      const hasExtra = (stage === 'secondary' && (group.category === 'languages' || group.category === 'practical'));
      const contBorder = hasWarn ? 'border-amber-500 bg-amber-50' : 'border-slate-300';

      return `
        <tr class="hover:bg-slate-50/90 transition" data-student-id="${st.id}">
          <td class="p-2.5 text-center font-bold text-slate-400 num-cell">${idx + 1}</td>
          <td class="p-2.5">
            <div class="flex items-center gap-1">
              ${hasWarn ? `<span title="${c.warnings.join(' | ')}" class="text-amber-500 cursor-help">⚠️</span>` : ''}
              <input type="text" value="${st.name}" data-field="name" data-id="${st.id}"
                class="sub-student-input w-full bg-transparent font-bold text-slate-800 px-1.5 py-1 rounded" />
            </div>
          </td>
          <td class="p-2.5 text-center no-print">
            <button type="button" data-rubric-id="${st.id}" class="btn-open-rubric px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold shadow-sm">
              🧮 المعايير
            </button>
          </td>
          <td class="p-2.5 text-center">
            <input type="number" min="0" max="20" step="0.25" value="${st.cont}" data-field="cont" data-id="${st.id}"
              class="sub-student-input num-input w-20 rounded-lg border ${contBorder} px-2 py-1 text-xs sm:text-sm font-bold" />
          </td>
          <td class="p-2.5 text-center">
            <input type="number" min="0" max="20" step="0.25" value="${st.devoir}" data-field="devoir" data-id="${st.id}"
              class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs sm:text-sm font-bold" />
          </td>
          ${stage === 'middle' ? `
            <td class="p-2.5 text-center font-bold text-emerald-800 bg-emerald-50/50 num-cell">${c.mtm.toFixed(2)}</td>
          ` : ''}
          ${hasExtra ? `
            <td class="p-2.5 text-center bg-teal-50/30">
              <input type="number" min="0" max="20" step="0.25" value="${st.extra}" data-field="extra" data-id="${st.id}"
                class="sub-student-input num-input w-20 rounded-lg border border-teal-300 px-2 py-1 text-xs sm:text-sm font-bold" />
            </td>
          ` : ''}
          <td class="p-2.5 text-center">
            <input type="number" min="0" max="${maxExamInput}" step="0.25" value="${st.exam}" data-field="exam" data-id="${st.id}"
              class="sub-student-input num-input w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs sm:text-sm font-bold" />
          </td>
          <td class="p-2.5 text-center font-bold text-amber-900 bg-amber-50/50 num-cell">${c.examOn40.toFixed(2)}</td>
          <td class="p-2.5 text-center text-sm ${avgColor} num-cell">${c.avg.toFixed(2)}</td>
          <td class="p-2.5 text-center font-bold text-purple-900 bg-purple-50/40 num-cell">${c.weighted.toFixed(2)}</td>
          <td class="p-2.5 text-center font-bold text-slate-700 num-cell">${rankMap[st.id]}</td>
          <td class="p-2.5">
            <input type="text" value="${c.remark}" data-field="customRemark" data-id="${st.id}"
              class="sub-student-input w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" />
          </td>
          <td class="p-2.5 text-center no-print">
            <button type="button" data-del-sub="${st.id}" class="btn-del-sub-student text-rose-500 hover:text-rose-700 font-bold px-2 py-1">✕</button>
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
        `<option value="${p.value}" ${p.value === hr.preset ? 'selected' : ''}>${p.label}</option>`
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
    const passCount = isPriY1 ? count : computedList.filter(i => i.calc.termAvg >= meta.passMark).length;
    const passRate = count > 0 ? Math.round((passCount / count) * 100) : 0;
    const avgBonus = count > 0 ? computedList.reduce((a, b) => a + b.calc.totalBonus, 0) / count : 0;
    const honorCount = computedList.filter(i => (scaleMax === 10 ? i.calc.termAvg >= 6 : i.calc.termAvg >= 12)).length;

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
        <div class="truncate max-w-[95px]" title="${sub.name}">${sub.name}</div>
        <div class="text-[10px] ${isQualT1 ? 'text-sky-700' : 'text-teal-700'} font-bold">${isQualT1 ? 'وصفي (ف1)' : `معامل ${sub.coeff}`}</div>
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
          return `<td class="p-1.5 text-center bg-sky-50/40 border-l border-sky-100"><span class="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[11px] font-bold">تحكم مقبول</span></td>`;
        }
        const defaultVal = isPrimary ? 7 : 12;
        const val = st.grades[sub.id] !== undefined ? st.grades[sub.id] : defaultVal;
        return `
          <td class="p-1.5 text-center border-l border-slate-100">
            <input type="number" min="0" max="${scaleMax}" step="0.25" value="${val}"
              data-hr-student="${st.id}" data-hr-sub="${sub.id}"
              class="hr-grade-input num-input w-16 rounded-lg border border-slate-200 px-1.5 py-1 text-xs font-bold" />
          </td>
        `;
      }).join('');

      const secCellsHtml = stage === 'secondary' ? `
        <td class="p-1.5 text-center bg-amber-50/40 border-l border-amber-100">
          <input type="number" min="0" max="20" step="0.25" value="${st.projectScore}"
            data-hr-student="${st.id}" data-hr-field="projectScore"
            class="hr-meta-input num-input w-16 rounded-lg border border-amber-300 px-1.5 py-1 text-xs font-bold" />
        </td>
        <td class="p-1.5 text-center bg-amber-50/40 border-l border-amber-100">
          <input type="number" min="0" max="20" step="0.25" value="${st.readingScore}"
            data-hr-student="${st.id}" data-hr-field="readingScore"
            class="hr-meta-input num-input w-16 rounded-lg border border-amber-300 px-1.5 py-1 text-xs font-bold" />
        </td>
        <td class="p-2 text-center font-extrabold text-amber-800 bg-amber-100/50 border-l border-amber-200 num-cell">+${c.totalBonus.toFixed(2)}</td>
      ` : '';

      const termAvgCls = c.termAvg >= meta.passMark ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'bg-rose-50 text-rose-800 font-extrabold';
      const annualAvgCls = c.annualAvg >= meta.passMark ? 'bg-indigo-50 text-indigo-900 font-extrabold' : 'bg-rose-50 text-rose-800 font-extrabold';

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-2 text-center font-bold text-slate-400 num-cell">${idx + 1}</td>
          <td class="p-2 border-l border-slate-100">
            <input type="text" value="${st.name}" data-hr-student="${st.id}" data-hr-field="name"
              class="hr-meta-input w-full bg-transparent font-bold text-slate-800 px-1 py-0.5 rounded" />
          </td>
          ${subInputsHtml}
          ${secCellsHtml}
          <td class="p-2 text-center font-bold text-purple-900 bg-purple-50/40 num-cell">${isPriY1 ? '-' : c.finalWeightedSum.toFixed(2)}</td>
          <td class="p-2 text-center text-sm ${termAvgCls} num-cell">${isPriY1 ? 'وصفي' : c.termAvg.toFixed(2)}</td>
          <td class="p-1.5 text-center bg-slate-50/60">
            <input type="number" min="0" max="${scaleMax}" step="0.25" value="${st.t2Avg}"
              data-hr-student="${st.id}" data-hr-field="t2Avg"
              class="hr-meta-input num-input w-16 rounded-lg border border-slate-200 px-1 py-1 text-xs font-semibold" />
          </td>
          <td class="p-1.5 text-center bg-slate-50/60">
            <input type="number" min="0" max="${scaleMax}" step="0.25" value="${st.t3Avg}"
              data-hr-student="${st.id}" data-hr-field="t3Avg"
              class="hr-meta-input num-input w-16 rounded-lg border border-slate-200 px-1 py-1 text-xs font-semibold" />
          </td>
          <td class="p-2 text-center text-sm ${annualAvgCls} num-cell">${isPriY1 ? 'ينتقل آلياً' : c.annualAvg.toFixed(2)}</td>
          <td class="p-2 text-center font-bold text-slate-700 num-cell">${rankMap[st.id]}</td>
          <td class="p-2 text-center">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${c.award.cls}">${c.award.label}</span>
          </td>
          <td class="p-2 text-center no-print">
            <div class="flex items-center justify-center gap-1">
              <button type="button" data-report-id="${st.id}" class="btn-open-report px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold shadow-sm">
                📄 كشف
              </button>
              <button type="button" data-del-hr="${st.id}" class="btn-del-hr-student px-1.5 py-1 rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-bold">
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
      subtitle.textContent = `التلميذ(ة): ${st.name} — شبكة معايير تقييم نشاطات التلاميذ للطور المتوسط (/20) وفق الصفحة 3 من المنشور 522/2026`;
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
      subtitle.textContent = `التلميذ(ة): ${st.name} — شبكة المراقبة المستمرة للطور الثانوي وفق الصفحة 5 من المنشور 522/2026`;
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
            <td class="p-2.5 font-bold text-slate-800">${sub.name}</td>
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
          <td class="p-2.5 font-bold text-slate-800">${sub.name}</td>
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
          <div class="text-xs font-bold text-slate-700 mt-0.5">${state.schoolName || ''} — السنة الدراسية: ${state.schoolYear || '2026/2027'}</div>
          <h4 class="text-base sm:text-lg font-extrabold text-slate-900 mt-1">كشف نقاط التلميذ(ة): ${st.name}</h4>
          <div class="text-xs font-semibold text-slate-600 mt-1">
            القسم: <strong>${hr.className}</strong> | الأستاذ(ة): <strong>${state.teacherName || ''}</strong>
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
            <div class="text-xl font-extrabold text-indigo-950 mt-0.5 num-cell">${c.isPriY1 ? 'ينتقل آلياً' : `${c.annualAvg.toFixed(2)} / ${c.scaleMax}`}</div>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div class="text-xs font-bold text-slate-600">الرتبة في القسم</div>
            <div class="text-xl font-extrabold text-slate-900 mt-0.5 num-cell">${rank} / ${hr.students.length}</div>
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
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

        const importedNames = [];
        rows.forEach((row) => {
          if (!Array.isArray(row) || row.length === 0) return;
          const candidate = row.map(c => String(c).trim()).find(val => {
            if (!val || val.length < 3) return false;
            if (/^[0-9.,/-]+$/.test(val)) return false;
            const headerWords = ['الرقم', 'اللقب', 'الاسم', 'الإسم', 'تاريخ', 'ملاحظة', 'المعدل', 'وزارة', 'الجمهورية', 'القسم', 'الفوج'];
            if (headerWords.some(h => val.includes(h))) return false;
            return true;
          });
          if (candidate) importedNames.push(candidate);
        });

        if (importedNames.length === 0) {
          showToast('لم يتم العثور على أسماء صالحة في ملف Excel المرفوع', '⚠️');
          return;
        }

        const stage = getActiveStage();
        const grp = getCurrentStageGroup(stage);
        const hr = getStageHomeroom(stage);
        const defVal = stage === 'primary' ? 7 : 13;

        importedNames.forEach((name, idx) => {
          if (grp) {
            grp.students.push({
              id: 'xl_s_' + Date.now() + '_' + idx,
              name, cont: defVal, devoir: defVal - 1, extra: defVal,
              exam: stage === 'primary' ? 7 : (grp.examScale === 20 ? 12 : 24),
              qualLevel: 'A', customRemark: '', rubric: {}
            });
          }
          if (hr) {
            const grades = {};
            hr.subjects.forEach(s => { grades[s.id] = defVal; });
            hr.students.push({
              id: 'xl_h_' + Date.now() + '_' + idx,
              name, grades, projectScore: 14, readingScore: 14, t2Avg: defVal, t3Avg: defVal
            });
          }
        });

        saveState();
        renderStageWorkspace();
        showToast(`تم استيراد ${importedNames.length} تلميذاً من ملف Excel بنجاح!`);
      } catch (err) {
        showToast('تعذر قراءة ملف Excel المرفوع', '⚠️');
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
      state = getDefaultState();
      saveState();
      const fixedStage = document.body.getAttribute('data-fixed-stage');
      if (fixedStage) renderStageWorkspace();
      else window.navigateAppPage(state.currentPage || 'home');
      showToast('تمت استعادة البيانات النموذجية بنجاح', '🔄');
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
      const defVal = stage === 'primary' ? 7 : 12;
      grp.students.push({
        id: 'st_' + Date.now(),
        name: `تلميذ جديد ${grp.students.length + 1}`,
        cont: defVal, devoir: defVal - 1, extra: defVal,
        exam: stage === 'primary' ? 7 : (grp.examScale === 20 ? 12 : 24),
        qualLevel: 'A', customRemark: '', rubric: {}
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
        const calc = computeStudentSubjectGrade(st, grp);
        let hrStudent = hr.students.find(h => h.name.trim() === st.name.trim());
        if (!hrStudent) {
          hrStudent = {
            id: 'hrs_' + Date.now() + Math.random().toString(36).slice(2, 5),
            name: st.name, grades: {}, projectScore: 14, readingScore: 14,
            t2Avg: Number(calc.avg.toFixed(2)), t3Avg: Number(calc.avg.toFixed(2))
          };
          hr.students.push(hrStudent);
        }
        hrStudent.grades[targetSub.id] = Number(calc.avg.toFixed(2));
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
      const defGrade = stage === 'primary' ? 7 : 12;
      const grades = {};
      hr.subjects.forEach(s => { grades[s.id] = defGrade; });
      hr.students.push({
        id: 'hrs_' + Date.now(),
        name: `تلميذ جديد ${hr.students.length + 1}`,
        grades, projectScore: 14, readingScore: 14, t2Avg: defGrade, t3Avg: defGrade
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
      if (t.classList.contains('hr-grade-input')) {
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
      const names = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      if (names.length === 0) return;
      const target = document.getElementById('importTargetSelect').value;
      const stage = getActiveStage();
      const grp = getCurrentStageGroup(stage);
      const hr = getStageHomeroom(stage);
      const defVal = stage === 'primary' ? 7 : 13;
      if ((target === 'subject' || target === 'both') && grp) {
        names.forEach((n, idx) => {
          grp.students.push({
            id: 'imp_s_' + Date.now() + '_' + idx,
            name: n, cont: defVal, devoir: defVal - 1, extra: defVal, exam: defVal, qualLevel: 'A', customRemark: '', rubric: {}
          });
        });
      }
      if ((target === 'homeroom' || target === 'both') && hr) {
        names.forEach((n, idx) => {
          const grades = {};
          hr.subjects.forEach(s => { grades[s.id] = defVal; });
          hr.students.push({
            id: 'imp_h_' + Date.now() + '_' + idx,
            name: n, grades, projectScore: 14, readingScore: 14, t2Avg: defVal, t3Avg: defVal
          });
        });
      }
      document.getElementById('importNamesTextarea').value = '';
      saveState();
      closeImport();
      renderStageWorkspace();
      showToast(`تم استيراد ${names.length} تلميذاً بنجاح`);
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
          <input type="text" value="${sub.name}" data-cfg-idx="${i}" data-cfg-field="name"
            class="cfg-sub-input flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold" />
          <input type="number" min="1" max="10" value="${sub.coeff}" data-cfg-idx="${i}" data-cfg-field="coeff"
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
