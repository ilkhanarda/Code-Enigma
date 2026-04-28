/* global require, module */
const { buildFallbackRecommendation } = require('./recommendationFallback');

const ALLOWED_ROUTES = new Set([
  '/dashboard',
  '/topics',
  '/gaps',
  '/test',
  '/topic',
  '/video',
  '',
]);

const SYSTEM_PROMPT = `You are an AI learning mentor inside a Turkish LMS dashboard.
Your job is to analyze the provided student learning context and produce the single most useful next-step recommendation.
Prioritize high-priority weaknesses first, then unfinished or recently accessed lessons, then incomplete daily tasks, then review suggestions, then a general motivation fallback.
Respond only with valid JSON using this schema: { "message": string, "actionLabel": string, "targetRoute": string, "reason": string }.
The message must be in Turkish, friendly, concise, and action-oriented.
The recommendation message must be maximum 2 short sentences.
Be encouraging but not childish.
Avoid exaggerated praise.
Suggest one clear next action.
Use only the provided data.
If data is missing, use a safe general fallback.
Do not invent progress, scores, lesson names, or weaknesses.
Prefer concrete actions like "devam et", "5 soruluk tekrar çöz", "kısa tekrar yap", "eksik kazanım testini aç".
Do not mention that you are an AI model.
Do not use Markdown.
Use targetRoute only from these routes when a route is useful: /dashboard, /topics, /gaps, /test, /topic, /video.`;

function buildUserPrompt(studentContext) {
  return `Analyze this student context and generate the most useful dashboard recommendation:\n${JSON.stringify(studentContext || {}, null, 2)}`;
}

function stripMarkdownFence(value) {
  return String(value || '')
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

function extractJsonObject(value) {
  const text = stripMarkdownFence(value);
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;

    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function trimString(value, fallback, maxLength = 260) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : fallback;
}

function normalizeRoute(route, fallbackRoute) {
  const candidate = typeof route === 'string' ? route.trim() : '';
  if (ALLOWED_ROUTES.has(candidate)) return candidate;
  return fallbackRoute;
}

function validateRecommendation(candidate, fallback) {
  const source = candidate && typeof candidate === 'object' ? candidate : {};

  const normalized = {
    message: trimString(source.message, fallback.message),
    actionLabel: trimString(source.actionLabel, fallback.actionLabel, 40),
    targetRoute: normalizeRoute(source.targetRoute, fallback.targetRoute),
    reason: trimString(source.reason, fallback.reason, 180),
  };

  return normalized;
}

async function generateDashboardRecommendation(studentContext, { ollama, modelName } = {}) {
  const fallback = buildFallbackRecommendation(studentContext);

  if (!ollama || !modelName) {
    return fallback;
  }

  try {
    const response = await ollama.chat({
      model: modelName,
      stream: false,
      format: 'json',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: buildUserPrompt(studentContext),
        },
      ],
      options: {
        temperature: 0.15,
      },
    });

    const content = response?.message?.content;
    const parsed = extractJsonObject(content);
    return validateRecommendation(parsed, fallback);
  } catch (error) {
    console.error('[AI Recommendation] Fallback used:', error?.message || error);
    return fallback;
  }
}

module.exports = {
  SYSTEM_PROMPT,
  buildUserPrompt,
  extractJsonObject,
  validateRecommendation,
  generateDashboardRecommendation,
};
