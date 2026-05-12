/**
 * 题目加载与查询引擎
 */
import { QUESTION_TYPE } from '../constants.js';

let questionsCache = null;

/**
 * 加载题目JSON（从 data/questions.json）
 * @returns {Promise<Object>} 包含 list, map, meta, stats 的对象
 */
async function loadQuestions() {
  if (questionsCache) return questionsCache;

  const res = await fetch('data/questions.json');
  if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`);
  const data = await res.json();

  // 构建 id → question 索引，O(1) 查询
  const questionMap = new Map();
  data.questions.forEach(q => questionMap.set(q.id, q));

  questionsCache = {
    list: data.questions,
    map: questionMap,
    meta: data.metadata || {},
    stats: data.statistics || {}
  };

  return questionsCache;
}

/**
 * 根据 ID 获取单道题目
 */
function getQuestionById(id) {
  if (!questionsCache) return null;
  return questionsCache.map.get(id) || null;
}

/**
 * 根据类型获取题目
 */
function getQuestionsByType(type) {
  if (!questionsCache) return [];
  return questionsCache.list.filter(q => q.type === type);
}

/**
 * 根据分类获取题目
 */
function getQuestionsByCategory(category) {
  if (!questionsCache) return [];
  return questionsCache.list.filter(q => q.category === category);
}

/**
 * Fisher-Yates 随机打乱
 */
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 随机获取 N 道题
 */
function getRandomQuestions(type, count) {
  const candidates = getQuestionsByType(type);
  return shuffleArray(candidates).slice(0, Math.min(count, candidates.length));
}

/**
 * 获取题库统计信息
 */
function getStats() {
  if (!questionsCache) return null;
  return questionsCache.stats;
}

export {
  loadQuestions,
  getQuestionById,
  getQuestionsByType,
  getQuestionsByCategory,
  shuffleArray,
  getRandomQuestions,
  getStats
};
