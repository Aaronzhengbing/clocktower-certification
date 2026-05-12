/**
 * 学习模式页
 */
import { QuizEngine } from '../engine/quiz-engine.js';
import { MistakeManager } from '../engine/mistake-manager.js';
import { CATEGORY_COLORS, CATEGORY_CLASS } from '../constants.js';

const app = document.getElementById('app');
let quizEngine = null;

async function render() {
  // 从 URL 获取模式
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || 'order'; // 'order' | 'random' | 'mistakes'

  // 初始化引擎
  quizEngine = new QuizEngine(mode);
  await quizEngine.init();

  renderPage();
}

function renderPage() {
  const q = quizEngine.getCurrentQuestion();
  const stats = quizEngine.getStats();
  const answered = quizEngine.isAnswered();
  const savedAnswer = answered ? quizEngine.getSavedAnswer(q.id) : null;

  // 分类标签
  const catColor = CATEGORY_COLORS[q.category] || '#6B5B7A';
  const catClass = CATEGORY_CLASS[q.category] || '';

  // 选项渲染
  const optionsHTML = q.options.map((opt, i) => {
    const [label, text] = opt.split('. ');
    const isSelected = savedAnswer === label;
    let feedbackClass = '';
    let checkIcon = '';

    if (answered) {
      if (label === q.answer) {
        feedbackClass = 'correct';
        checkIcon = '<span class="option-feedback correct"></span>';
      } else if (isSelected && label !== q.answer) {
        feedbackClass = 'wrong';
        checkIcon = '<span class="option-feedback wrong"></span>';
      }
    }

    const className = `option ${isSelected ? 'selected' : ''} ${feedbackClass} ${answered ? '' : ''}`;
    return `
      <div class="${className}" data-option="${label}">
        <span class="option-label">${label}</span>
        <span class="option-text">${text}</span>
        ${checkIcon}
      </div>
    `;
  }).join('');

  // 反馈区域
  let feedbackHTML = '';
  if (answered) {
    const feedback = quizEngine.selectAnswer(savedAnswer); // 重新获取反馈
    const isCorrect = feedback.isCorrect;
    feedbackHTML = `
      <div class="feedback-area ${isCorrect ? 'correct' : 'wrong'} learn-feedback">
        <div class="feedback-status">${isCorrect ? '✅ 回答正确' : '❌ 回答错误'}</div>
        ${!isCorrect ? `
          <div class="feedback-answer">
            正确答案：<span class="correct-label">${q.options.find(o => o.startsWith(feedback.correctAnswer))}</span>
          </div>
        ` : ''}
        <div class="feedback-explanation">
          <strong>💡 解析</strong>
          <p>${feedback.explanation}</p>
        </div>
      </div>
    `;
  }

  // 导航按钮状态
  const canPrev = stats.currentIdx > 1;
  const canNext = !quizEngine.isCompleted();
  const nextText = quizEngine.isCompleted() ? '🎉 练习完成' : '下一题 →';

  app.innerHTML = `
    <div class="learn-header">
      <a href="index.html" class="learn-back">← 回首页</a>
      <div class="learn-progress-info">
        <div class="current">第 ${stats.currentIdx} / ${stats.total} 题</div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${stats.progress}%"></div>
        </div>
      </div>
    </div>

    <div class="learn-category-tags">
      <span class="tag ${catClass}" style="border-left-color: ${catColor}; color: ${catColor};">
        ${q.category}
      </span>
      <span class="tag">${q.difficulty === 'easy' ? '简单' : q.difficulty === 'normal' ? '普通' : '困难'}</span>
    </div>

    <div class="learn-question-card">
      <p class="learn-question-text">${q.question}</p>
    </div>

    <div class="learn-options">
      ${optionsHTML}
    </div>

    ${feedbackHTML}

    ${quizEngine.isCompleted() ? `
      <div class="learn-complete-banner">
        <div class="banner-title">🎉 全部完成！</div>
        <div class="banner-stats">
          <div style="text-align: center;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--faction-good);">${stats.correctCount}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">正确</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--faction-evil);">${stats.wrongCount}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">错误</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 2rem; font-weight: 700; color: var(--accent-gold);">${stats.accuracy}%</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">正确率</div>
          </div>
        </div>
        <a href="mistakes.html" class="btn btn-primary">去错题本复习</a>
      </div>
    ` : ''}

    <div class="learn-footer">
      <div class="learn-stats">
        <span class="learn-stat correct">✅ ${stats.correctCount} 正确</span>
        <span class="learn-stat wrong">❌ ${stats.wrongCount} 错误</span>
      </div>
      <div class="learn-nav">
        <button class="btn btn-secondary btn-prev" ${!canPrev ? 'disabled' : ''}>← 上一题</button>
        <button class="btn btn-primary btn-next">${nextText}</button>
      </div>
    </div>
  `;

  // 绑定事件
  bindEvents(q, answered);
}

function bindEvents(question, answered) {
  // 选项选择
  document.querySelectorAll('.option').forEach(el => {
    el.addEventListener('click', () => {
      if (answered) return; // 已答题不可更改

      const option = el.dataset.option;
      const result = quizEngine.selectAnswer(option);

      // 更新UI
      document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
      });
      el.classList.add('selected');

      // 显示反馈
      const feedbackHTML = `
        <div class="feedback-area ${result.isCorrect ? 'correct' : 'wrong'} learn-feedback">
          <div class="feedback-status">${result.isCorrect ? '✅ 回答正确' : '❌ 回答错误'}</div>
          ${!result.isCorrect ? `
            <div class="feedback-answer">
              正确答案：<span class="correct-label">${question.options.find(o => o.startsWith(result.correctAnswer))}</span>
            </div>
          ` : ''}
          <div class="feedback-explanation">
            <strong>💡 解析</strong>
            <p>${result.explanation}</p>
          </div>
        </div>
      `;

      // 插入反馈区域
      const optionsEl = document.querySelector('.learn-options');
      let feedbackEl = document.querySelector('.learn-feedback');
      if (!feedbackEl) {
        optionsEl.insertAdjacentHTML('afterend', feedbackHTML);
      } else {
        feedbackEl.outerHTML = feedbackHTML;
      }

      // 更新选项样式
      document.querySelectorAll('.option').forEach(opt => {
        const optLabel = opt.dataset.option;
        if (optLabel === question.answer) {
          opt.classList.add('correct');
          opt.insertAdjacentHTML('beforeend', '<span class="option-feedback correct"></span>');
        } else if (optLabel === option && optLabel !== question.answer) {
          opt.classList.add('wrong');
          opt.insertAdjacentHTML('beforeend', '<span class="option-feedback wrong"></span>');
        }
      });

      // 更新统计
      updateStats();

      // 滚动到反馈
      setTimeout(() => {
        document.querySelector('.learn-feedback')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });

  // 上一题
  document.querySelector('.btn-prev')?.addEventListener('click', () => {
    if (quizEngine.prev()) {
      renderPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // 下一题
  document.querySelector('.btn-next')?.addEventListener('click', () => {
    if (quizEngine.isCompleted()) {
      return;
    }
    if (quizEngine.next()) {
      renderPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function updateStats() {
  const stats = quizEngine.getStats();
  const correctEl = document.querySelector('.learn-stats .learn-stat.correct');
  const wrongEl = document.querySelector('.learn-stats .learn-stat.wrong');
  if (correctEl) correctEl.textContent = `✅ ${stats.correctCount} 正确`;
  if (wrongEl) wrongEl.textContent = `❌ ${stats.wrongCount} 错误`;
}

render();
