/**
 * 考试模式页
 */
import { ExamEngine } from '../engine/exam-engine.js';
import { formatTime, formatScore } from '../engine/scorer.js';
import { EXAM_CONFIG, POINTS, TOTAL_SCORE } from '../constants.js';

const app = document.getElementById('app');
let examEngine = null;

async function init() {
  examEngine = new ExamEngine();

  // 检查是否已有进行中的考试
  const history = JSON.parse(localStorage.getItem('clocktower_exam_history_v1') || '{exams:[]}');
  const inProgress = history.exams.find(e => e.status === 'in_progress');

  if (inProgress) {
    // 恢复考试
    await examEngine.startExam();
    // 恢复答案
    const savedAnswers = JSON.parse(localStorage.getItem('clocktower_exam_answers_' + inProgress.examId) || '{}');
    Object.entries(savedAnswers).forEach(([qid, ans]) => {
      examEngine.answers.set(parseInt(qid), ans);
    });
    render();
    startTimerDisplay();
    return;
  }

  // 新考试
  const started = await examEngine.startExam();
  if (!started) {
    app.innerHTML = `
      <div class="exam-empty-state">
        <div class="icon">⚠️</div>
        <p>题库题目不足，无法开始考试</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">需要至少 16 道单选题和 26 道判断题</p>
      </div>
    `;
    return;
  }

  render();
  startTimerDisplay();
}

function startTimerDisplay() {
  const timerEl = () => document.getElementById('exam-timer');

  examEngine.onTimeRemaining(seconds => {
    const el = timerEl();
    if (el) {
      el.textContent = formatTime(seconds);
      if (seconds <= 300) { // 5 分钟预警
        el.classList.add('warning');
      }
      if (seconds <= 60) { // 1 分钟闪烁
        el.classList.add('countdown-warning');
      }
    }
  });

  examEngine.onTimeUp(() => {
    handleSubmit();
  });
}

function render() {
  const q = examEngine.getCurrentQuestion();
  const stats = examEngine.getStats();
  const answered = examEngine.isAnswered();
  const savedAnswer = answered ? examEngine.getSavedAnswer(q.id) : null;
  const qIndex = stats.currentIdx;
  const qType = q.type === 'single' ? '单选' : '判断';
  const qPoints = q.type === 'single' ? POINTS.SINGLE : POINTS.JUDGE;

  // 选项
  const optionsHTML = q.options.map(opt => {
    const [label, text] = opt.split('. ');
    const isSelected = savedAnswer === label;

    // 判断题特殊处理
    let displayLabel = label;
    if (q.type === 'judge') {
      displayLabel = label === 'true' ? '是' : '否';
    }

    return `
      <div class="option ${isSelected ? 'selected' : ''}" data-option="${label}">
        <span class="option-label">${displayLabel}</span>
        <span class="option-text">${q.type === 'judge' ? opt : text}</span>
      </div>
    `;
  }).join('');

  // 顶部栏
  const topbarHTML = `
    <div class="exam-topbar">
      <div class="exam-timer" id="exam-timer">${formatTime(examEngine.timeRemaining)}</div>
      <div class="exam-progress">
        第 ${qIndex} / ${stats.total} 题 · ${qType}(${qPoints}分)
      </div>
    </div>
    <div class="exam-progress-bar-wrapper">
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width: ${stats.progress}%"></div>
      </div>
    </div>
  `;

  // 底部栏
  const unansweredCount = examEngine.getUnansweredCount();
  const navHTML = `
    <div class="exam-footer">
      <div class="exam-nav">
        <button class="btn btn-secondary" id="btn-prev" ${qIndex <= 1 ? 'disabled' : ''}>← 上一题</button>
        <button class="btn btn-secondary" id="btn-next">${qIndex >= stats.total ? '提交考试' : '下一题 →'}</button>
      </div>
      ${unansweredCount > 0 ? `
        <div class="exam-unanswered-hint">还有 ${unansweredCount} 题未答</div>
      ` : ''}
    </div>
  `;

  app.innerHTML = topbarHTML + `
    <div class="exam-body">
      <div class="exam-question-card">
        <div class="exam-question-header">
          <span class="exam-question-label">${q.category}</span>
          <span class="exam-question-no">第 ${qIndex} 题</span>
        </div>
        <p class="exam-question-text">${q.question}</p>
      </div>

      <div class="exam-options">
        ${optionsHTML}
      </div>
    </div>
    ${navHTML}
  `;

  bindEvents();
}

function bindEvents() {
  // 选项选择
  document.querySelectorAll('.option').forEach(el => {
    el.addEventListener('click', () => {
      const option = el.dataset.option;
      examEngine.selectAnswer(option);
      render();
    });
  });

  // 上一题
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (examEngine.prev()) {
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // 下一题 / 提交
  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (examEngine.currentIdx >= examEngine.questions.length - 1) {
      // 提交确认
      const unanswered = examEngine.getUnansweredCount();
      if (unanswered > 0) {
        const confirmed = confirm(`还有 ${unanswered} 题未答，确定提交吗？未答题目按 0 分计算。`);
        if (!confirmed) return;
      }
      handleSubmit();
    } else {
      if (examEngine.next()) {
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
}

function handleSubmit() {
  examEngine.stopTimer();
  const results = examEngine.submitExam();

  // 跳转到成绩页，传递结果
  const resultsJson = encodeURIComponent(JSON.stringify(results));
  localStorage.setItem('clocktower_exam_result_' + results.examId, resultsJson);
  window.location.href = `result.html?examId=${results.examId}`;
}

init();
