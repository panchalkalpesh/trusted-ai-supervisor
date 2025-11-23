import { request } from 'undici';

// Rule definitions
const RULES = [
  { id: 'instr_howto', re: /(how to|step by step|instructions?|guide|procedures?)/i, severity: 0.7 },
  { id: 'code_block', re: /```[\s\S]*?```|<code>[\s\S]*?<\/code>|\bscanf\(|\bmemcpy\(/i, severity: 0.6 },
  { id: 'jailbreak', re: /(jailbreak|bypass|ignore previous)/i, severity: 0.9 }
];

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

export interface FilterResponse {
  severity: number;
  reason: string;
  rulesMatched: string[];
  classifierScore: number;
};


export async function runFilter(prompt: string, result: any): Promise<FilterResponse> {
  const rulesMatched: string[] = [];
  let maxRuleSeverity = 0;

  for (const r of RULES) {
    if (r.re.test(prompt) || r.re.test(result)) {
      rulesMatched.push(r.id);
      if (r.severity > maxRuleSeverity) maxRuleSeverity = r.severity;
    }
  }

  let classifierScore = 0;
  let classifierLabel = 'none';

  if (OPENAI_KEY) {
    try {
      const res = await request('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({ input: result })
      });
      const body = await res.body.json();
      const flagged = body?.results?.[0]?.flagged || false;
      classifierScore = flagged ? 0.9 : 0.05;
      classifierLabel = flagged ? 'flagged' : 'clean';
    } catch (err) {
      console.error('moderation call failed', err);
      classifierScore = 0.0;
      classifierLabel = 'error';
    }
  } else {
    const banned = /(kill|weapon|attack|poison|synthesize|virus|explosive)/i;
    classifierScore = banned.test(result) ? 0.95 : 0.02;
    classifierLabel = banned.test(result) ? 'flagged' : 'clean';
  }

  const finalSeverity = Math.min(1, Math.max(maxRuleSeverity, classifierScore));
  const reasonParts = [];
  if (rulesMatched.length) reasonParts.push(`rules:${rulesMatched.join(',')}`);
  reasonParts.push(`classifier:${classifierLabel}`);

  return {
    severity: finalSeverity,
    reason: reasonParts.join(';'),
    rulesMatched,
    classifierScore
  };
}
