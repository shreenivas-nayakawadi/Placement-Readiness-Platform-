export interface FinalSubmissionLinks {
  lovableProject: string;
  githubRepository: string;
  deployedUrl: string;
}

const STORAGE_KEY = 'prp_final_submission';

const EMPTY_LINKS: FinalSubmissionLinks = {
  lovableProject: '',
  githubRepository: '',
  deployedUrl: '',
};

export function isValidHttpUrl(value: string) {
  if (!value.trim()) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function loadFinalSubmissionLinks(): FinalSubmissionLinks {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...EMPTY_LINKS };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FinalSubmissionLinks>;
    return {
      lovableProject: typeof parsed.lovableProject === 'string' ? parsed.lovableProject : '',
      githubRepository: typeof parsed.githubRepository === 'string' ? parsed.githubRepository : '',
      deployedUrl: typeof parsed.deployedUrl === 'string' ? parsed.deployedUrl : '',
    };
  } catch {
    return { ...EMPTY_LINKS };
  }
}

export function saveFinalSubmissionLinks(links: FinalSubmissionLinks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function areAllProofLinksValid(links: FinalSubmissionLinks) {
  return isValidHttpUrl(links.lovableProject) && isValidHttpUrl(links.githubRepository) && isValidHttpUrl(links.deployedUrl);
}

export function formatFinalSubmissionText(links: FinalSubmissionLinks) {
  return [
    '------------------------------------------',
    'Placement Readiness Platform — Final Submission',
    '',
    `Lovable Project: ${links.lovableProject}`,
    `GitHub Repository: ${links.githubRepository}`,
    `Live Deployment: ${links.deployedUrl}`,
    '',
    'Core Capabilities:',
    '- JD skill extraction (deterministic)',
    '- Round mapping engine',
    '- 7-day prep plan',
    '- Interactive readiness scoring',
    '- History persistence',
    '------------------------------------------',
  ].join('\n');
}
