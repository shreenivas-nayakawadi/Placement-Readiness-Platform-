import type {
  AnalysisOutput,
  CompanyIntel,
  CompanySizeCategory,
  ExtractedSkills,
  RoundMappingItem,
  SkillConfidenceMap,
} from '../types/analysis';

interface KeywordRule {
  skill: string;
  patterns: RegExp[];
}

const FALLBACK_OTHER_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];

const CATEGORY_RULES: Record<keyof Omit<ExtractedSkills, 'other'>, KeywordRule[]> = {
  coreCS: [
    { skill: 'DSA', patterns: [/\bdsa\b/i, /data\s*structures?/i, /algorithms?/i] },
    { skill: 'OOP', patterns: [/\boop\b/i, /object[-\s]*oriented/i] },
    { skill: 'DBMS', patterns: [/\bdbms\b/i, /database\s*management/i] },
    { skill: 'OS', patterns: [/\bos\b/i, /operating\s*systems?/i] },
    { skill: 'Networks', patterns: [/computer\s*networks?/i, /networking/i] },
  ],
  languages: [
    { skill: 'Java', patterns: [/\bjava\b/i] },
    { skill: 'Python', patterns: [/\bpython\b/i] },
    { skill: 'JavaScript', patterns: [/\bjavascript\b/i, /\bjs\b/i] },
    { skill: 'TypeScript', patterns: [/\btypescript\b/i, /\bts\b/i] },
    { skill: 'C++', patterns: [/\bc\+\+\b/i] },
    { skill: 'C#', patterns: [/\bc#\b/i, /c\s*sharp/i] },
    { skill: 'Go', patterns: [/\bgo\b/i, /\bgolang\b/i] },
    { skill: 'C', patterns: [/\bc\s+language\b/i, /\bc\s+programming\b/i, /\bprogramming\s+in\s+c\b/i] },
  ],
  web: [
    { skill: 'React', patterns: [/\breact\b/i] },
    { skill: 'Next.js', patterns: [/next\.js/i, /\bnextjs\b/i] },
    { skill: 'Node.js', patterns: [/node\.js/i, /\bnodejs\b/i] },
    { skill: 'Express', patterns: [/\bexpress\b/i, /express\.js/i] },
    { skill: 'REST', patterns: [/\brest\b/i, /restful\s*api/i] },
    { skill: 'GraphQL', patterns: [/graphql/i] },
  ],
  data: [
    { skill: 'SQL', patterns: [/\bsql\b/i] },
    { skill: 'MongoDB', patterns: [/mongodb/i, /mongo\s*db/i] },
    { skill: 'PostgreSQL', patterns: [/postgresql/i, /\bpostgres\b/i] },
    { skill: 'MySQL', patterns: [/mysql/i] },
    { skill: 'Redis', patterns: [/\bredis\b/i] },
  ],
  cloud: [
    { skill: 'AWS', patterns: [/\baws\b/i, /amazon\s*web\s*services/i] },
    { skill: 'Azure', patterns: [/\bazure\b/i] },
    { skill: 'GCP', patterns: [/\bgcp\b/i, /google\s*cloud/i] },
    { skill: 'Docker', patterns: [/\bdocker\b/i] },
    { skill: 'Kubernetes', patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
    { skill: 'CI/CD', patterns: [/ci\s*\/\s*cd/i, /continuous\s*integration/i] },
    { skill: 'Linux', patterns: [/\blinux\b/i] },
  ],
  testing: [
    { skill: 'Selenium', patterns: [/\bselenium\b/i] },
    { skill: 'Cypress', patterns: [/\bcypress\b/i] },
    { skill: 'Playwright', patterns: [/\bplaywright\b/i] },
    { skill: 'JUnit', patterns: [/\bjunit\b/i] },
    { skill: 'PyTest', patterns: [/\bpytest\b/i] },
  ],
};

const enterpriseCompanies = new Set([
  'amazon', 'infosys', 'tcs', 'wipro', 'accenture', 'cognizant', 'microsoft', 'google', 'ibm', 'oracle', 'deloitte', 'capgemini', 'hcl',
]);

const midsizeCompanies = new Set(['zoho', 'freshworks', 'postman', 'razorpay', 'atlassian', 'swiggy', 'zomato']);

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function extractSkills(jdText: string): ExtractedSkills {
  const extracted: ExtractedSkills = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  };

  (Object.keys(CATEGORY_RULES) as (keyof Omit<ExtractedSkills, 'other'>)[]).forEach((category) => {
    CATEGORY_RULES[category].forEach((rule) => {
      if (rule.patterns.some((pattern) => pattern.test(jdText))) {
        extracted[category].push(rule.skill);
      }
    });
    extracted[category] = unique(extracted[category]);
  });

  const technicalCount = extracted.coreCS.length + extracted.languages.length + extracted.web.length + extracted.data.length + extracted.cloud.length + extracted.testing.length;
  if (technicalCount === 0) {
    extracted.other = [...FALLBACK_OTHER_SKILLS];
  }

  return extracted;
}

function inferCompanySizeCategory(company: string): CompanySizeCategory {
  const normalized = company.trim().toLowerCase();
  if (!normalized) return 'Startup';
  if (enterpriseCompanies.has(normalized)) return 'Enterprise';
  if (midsizeCompanies.has(normalized)) return 'Mid-size';
  return 'Startup';
}

function inferIndustry(company: string, role: string, jdText: string) {
  const text = `${company} ${role} ${jdText}`.toLowerCase();
  if (text.includes('bank') || text.includes('fintech') || text.includes('payments')) return 'Financial Technology';
  if (text.includes('health') || text.includes('medical') || text.includes('pharma')) return 'Healthcare Technology';
  if (text.includes('ecommerce') || text.includes('marketplace') || text.includes('retail')) return 'E-commerce Technology';
  if (text.includes('saas') || text.includes('cloud') || text.includes('software')) return 'Software Product';
  return 'Technology Services';
}

function buildCompanyIntel(company: string, role: string, jdText: string): CompanyIntel | null {
  const companyName = company.trim();
  if (!companyName) return null;

  const sizeCategory = inferCompanySizeCategory(companyName);
  const typicalHiringFocus = sizeCategory === 'Enterprise'
    ? 'Structured DSA + core fundamentals with standardized interview stages.'
    : 'Practical problem solving + stack depth with real execution scenarios.';

  return {
    companyName,
    industry: inferIndustry(companyName, role, jdText),
    sizeCategory,
    typicalHiringFocus,
    note: 'Demo Mode: Company intel generated heuristically.',
  };
}

function buildRoundMapping(skills: ExtractedSkills, companyIntel: CompanyIntel | null): RoundMappingItem[] {
  const isEnterprise = companyIntel?.sizeCategory === 'Enterprise';
  const hasDSA = skills.coreCS.includes('DSA');
  const hasStartupStack = skills.web.includes('React') || skills.web.includes('Node.js');

  if (isEnterprise && hasDSA) {
    return [
      {
        roundTitle: 'Round 1: Online Test',
        focusAreas: ['DSA', 'Aptitude'],
        whyItMatters: 'Large companies use this to filter for speed and fundamentals at scale.',
      },
      {
        roundTitle: 'Round 2: Technical',
        focusAreas: ['DSA', 'Core CS'],
        whyItMatters: 'Checks depth in algorithms and core CS concepts required for execution quality.',
      },
      {
        roundTitle: 'Round 3: Tech + Projects',
        focusAreas: ['Project Architecture', 'Implementation Tradeoffs'],
        whyItMatters: 'Validates practical ownership of systems, not just theoretical recall.',
      },
      {
        roundTitle: 'Round 4: HR',
        focusAreas: ['Communication', 'Role Fit'],
        whyItMatters: 'Final alignment on motivation, expectations, and team fit.',
      },
    ];
  }

  if (!isEnterprise && hasStartupStack) {
    return [
      {
        roundTitle: 'Round 1: Practical Coding',
        focusAreas: ['Feature Building', 'Debugging'],
        whyItMatters: 'Startups prioritize immediate hands-on execution in the target stack.',
      },
      {
        roundTitle: 'Round 2: System Discussion',
        focusAreas: ['Architecture', 'Scalability'],
        whyItMatters: 'Demonstrates ability to make practical tradeoffs under resource constraints.',
      },
      {
        roundTitle: 'Round 3: Culture Fit',
        focusAreas: ['Ownership', 'Collaboration'],
        whyItMatters: 'Small teams need proactive communication and accountability.',
      },
    ];
  }

  return [
    {
      roundTitle: 'Round 1: Screening',
      focusAreas: ['Aptitude', 'Basics'],
      whyItMatters: 'Builds confidence that your core fundamentals are interview-ready.',
    },
    {
      roundTitle: 'Round 2: Technical Interview',
      focusAreas: ['Core CS', 'Role Skills'],
      whyItMatters: 'Connects your preparation directly with role expectations.',
    },
    {
      roundTitle: 'Round 3: Project Discussion',
      focusAreas: ['Project Depth', 'Problem Solving'],
      whyItMatters: 'Shows how you apply concepts to real-world engineering decisions.',
    },
    {
      roundTitle: 'Round 4: HR / Managerial',
      focusAreas: ['Communication', 'Career Clarity'],
      whyItMatters: 'Ensures role fit and long-term growth alignment.',
    },
  ];
}

function buildChecklist(skills: ExtractedSkills): AnalysisOutput['checklist'] {
  const genericMode = skills.other.length > 0;

  if (genericMode) {
    return [
      { roundTitle: 'Round 1: Aptitude / Basics', items: ['Practice percentages and ratios', 'Revise communication basics', 'Prepare self-introduction', 'Review basic coding syntax', 'Solve simple aptitude set'] },
      { roundTitle: 'Round 2: DSA + Core CS', items: ['Practice arrays and strings', 'Revise OOP fundamentals', 'Review DBMS basics', 'Understand time complexity basics', 'Solve beginner coding questions'] },
      { roundTitle: 'Round 3: Tech interview (projects + stack)', items: ['Prepare one project walkthrough', 'Explain challenges and outcomes', 'Review Git and collaboration flow', 'Connect project to JD requirements', 'Practice concise technical explanations'] },
      { roundTitle: 'Round 4: Managerial / HR', items: ['Prepare STAR stories', 'Practice strengths/weakness answers', 'Handle conflict scenario response', 'Discuss growth goals clearly', 'Prepare interviewer questions'] },
    ];
  }

  const hasWeb = skills.web.length > 0;
  const hasData = skills.data.length > 0;

  return [
    { roundTitle: 'Round 1: Aptitude / Basics', items: ['Revise arithmetic and logical reasoning', 'Solve timed aptitude questions', 'Refresh core CS flashcards', 'Practice concise self-introduction', hasData ? 'Revise SQL basics for quick MCQs' : 'Review problem decomposition basics'] },
    { roundTitle: 'Round 2: DSA + Core CS', items: ['Solve medium DSA problems', 'Practice recursion and binary search', 'Revise OOP + DBMS concepts', 'Review OS and networking basics', 'Write clean code with edge-case handling'] },
    { roundTitle: 'Round 3: Tech interview (projects + stack)', items: ['Prepare project architecture explanation', hasWeb ? 'Revise API integration and frontend flow' : 'Map stack requirements to your project', hasData ? 'Explain schema and query choices' : 'Show technical tradeoff examples', 'Practice debugging narratives', 'Align project outcomes with JD'] },
    { roundTitle: 'Round 4: Managerial / HR', items: ['Prepare behavioral examples', 'Practice communication clarity', 'Align role expectations', 'Discuss teamwork scenarios', 'Prepare thoughtful interviewer questions'] },
  ];
}

function buildPlan7Days(skills: ExtractedSkills): AnalysisOutput['plan7Days'] {
  const genericMode = skills.other.length > 0;
  const hasReact = skills.web.includes('React');
  const hasNode = skills.web.includes('Node.js');
  const hasSql = skills.data.includes('SQL');

  if (genericMode) {
    return [
      { day: 'Day 1-2', focus: 'Basics + core CS', tasks: ['Revise communication and problem-solving basics', 'Review coding syntax and fundamentals'] },
      { day: 'Day 3-4', focus: 'DSA + coding practice', tasks: ['Solve beginner-level coding questions', 'Practice dry runs and complexity basics'] },
      { day: 'Day 5', focus: 'Project + resume alignment', tasks: ['Prepare one project explanation', 'Improve resume bullets with outcomes'] },
      { day: 'Day 6', focus: 'Mock interview questions', tasks: ['Practice common technical + HR questions', 'Record and improve answer clarity'] },
      { day: 'Day 7', focus: 'Revision + weak areas', tasks: ['Revise mistakes and weak concepts', 'Prepare rapid revision notes'] },
    ];
  }

  return [
    { day: 'Day 1-2', focus: 'Basics + core CS', tasks: ['Revise OOP, OS, DBMS and networking summaries', 'Solve aptitude sets under time constraints'] },
    { day: 'Day 3-4', focus: 'DSA + coding practice', tasks: ['Solve 6-8 coding questions by pattern', 'Practice optimization and edge-case handling'] },
    { day: 'Day 5', focus: 'Project + resume alignment', tasks: unique([
      'Align project points with JD skills',
      hasReact ? 'Revise React architecture and state decisions' : '',
      hasNode ? 'Review backend API and async error handling' : '',
      hasSql ? 'Prepare indexing and query optimization examples' : '',
    ].filter(Boolean)) },
    { day: 'Day 6', focus: 'Mock interview questions', tasks: ['Attempt one technical mock interview', 'Practice behavioral responses with STAR structure'] },
    { day: 'Day 7', focus: 'Revision + weak areas', tasks: ['Revise weak topics from mock feedback', 'Create final rapid-revision sheet'] },
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
};

function buildQuestions(skills: ExtractedSkills): string[] {
  const detected = unique([
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
  ]);

  const specific = detected.map((skill) => skillQuestionMap[skill]).filter(Boolean);
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

  const genericFallback = [
    'How do you break down an unfamiliar technical problem?',
    'How do you explain your project impact in simple terms?',
    'How do you prioritize tasks when everything feels urgent?',
    'How do you debug issues when requirements are unclear?',
  ];

  const pool = skills.other.length > 0 ? [...genericFallback, ...fallback] : fallback;
  return unique([...specific, ...pool]).slice(0, 10);
}

function calculateBaseScore(jdText: string, company: string, role: string, skills: ExtractedSkills): number {
  let score = 35;
  const categoriesPresent = [skills.coreCS, skills.languages, skills.web, skills.data, skills.cloud, skills.testing].filter((list) => list.length > 0).length;
  score += Math.min(30, categoriesPresent * 5);
  if (company.trim()) score += 10;
  if (role.trim()) score += 10;
  if (jdText.trim().length > 800) score += 10;
  return Math.max(0, Math.min(100, score));
}

function buildSkillConfidenceMap(skills: ExtractedSkills): SkillConfidenceMap {
  const allSkills = unique([
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
    ...skills.other,
  ]);

  const map: SkillConfidenceMap = {};
  allSkills.forEach((skill) => {
    map[skill] = 'practice';
  });
  return map;
}

export function calculateFinalScore(baseScore: number, skillConfidenceMap: SkillConfidenceMap): number {
  const adjustment = Object.values(skillConfidenceMap).reduce((sum, status) => sum + (status === 'know' ? 2 : -2), 0);
  return Math.max(0, Math.min(100, baseScore + adjustment));
}

export function analyzeJobDescription(jdText: string, company: string, role: string): AnalysisOutput {
  const extractedSkills = extractSkills(jdText);
  const baseScore = calculateBaseScore(jdText, company, role, extractedSkills);
  const skillConfidenceMap = buildSkillConfidenceMap(extractedSkills);
  const finalScore = calculateFinalScore(baseScore, skillConfidenceMap);
  const companyIntel = buildCompanyIntel(company, role, jdText);

  return {
    extractedSkills,
    roundMapping: buildRoundMapping(extractedSkills, companyIntel),
    checklist: buildChecklist(extractedSkills),
    plan7Days: buildPlan7Days(extractedSkills),
    questions: buildQuestions(extractedSkills),
    baseScore,
    skillConfidenceMap,
    finalScore,
    companyIntel,
  };
}

export function deriveCompanyIntel(company: string, role: string, jdText: string) {
  return buildCompanyIntel(company, role, jdText);
}

export function deriveRoundMapping(skills: ExtractedSkills, companyIntel: CompanyIntel | null) {
  return buildRoundMapping(skills, companyIntel);
}

export function getFallbackOtherSkills() {
  return [...FALLBACK_OTHER_SKILLS];
}
