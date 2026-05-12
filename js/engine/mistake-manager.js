/**
 * 错题本管理引擎
 */
import { storage } from '../utils/storage.js';
import { getQuestionById } from '../utils/question-engine.js';

class MistakeManager {
  constructor() {
    this.mistakes = storage.get('MISTAKES') || [];
  }

  /**
   * 记录错题（来自练习或考试）
   * @param {number} questionId - 题目ID
   * @param {string} userAnswer - 用户选择的答案
   * @param {string|null} examId - 来源考试ID（练习模式为null）
   */
  recordMistake(questionId, userAnswer, examId = null) {
    const question = getQuestionById(questionId);
    if (!question) return;

    // 去重：同一题只保留一条最新记录
    const idx = this.mistakes.findIndex(m => m.questionId === questionId);
    const record = {
      questionId,
      userAnswer,
      correctAnswer: question.answer,
      type: question.type,
      category: question.category,
      timestamp: new Date().toISOString(),
      examId
    };

    if (idx !== -1) {
      // 更新已有记录
      this.mistakes[idx] = record;
    } else {
      // 新增记录
      this.mistakes.push(record);
    }

    storage.set('MISTAKES', this.mistakes);
  }

  /**
   * 获取错题列表
   * @param {string} category - 分类筛选（'all' 或具体分类）
   * @param {string} searchText - 搜索关键词
   * @returns {Array} 错题记录数组
   */
  getMistakes(category = 'all', searchText = '') {
    let result = [...this.mistakes];

    if (category !== 'all') {
      result = result.filter(m => m.category === category);
    }

    if (searchText.trim()) {
      const keywords = searchText.trim();
      result = result.filter(m => {
        const q = getQuestionById(m.questionId);
        if (!q) return false;
        return q.question.includes(keywords) ||
          (q.tags && q.tags.some(t => t.includes(keywords)));
      });
    }

    // 按时间倒序
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return result;
  }

  /**
   * 获取错题总数
   */
  count() {
    return this.mistakes.length;
  }

  /**
   * 删除单个错题
   */
  removeMistake(questionId) {
    this.mistakes = this.mistakes.filter(m => m.questionId !== questionId);
    storage.set('MISTAKES', this.mistakes);
  }

  /**
   * 批量删除（按分类）
   */
  removeByCategory(category) {
    this.mistakes = this.mistakes.filter(m => m.category !== category);
    storage.set('MISTAKES', this.mistakes);
  }

  /**
   * 清空错题本
   */
  clearMistakes() {
    this.mistakes = [];
    storage.set('MISTAKES', []);
  }

  /**
   * 获取错题对应的完整题目（用于展示和练习）
   */
  getMistakeQuestions() {
    return this.mistakes.map(m => ({
      ...m,
      questionData: getQuestionById(m.questionId)
    }));
  }

  /**
   * 获取所有错题的分类分布
   */
  getCategoryDistribution() {
    const dist = {};
    this.mistakes.forEach(m => {
      dist[m.category] = (dist[m.category] || 0) + 1;
    });
    return dist;
  }
}

export { MistakeManager };
