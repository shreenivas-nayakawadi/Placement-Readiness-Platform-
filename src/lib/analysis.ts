import type {
  AnalysisOutput,
  CompanyIntel,
  CompanySizeCategory,
  DayPlan,
  ExtractedSkills,
  RoundChecklist,
  RoundMappingItem,
  SkillCategory,
} from '../types/analysis';

interface KeywordRule {
  skill: string;
  patterns: RegExp[];
}

const CATEGORY_RULES: Record<Exclude<SkillCategory, 'General'>, KeywordRule[]> = {
  'Core CS': [
    { skill: 'DSA', patterns: [/\bdsa\b/i, /data\s*structures?/i, /algorithms?/i] },
    { skill: 'OOP', patterns: [/\boop\b/i, /object[-\s]*oriented/i] },
    { skill: 'DBMS', patterns: [/\bdbms\b/i, /database\s*management/i] },
    { skill: 'OS', patterns: [/\bos\b/i, /operating\s*systems?/i] },
    { skill: 'Networks', patterns: [/computer\s*networks?/i, /networking/i] },
  ],
  Languages: [
    { skill: 'Java', patterns: [/\bjava\b/i] },
    { skill: 'Python', patterns: [/\bpython\b/i] },
    { skill: 'JavaScript', patterns: [/\bjavascript\b/i, /\bjs\b/i] },
    { skill: 'TypeScript', patterns: [/\btypescript\b/i, /\bts\b/i] },
    { skill: 'C++', patterns: [/\bc\+\+\b/i] },
    { skill: 'C#', patterns: [/\bc#\b/i, /c\s*sharp/i] },
    { skill: 'Go', patterns: [/\bgo\b/i, /\bgolang\b/i] },
    { skill: 'C', patterns: [/\bc\s+language\b/i, /\bc\s+programming\b/i, /\bprogramming\s+in\s+c\b/i] },
  ],
  Web: [
    { skill: 'React', patterns: [/\breact\b/i] },
    { skill: 'Next.js', patterns: [/next\.js/i, /\bnextjs\b/i] },
    { skill: 'Node.js', patterns: [/node\.js/i, /\bnodejs\b/i] },
    { skill: 'Express', patterns: [/\bexpress\b/i, /express\.js/i] },
    { skill: 'REST', patterns: [/\brest\b/i, /restful\s*api/i] },
    { skill: 'GraphQL', patterns: [/graphql/i] },
  ],
  Data: [
    { skill: 'SQL', patterns: [/\bsql\b/i] },
    { skill: 'MongoDB', patterns: [/mongodb/i, /mongo\s*db/i] },
    { skill: 'PostgreSQL', patterns: [/postgresql/i, /\bpostgres\b/i] },
    { skill: 'MySQL', patterns: [/mysql/i] },
    { skill: 'Redis', patterns: [/\bredis\b/i] },
  ],
  'Cloud/DevOps': [
    { skill: 'AWS', patterns: [/\baws\b/i, /amazon\s*web\s*services/i] },
    { skill: 'Azure', patterns: [/\bazure\b/i] },
    { skill: 'GCP', patterns: [/\bgcp\b/i, /google\s*cloud/i] },
    { skill: 'Docker', patterns: [/\bdocker\b/i] },
    { skill: 'Kubernetes', patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
    { skill: 'CI/CD', patterns: [/ci\s*\/\s*cd/i, /continuous\s*integration/i] },
    { skill: 'Linux', patterns: [/\blinux\b/i] },
  ],
  Testing: [
    { skill: 'Selenium', patterns: [/\bselenium\b/i] },
    { skill: 'Cypress', patterns: [/\bcypress\b/i] },
    { skill: 'Playwright', patterns: [/\bplaywright\b/i] },
    { skill: 'JUnit', patterns: [/\bjunit\b/i] },
    { skill: 'PyTest', patterns: [/\bpytest\b/i] },
  ],
};

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function ensureRoundItems(items: string[], fallback: string[]) {
  const merged = unique([...items, ...fallback]);
  return merged.slice(0, 8);
}

function extractSkills(jdText: string): ExtractedSkills {
  const extracted: ExtractedSkills = {
    'Core CS': [],
    Languages: [],
    Web: [],
    Data: [],
    'Cloud/DevOps': [],
    Testing: [],
    General: [],
  };

  for (const [category, rules] of Object.entries(CATEGORY_RULES) as [Exclude<SkillCategory, 'General'>, KeywordRule[]][]) {
    for (const rule of rules) {
      if (rule.patterns.some((pattern) => pattern.test(jdText))) {
        extracted[category].push(rule.skill);
      }
    }
    extracted[category] = unique(extracted[category]);
  }

  const detectedCount = Object.entries(extracted)
    .filter(([category]) => category !== 'General')
    .reduce((sum, [, list]) => sum + list.length, 0);

  if (detectedCount === 0) {
    extracted.General = ['General fresher stack'];
  }

  return extracted;
}

function buildRoundChecklist(extractedSkills: ExtractedSkills): RoundChecklist[] {
  const hasWeb = extractedSkills.Web.length > 0;
  const hasData = extractedSkills.Data.length > 0;
  const hasCloud = extractedSkills['Cloud/DevOps'].length > 0;
  const hasTesting = extractedSkills.Testing.length > 0;

  const round1 = ensureRoundItems(unique([
    'Revise percentages, ratios, and probability basics',
    'Solve 20 aptitude questions under timed conditions',
    'Practice CS fundamentals flashcards for quick recall',
    'Review complexity notation and common patterns',
    'Prepare a concise self-introduction tailored to the role',
    hasWeb ? 'Review web request/response lifecycle basics' : '',
    hasData ? 'Refresh SQL syntax essentials for short questions' : '',
  ].filter(Boolean)), [
    'Revise common interview puzzle patterns',
    'Practice quick mental math for aptitude speed',
  ]);

  const round2 = ensureRoundItems(unique([
    'Practice arrays, strings, and hash map coding problems',
    'Solve two medium DSA problems with full dry run',
    'Revise OOP pillars with practical examples',
    'Review DBMS normalization and indexing concepts',
    'Revise OS process/thread and scheduling basics',
    'Revise networking layers, HTTP, and TCP vs UDP',
    extractedSkills['Core CS'].includes('DSA') ? 'Practice binary search and two-pointer optimizations' : '',
  ].filter(Boolean)), [
    'Practice recursion and dynamic programming fundamentals',
    'Review time-space tradeoffs for common patterns',
  ]);

  const round3 = ensureRoundItems(unique([
    'Prepare project deep-dive with architecture decisions',
    'Map JD skills to your project talking points',
    hasWeb ? 'Revise component design and API integration strategy' : '',
    hasData ? 'Explain schema design and query optimization choices' : '',
    hasCloud ? 'Explain deployment pipeline and environment strategy' : '',
    hasTesting ? 'Prepare test strategy for critical user flows' : '',
    'Practice trade-off based technical discussion',
  ].filter(Boolean)), [
    'Prepare one end-to-end system explanation from requirement to deployment',
    'Rehearse how your stack choices impacted project outcomes',
    'List scalability bottlenecks and mitigation options',
  ]);

  const round4 = ensureRoundItems(unique([
    'Prepare STAR format stories for challenge scenarios',
    'Draft answers for strengths, weaknesses, and conflict handling',
    'Align salary/location expectations with role level',
    'Prepare questions to ask interviewer about team and roadmap',
    'Practice concise explanation of career goals',
  ]), [
    'Rehearse introduction and closing statements',
    'Prepare examples of collaboration and ownership',
  ]);

  return [
    { round: 'Round 1: Aptitude / Basics', items: round1 },
    { round: 'Round 2: DSA + Core CS', items: round2 },
    { round: 'Round 3: Tech interview (projects + stack)', items: round3 },
    { round: 'Round 4: Managerial / HR', items: round4 },
  ];
}

function build7DayPlan(extractedSkills: ExtractedSkills): DayPlan[] {
  const hasReact = extractedSkills.Web.includes('React');
  const hasNode = extractedSkills.Web.includes('Node.js');
  const hasSql = extractedSkills.Data.includes('SQL');

  return [
    {
      day: 'Day 1-2',
      focus: 'Basics + core CS',
      items: [
        'Revise OOP, OS, DBMS, and networking summaries',
        'Solve quick aptitude sets for speed and accuracy',
      ],
    },
    {
      day: 'Day 3-4',
      focus: 'DSA + coding practice',
      items: [
        'Solve 6-8 coding problems with pattern grouping',
        'Practice writing clean code with edge-case handling',
      ],
    },
    {
      day: 'Day 5',
      focus: 'Project + resume alignment',
      items: unique([
        'Update resume bullets with measurable impact',
        hasReact ? 'Revise frontend architecture and state handling decisions' : '',
        hasNode ? 'Review backend API structure and error handling decisions' : '',
        hasSql ? 'Prepare examples of indexing and query tuning in projects' : '',
      ].filter(Boolean)),
    },
    {
      day: 'Day 6',
      focus: 'Mock interview questions',
      items: [
        'Attempt one full technical mock interview',
        'Practice HR and behavioral responses with concise structure',
      ],
    },
    {
      day: 'Day 7',
      focus: 'Revision + weak areas',
      items: [
        'Revise mistakes from mock and coding sessions',
        'Create final rapid-revision sheet for interview day',
      ],
    },
  ];
}

const skillQuestionMap: Record<string, string> = {
  SQL: 'Explain indexing and when it helps.',
  React: 'Explain state management options and when to use each.',
  DSA: 'How would you optimize search in sorted data?',
  'Node.js': 'How do you handle async errors and retries in Node.js APIs?',
  REST: 'How do you design versioned REST APIs for backward compatibility?',
  GraphQL: 'When would you choose GraphQL over REST?',
  Docker: 'How would you optimize a Docker image for production?',
  Kubernetes: 'How do you debug a failing pod in Kubernetes?',
  AWS: 'How would you design a scalable backend on AWS?',
  OOP: 'How do inheritance and composition differ in real project design?',
  DBMS: 'What is normalization and when do you denormalize?',
  OS: 'How do processes and threads differ in scheduling and memory use?',
  Networks: 'Explain the difference between TCP and UDP with real use cases.',
  Java: 'How does JVM memory management affect application performance?',
  Python: 'What are common Python performance bottlenecks in backend code?',
  JavaScript: 'Explain event loop behavior with microtasks and macrotasks.',
  TypeScript: 'How do union and generic types improve maintainability?',
  Linux: 'Which Linux commands do you use most while debugging services?',
  Selenium: 'How do you reduce flaky tests in Selenium suites?',
  Cypress: 'When is Cypress preferable to Selenium?',
  Playwright: 'How would you structure Playwright tests for cross-browser runs?',
  JUnit: 'How do you write isolated JUnit tests for service layers?',
  PyTest: 'What fixtures strategy do you use for maintainable PyTest suites?',
};

function buildQuestions(extractedSkills: ExtractedSkills): string[] {
  const detectedSkills = Object.entries(extractedSkills)
    .filter(([category]) => category !== 'General')
    .flatMap(([, skills]) => skills);

  const mapped = detectedSkills
    .map((skill) => skillQuestionMap[skill])
    .filter(Boolean);

  const fallback = [
    'Walk through one project where you solved a production issue end-to-end.',
    'How do you prioritize features under tight deadlines?',
    'How do you validate that your solution scales for peak traffic?',
    'Describe a time you improved code quality in an existing codebase.',
    'How would you approach learning a missing skill in two weeks?',
    'How do you choose between readability and performance in critical paths?',
    'What metrics would you track after releasing a new feature?',
    'How do you communicate technical trade-offs to non-technical stakeholders?',
    'How do you handle disagreement during code reviews?',
    'What is your approach to testing before deployment?',
  ];

  return unique([...mapped, ...fallback]).slice(0, 10);
}

function calculateReadinessScore(jdText: string, company: string, role: string, extractedSkills: ExtractedSkills): number {
  let score = 35;

  const categoriesPresent = Object.entries(extractedSkills)
    .filter(([category, skills]) => category !== 'General' && skills.length > 0).length;

  score += Math.min(30, categoriesPresent * 5);

  if (company.trim()) {
    score += 10;
  }

  if (role.trim()) {
    score += 10;
  }

  if (jdText.trim().length > 800) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

const enterpriseCompanies = new Set([
  'amazon',
  'infosys',
  'tcs',
  'wipro',
  'accenture',
  'cognizant',
  'microsoft',
  'google',
  'ibm',
  'oracle',
  'deloitte',
  'capgemini',
  'hcl',
]);

const midsizeCompanies = new Set([
  'zoho',
  'freshworks',
  'postman',
  'razorpay',
  'atlassian',
  'swiggy',
  'zomato',
]);

function inferIndustry(company: string, jdText: string, role: string) {
  const text = `${company} ${role} ${jdText}`.toLowerCase();

  if (text.includes('bank') || text.includes('fintech') || text.includes('payments')) {
    return 'Financial Technology';
  }

  if (text.includes('health') || text.includes('pharma') || text.includes('medical')) {
    return 'Healthcare Technology';
  }

  if (text.includes('ecommerce') || text.includes('retail') || text.includes('marketplace')) {
    return 'E-commerce Technology';
  }

  if (text.includes('saas') || text.includes('cloud') || text.includes('software')) {
    return 'Software Product';
  }

  return 'Technology Services';
}

function inferCompanySizeCategory(company: string): CompanySizeCategory {
  const normalized = company.trim().toLowerCase();

  if (!normalized) {
    return 'Startup';
  }

  if (enterpriseCompanies.has(normalized)) {
    return 'Enterprise';
  }

  if (midsizeCompanies.has(normalized)) {
    return 'Mid-size';
  }

  return 'Startup';
}

function buildCompanyIntel(company: string, role: string, jdText: string): CompanyIntel | null {
  const cleaned = company.trim();
  if (!cleaned) {
    return null;
  }

  const sizeCategory = inferCompanySizeCategory(cleaned);
  const typicalHiringFocus =
    sizeCategory === 'Enterprise'
      ? 'Structured DSA rounds, core CS fundamentals, and consistent evaluation rubrics.'
      : 'Practical problem solving, project execution depth, and role-specific stack fluency.';

  return {
    companyName: cleaned,
    industry: inferIndustry(cleaned, jdText, role),
    sizeCategory,
    typicalHiringFocus,
    note: 'Demo Mode: Company intel generated heuristically.',
  };
}

function hasStackSkills(extractedSkills: ExtractedSkills) {
  return extractedSkills.Web.includes('React') || extractedSkills.Web.includes('Node.js');
}

function hasDSA(extractedSkills: ExtractedSkills) {
  return extractedSkills['Core CS'].includes('DSA');
}

function buildRoundMapping(extractedSkills: ExtractedSkills, intel: CompanyIntel | null): RoundMappingItem[] {
  const isEnterprise = intel?.sizeCategory === 'Enterprise';
  const isStartup = !intel || intel.sizeCategory === 'Startup';

  if (isEnterprise && hasDSA(extractedSkills)) {
    return [
      {
        round: 'Round 1: Online Test',
        focus: 'DSA + Aptitude',
        whyThisRoundMatters: 'This round filters for speed, accuracy, and coding fundamentals at scale.',
      },
      {
        round: 'Round 2: Technical',
        focus: 'DSA + Core CS',
        whyThisRoundMatters: 'Interviewers validate depth in algorithms and core computer science concepts.',
      },
      {
        round: 'Round 3: Tech + Projects',
        focus: 'Project architecture and implementation decisions',
        whyThisRoundMatters: 'This round checks how you apply fundamentals to real engineering work.',
      },
      {
        round: 'Round 4: HR',
        focus: 'Role fit and communication',
        whyThisRoundMatters: 'Final alignment on team fit, motivation, and long-term consistency.',
      },
    ];
  }

  if (isStartup && hasStackSkills(extractedSkills)) {
    return [
      {
        round: 'Round 1: Practical Coding',
        focus: 'Build/debug feature-level tasks using target stack',
        whyThisRoundMatters: 'Startups prioritize immediate execution and shipping capability.',
      },
      {
        round: 'Round 2: System Discussion',
        focus: 'Architecture trade-offs and scalability',
        whyThisRoundMatters: 'You are evaluated on owning end-to-end decisions under constraints.',
      },
      {
        round: 'Round 3: Culture Fit',
        focus: 'Ownership mindset and collaboration',
        whyThisRoundMatters: 'Small teams require strong autonomy, clarity, and accountability.',
      },
    ];
  }

  return [
    {
      round: 'Round 1: Screening',
      focus: 'Aptitude + basics',
      whyThisRoundMatters: 'Helps shortlist candidates with reliable fundamentals.',
    },
    {
      round: 'Round 2: Technical Interview',
      focus: 'Core CS + JD skills',
      whyThisRoundMatters: 'Maps your preparedness directly to role requirements.',
    },
    {
      round: 'Round 3: Project Discussion',
      focus: 'Project depth + problem solving approach',
      whyThisRoundMatters: 'Demonstrates practical ownership beyond theoretical knowledge.',
    },
    {
      round: 'Round 4: HR / Managerial',
      focus: 'Communication + alignment',
      whyThisRoundMatters: 'Ensures team fit and role expectations are clear on both sides.',
    },
  ];
}

export function analyzeJobDescription(jdText: string, company: string, role: string): AnalysisOutput {
  const extractedSkills = extractSkills(jdText);
  const companyIntel = buildCompanyIntel(company, role, jdText);
  const roundMapping = buildRoundMapping(extractedSkills, companyIntel);

  return {
    extractedSkills,
    checklist: buildRoundChecklist(extractedSkills),
    plan: build7DayPlan(extractedSkills),
    questions: buildQuestions(extractedSkills),
    readinessScore: calculateReadinessScore(jdText, company, role, extractedSkills),
    companyIntel,
    roundMapping,
  };
}

export function deriveCompanyIntel(company: string, role: string, jdText: string) {
  return buildCompanyIntel(company, role, jdText);
}

export function deriveRoundMapping(extractedSkills: ExtractedSkills, companyIntel: CompanyIntel | null) {
  return buildRoundMapping(extractedSkills, companyIntel);
}
