/**
 * 考试模式引擎
 * 16 单选 + 26 判断 = 42 题，满分 100 分，限时 120 分钟
 */
const { storage } = require('../utils/storage');
const { MistakeManager } = require('./mistake-manager');
const { loadQuestions, getQuestionsByType, shuffleArray } = require('../utils/question-engine');
const { calculateScore } = require('./scorer');
const { EXAM_CONFIG } = require('../constants');

class ExamEngine {
  constructor() {
    this.examId = `exam-${Date.now()}`;
    this.questions = [];
    this.currentIdx = 0;
    this.answers = new Map();
    this.timeRemaining = EXAM_CONFIG.TIME_LIMIT;
    this.timerId = null;
    this.timerCallback = null;
    this.timeUpCallback = null;
    this.startTime = null;
  }

  /**
   * 初始化考试：随机抽取 16 单选 + 26 判断
   */
  async startExam() {
    const questions = await loadQuestions();

    const singles = shuffleArray(getQuestionsByType('single')).slice(0, EXAM_CONFIG.SINGLE_COUNT);
    const judges = shuffleArray(getQuestionsByType('judge')).slice(0, EXAM_CONFIG.JUDGE_COUNT);

    this.questions = [...singles, ...judges];
    // 混合打乱（单选和判断交替出现，避免连续同类型）
    this.questions = shuffleArray(this.questions);

    this.startTime = new Date().toISOString();
    this.timeRemaining = EXAM_CONFIG.TIME_LIMIT;

    // 保存考试元数据
    this._saveExamMeta();

    // 启动倒计时
    this.startTimer();

    return true;
  }

  /**
   * 启动倒计时
   */
  startTimer() {
    this.timerId = setInterval(() => {
      this.timeRemaining--;

      if (this.timerCallback) {
        this.timerCallback(this.timeRemaining);
      }

      if (this.timeRemaining <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  /**
   * 停止倒计时
   */
  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * 设置倒计时回调
   */
  onTimeRemaining(callback) {
    this.timerCallback = callback;
  }

  /**
   * 设置时间到回调
   */
  onTimeUp(callback) {
    this.timeUpCallback = callback;
  }

  /**
   * 获取当前题目
   */
  getCurrentQuestion() {
    return this.questions[this.currentIdx] || null;
  }

  /**
   * 选择答案
   */
  selectAnswer(option) {
    const q = this.getCurrentQuestion();
    if (!q) return false;
    this.answers.set(q.id, option);
    return true;
  }

  /**
   * 判断是否已答过当前题
   */
  isAnswered() {
    const q = this.getCurrentQuestion();
    return q ? this.answers.has(q.id) : false;
  }

  /**
   * 获取已保存的答案
   */
  getSavedAnswer(questionId) {
    return this.answers.get(questionId);
  }

  /**
   * 下一题
   */
  next() {
    if (this.currentIdx < this.questions.length - 1) {
      this.currentIdx++;
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
      return true;
    }
    return false;
  }

  /**
   * 跳转到指定题号
   */
  goTo(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIdx = index;
      return true;
    }
    return false;
  }

  /**
   * 提交考试
   */
  submitExam() {
    this.stopTimer();

    // 计算分数
    const results = calculateScore(this.questions, this.answers);
    results.examId = this.examId;
    results.startTime = this.startTime;
    results.endTime = new Date().toISOString();

    // 保存考试记录
    this._saveExamResult(results);

    // 自动记录错题到错题本
    const mistakeManager = new MistakeManager();
    results.details.forEach(r => {
      if (!r.correct) {
        mistakeManager.recordMistake(r.questionId, r.userAnswer, this.examId);
      }
    });

    // 清除练习进度（考试是独立的）
    storage.remove('PROGRESS');

    return results;
  }

  /**
   * 保存考试元数据
   */
  _saveExamMeta() {
    const history = storage.get('EXAM_HISTORY') || { exams: [] };
    history.exams.push({
      examId: this.examId,
      startTime: this.startTime,
      status: 'in_progress'
    });
    storage.set('EXAM_HISTORY', history);
  }

  /**
   * 保存考试结果
   */
  _saveExamResult(results) {
    const history = storage.get('EXAM_HISTORY') || { exams: [] };
    const idx = history.exams.findIndex(e => e.examId === this.examId);
    if (idx !== -1) {
      history.exams[idx] = { ...history.exams[idx], ...results };
    }
    storage.set('EXAM_HISTORY', history);
  }

  /**
   * 获取考试统计数据
   */
  getStats() {
    return {
      currentIdx: this.currentIdx + 1,
      total: this.questions.length,
      timeRemaining: this.timeRemaining,
      answered: this.answers.size,
      progress: ((this.currentIdx + 1) / this.questions.length * 100).toFixed(1)
    };
  }

  /**
   * 是否已全部答题
   */
  isAllAnswered() {
    return this.answers.size === this.questions.length;
  }

  /**
   * 获取未答题目数量
   */
  getUnansweredCount() {
    return this.questions.length - this.answers.size;
  }

  /**
   * 获取本次考试的题目列表（用于成绩页展示）
   */
  getQuestions() {
    return this.questions;
  }
}

module.exports = { ExamEngine };
