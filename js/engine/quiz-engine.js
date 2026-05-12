/**
 * 练习模式引擎
 * 支持顺序练习 和 随机练习 500 道题
 */
import { storage } from '../utils/storage.js';
import { MistakeManager } from './mistake-manager.js';
import { loadQuestions, getQuestionsByType, shuffleArray } from '../utils/question-engine.js';

class QuizEngine {
  /**
   * @param {string} mode - 'order' | 'random' | 'mistakes'
   */
  constructor(mode = 'order') {
    this.mode = mode;
    this.currentIdx = 0;
    this.questionList = [];
    this.userAnswers = new Map();
    this.correctCount = 0;
    this.wrongCount = 0;
    this.mistakeManager = new MistakeManager();

    this.init();
  }

  /**
   * 初始化：加载题目并恢复进度
   */
  async init() {
    // 恢复进度
    const progress = storage.get('PROGRESS');
    const questions = await loadQuestions();

    if (progress && progress.mode === this.mode) {
      this.currentIdx = progress.currentIdx || 0;
      this.userAnswers = new Map(progress.userAnswers || []);
      this.correctCount = progress.correctCount || 0;
      this.wrongCount = progress.wrongCount || 0;
      this.questionList = progress.questionList || [];

      // 如果进度中的题目列表为空或长度不对，重新加载
      if (this.questionList.length === 0) {
        this._buildQuestionList(questions.list);
      }
    } else {
      this._buildQuestionList(questions.list);
    }
  }

  /**
   * 构建题目列表
   */
  _buildQuestionList(allQuestions) {
    if (this.mode === 'mistakes') {
      // 错题练习模式
      this.questionList = this.mistakeManager.getMistakeQuestions()
        .map(m => m.questionData);
    } else if (this.mode === 'random') {
      this.questionList = shuffleArray(allQuestions);
    } else {
      // 顺序模式
      this.questionList = allQuestions;
    }

    // 如果已有答题记录，保持顺序一致性
    if (this.userAnswers.size > 0) {
      // 已答题的保持在前面
      const answered = this.questionList.filter(q => this.userAnswers.has(q.id));
      const unanswered = this.questionList.filter(q => !this.userAnswers.has(q.id));
      this.questionList = [...answered, ...unanswered];
    }
  }

  /**
   * 获取当前题目
   */
  getCurrentQuestion() {
    return this.questionList[this.currentIdx] || null;
  }

  /**
   * 选择答案
   * @param {string} option - 选项标识（A/B/C/D 或 true/false）
   * @returns {Object} 反馈结果
   */
  selectAnswer(option) {
    const q = this.getCurrentQuestion();
    if (!q) return null;

    const isCorrect = option === q.answer;

    this.userAnswers.set(q.id, option);

    if (isCorrect) {
      this.correctCount++;
    } else {
      this.wrongCount++;
      // 自动记录错题
      this.mistakeManager.recordMistake(q.id, option);
    }

    this.saveProgress();

    return {
      isCorrect,
      correctAnswer: q.answer,
      explanation: q.explanation,
      question: q
    };
  }

  /**
   * 判断是否已答过当前题
   */
  isAnswered() {
    const q = this.getCurrentQuestion();
    return q ? this.userAnswers.has(q.id) : false;
  }

  /**
   * 获取已保存的答案
   */
  getSavedAnswer(questionId) {
    return this.userAnswers.get(questionId);
  }

  /**
   * 下一题
   */
  next() {
    if (this.currentIdx < this.questionList.length - 1) {
      this.currentIdx++;
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * 上一题
   */
  prev() {
    if (this.currentIdx > 0) {
      this.currentIdx--;
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * 跳转到指定题号
   */
  goTo(index) {
    if (index >= 0 && index < this.questionList.length) {
      this.currentIdx = index;
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * 保存进度到 LocalStorage
   */
  saveProgress() {
    storage.set('PROGRESS', {
      mode: this.mode,
      currentIdx: this.currentIdx,
      userAnswers: Array.from(this.userAnswers.entries()),
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      total: this.questionList.length,
      questionList: this.questionList.map(q => q.id)
    });
  }

  /**
   * 重置练习进度
   */
  reset() {
    this.currentIdx = 0;
    this.userAnswers.clear();
    this.correctCount = 0;
    this.wrongCount = 0;
    storage.remove('PROGRESS');
  }

  /**
   * 获取学习统计数据
   */
  getStats() {
    const total = this.questionList.length;
    const answered = this.userAnswers.size;
    return {
      currentIdx: this.currentIdx + 1,
      total,
      answered,
      progress: total > 0 ? ((answered / total) * 100).toFixed(1) : 0,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      accuracy: answered > 0 ? ((this.correctCount / answered) * 100).toFixed(1) : 0
    };
  }

  /**
   * 是否已完成全部练习
   */
  isCompleted() {
    return this.currentIdx >= this.questionList.length - 1;
  }
}

export { QuizEngine };
