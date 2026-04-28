/* global module */
const GENERAL_FALLBACK = {
  message: 'Bugün kısa bir tekrar yaparak öğrenme ritmini koruyabilirsin.',
  actionLabel: 'Başla',
  targetRoute: '/topics',
  reason: 'Fallback: insufficient data.',
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function firstHighPriorityWeakness(context = {}) {
  return asArray(context.weaknesses)
    .filter((weakness) => weakness && typeof weakness === 'object')
    .sort((a, b) => Number(b.errorRate || 0) - Number(a.errorRate || 0))
    .find((weakness) => weakness.priority === 'high' || Number(weakness.errorRate || 0) >= 60);
}

function firstUnfinishedLesson(context = {}) {
  return asArray(context.progress)
    .filter((lesson) => lesson && typeof lesson === 'object')
    .find((lesson) => Number(lesson.progress || 0) > 0 && Number(lesson.progress || 0) < 100);
}

function firstIncompleteTask(context = {}) {
  return asArray(context.todayTasks)
    .filter((task) => task && typeof task === 'object')
    .find((task) => task.done !== true);
}

function firstReviewTopic(context = {}) {
  return asArray(context.progress)
    .filter((lesson) => lesson && typeof lesson === 'object')
    .find((lesson) => hasText(lesson.course) || hasText(lesson.nextContent));
}

function buildFallbackRecommendation(context = {}) {
  const weakness = firstHighPriorityWeakness(context);
  if (weakness && hasText(weakness.topic)) {
    return {
      message: `${weakness.topic.trim()} konusu biraz dikkat istiyor; bugün kısa bir tekrar yapmak iyi bir başlangıç olur.`,
      actionLabel: 'Tekrar Yap',
      targetRoute: '/gaps',
      reason: 'Fallback: high-priority weakness detected.',
    };
  }

  const unfinishedLesson = firstUnfinishedLesson(context);
  if (unfinishedLesson && hasText(unfinishedLesson.course)) {
    return {
      message: `${unfinishedLesson.course.trim()} dersinde iyi ilerliyorsun; kaldığın yerden devam etmek bugün için en mantıklı adım olur.`,
      actionLabel: 'Devam Et',
      targetRoute: '/topics',
      reason: 'Fallback: unfinished lesson detected.',
    };
  }

  const incompleteTask = firstIncompleteTask(context);
  if (incompleteTask) {
    return {
      message: 'Bugünkü görevlerinden biri seni bekliyor; küçük bir adımla öğrenme ritmini koruyabilirsin.',
      actionLabel: 'Görevi Aç',
      targetRoute: '/dashboard',
      reason: 'Fallback: incomplete task detected.',
    };
  }

  const reviewTopic = firstReviewTopic(context);
  if (reviewTopic) {
    const topic = hasText(reviewTopic.nextContent) ? reviewTopic.nextContent.trim() : reviewTopic.course.trim();
    return {
      message: `${topic} için kısa bir tekrar yaparak bilgini taze tutabilirsin.`,
      actionLabel: 'Tekrar Yap',
      targetRoute: '/topics',
      reason: 'Fallback: review suggestion generated.',
    };
  }

  return GENERAL_FALLBACK;
}

module.exports = {
  GENERAL_FALLBACK,
  buildFallbackRecommendation,
};
