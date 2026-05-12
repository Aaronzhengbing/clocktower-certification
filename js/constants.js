/**
 * 应用常量定义
 */

// 题目类型
const QUESTION_TYPE = {
  SINGLE: 'single',   // 单选题
  JUDGE: 'judge'      // 判断题
};

// 题目分类
const QUESTION_CATEGORY = {
  GAME_MECHANIC: '游戏机制',      // 游戏机制
  ROLE_ABILITY: '角色能力',      // 角色能力
  ROLE_INTERACTION: '能力互动',  // 能力互动
  ROLE_COUNTER: '角色相克',      // 角色相克
  SPECIAL_CASE: '特殊情况'       // 特殊情况
};

// 难度等级
const DIFFICULTY = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard'
};

// 考试配置
const EXAM_CONFIG = {
  SINGLE_COUNT: 16,     // 单选题数量
  JUDGE_COUNT: 26,      // 判断题数量
  TIME_LIMIT: 120 * 60, // 120分钟（秒）
  PASS_SCORE: 90        // 及格分
};

// 分值配置
const POINTS = {
  SINGLE: 3,  // 单选题每题分值
  JUDGE: 2    // 判断题每题分值
};

// 总分
const TOTAL_SCORE = EXAM_CONFIG.SINGLE_COUNT * POINTS.SINGLE + EXAM_CONFIG.JUDGE_COUNT * POINTS.JUDGE; // 100分

// LocalStorage key
const STORAGE_KEYS = {
  MISTAKES: 'clocktower_mistakes_v1',
  PROGRESS: 'clocktower_progress_v1',
  EXAM_HISTORY: 'clocktower_exam_history_v1',
  SETTINGS: 'clocktower_settings_v1'
};

// 分类对应的颜色（用于标签）
const CATEGORY_COLORS = {
  [QUESTION_CATEGORY.GAME_MECHANIC]: '#E63946',
  [QUESTION_CATEGORY.ROLE_ABILITY]: '#D4A843',
  [QUESTION_CATEGORY.ROLE_INTERACTION]: '#2A9D8F',
  [QUESTION_CATEGORY.ROLE_COUNTER]: '#6B5B7A',
  [QUESTION_CATEGORY.SPECIAL_CASE]: '#9A8FB0'
};

// 分类对应的英文名（用于 CSS class）
const CATEGORY_CLASS = {
  [QUESTION_CATEGORY.GAME_MECHANIC]: 'game-mechanic',
  [QUESTION_CATEGORY.ROLE_ABILITY]: 'role-ability',
  [QUESTION_CATEGORY.ROLE_INTERACTION]: 'role-interaction',
  [QUESTION_CATEGORY.ROLE_COUNTER]: 'role-counter',
  [QUESTION_CATEGORY.SPECIAL_CASE]: 'special-case'
};

module.exports = {
  QUESTION_TYPE,
  QUESTION_CATEGORY,
  DIFFICULTY,
  EXAM_CONFIG,
  POINTS,
  TOTAL_SCORE,
  STORAGE_KEYS,
  CATEGORY_COLORS,
  CATEGORY_CLASS
};
