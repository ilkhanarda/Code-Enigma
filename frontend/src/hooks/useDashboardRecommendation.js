import { useCallback, useEffect, useMemo, useState } from "react";

const FRONTEND_FALLBACK_RECOMMENDATION = {
  message: "Bugün kısa bir tekrar yaparak öğrenme ritmini koruyabilirsin.",
  actionLabel: "Başla",
  targetRoute: "/topics",
  reason: "Frontend fallback: recommendation unavailable.",
};

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeRecommendation(value) {
  const source = value && typeof value === "object" ? value : {};

  return {
    message:
      typeof source.message === "string" && source.message.trim()
        ? source.message.trim()
        : FRONTEND_FALLBACK_RECOMMENDATION.message,
    actionLabel:
      typeof source.actionLabel === "string" && source.actionLabel.trim()
        ? source.actionLabel.trim()
        : FRONTEND_FALLBACK_RECOMMENDATION.actionLabel,
    targetRoute:
      typeof source.targetRoute === "string" && source.targetRoute.trim()
        ? source.targetRoute.trim()
        : FRONTEND_FALLBACK_RECOMMENDATION.targetRoute,
    reason:
      typeof source.reason === "string" && source.reason.trim()
        ? source.reason.trim()
        : FRONTEND_FALLBACK_RECOMMENDATION.reason,
  };
}

function readCachedRecommendation(cacheKey) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = safeJsonParse(raw);
    return parsed ? normalizeRecommendation(parsed) : null;
  } catch {
    return null;
  }
}

function writeCachedRecommendation(cacheKey, recommendation) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(recommendation));
  } catch {
    /* storage blocked */
  }
}

export default function useDashboardRecommendation(studentContext) {
  const [recommendation, setRecommendation] = useState(FRONTEND_FALLBACK_RECOMMENDATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const serializedContext = useMemo(
    () => JSON.stringify(studentContext || {}),
    [studentContext]
  );

  const cacheKey = useMemo(() => {
    const studentName = studentContext?.student?.name || "student";
    return `code-enigma:dashboard-recommendation:${studentName}:${getLocalDateKey()}:${hashString(serializedContext)}`;
  }, [serializedContext, studentContext?.student?.name]);

  const refetch = useCallback(() => {
    setRefreshIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadRecommendation() {
      if (!studentContext) return;

      const cached = refreshIndex === 0 ? readCachedRecommendation(cacheKey) : null;
      if (cached) {
        if (!cancelled) {
          setRecommendation(cached);
          setLoading(false);
          setError(null);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await fetch("/api/ai/dashboard-recommendation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: serializedContext,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Recommendation request failed: ${response.status}`);
        }

        const data = await response.json();
        const nextRecommendation = normalizeRecommendation(data);

        if (cancelled) return;
        setRecommendation(nextRecommendation);
        writeCachedRecommendation(cacheKey, nextRecommendation);
      } catch (requestError) {
        if (requestError?.name === "AbortError") return;
        if (cancelled) return;
        setError(requestError);
        setRecommendation(FRONTEND_FALLBACK_RECOMMENDATION);
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRecommendation();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [cacheKey, refreshIndex, serializedContext, studentContext]);

  return {
    recommendation,
    loading,
    error,
    refetch,
  };
}
