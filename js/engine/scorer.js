/**
 * 评分引擎
 */
import { POINTS, TOTAL_SCORE, EXAM_CONFIG } from '../constants.js';
import { getQuestionById } from '../utils/question-engine.js';

/**
 * 计算考试分数
 * @param {Array} questions 本次考试的题目数组
 * @param {Map} userAnswers 用户答案 Map: questionId → answer
 * @returns {Object} 评分结果
 */
function calculateScore(questions, userAnswers) {
  let score = 0;
  const details = questions.map(q => {
    const userAnswer = userAnswers.get(q.id);
    const isCorrect = userAnswer === q.answer;
    const points = q.type === 'single' ? POINTS.SINGLE : POINTS.JUDGE;
    const earned = isCorrect ? points : 0;
    score += earned;

    return {
      questionId: q.id,
      type: q.type,
      category: q.category,
      userAnswer,
      correctAnswer: q.answer,
      correct: isCorrect,
      points,
      earned,
      explanation: q.explanation,
      question: q.question
    };
  });

  const singleDetails = details.filter(d => d.type === 'single');
  const judgeDetails = details.filter(d => d.type === 'judge');

  const correctCount = details.filter(d => d.correct).length;

  return {
    score,
    totalScore: TOTAL_SCORE,
    passed: score >= EXAM_CONFIG.PASS_SCORE,
    singleScore: singleDetails.reduce((s, d) => s + d.earned, 0),
    singleMax: singleDetails.reduce((s, d) => s + d.points, 0),
    singleCount: singleDetails.length,
    judgeScore: judgeDetails.reduce((s, d) => s + d.earned, 0),
    judgeMax: judgeDetails.reduce((s, d) => s + d.points, 0),
    judgeCount: judgeDetails.length,
    correctCount,
    wrongCount: details.length - correctCount,
    accuracy: ((correctCount / details.length) * 100).toFixed(1),
    details,
    wrongDetails: details.filter(d => !d.correct)
  };
}

/**
 * 格式化分数显示（如 "85/100"）
 */
function formatScore(score, total) {
  return `${score}/${total}`;
}

/**
 * 格式化时间（秒 → MM:SS）
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export {
  calculateScore,
  formatScore,
  formatTime
};
