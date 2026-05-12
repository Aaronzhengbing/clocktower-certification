/**
 * 题目详情/解析页
 */
import { getQuestionById } from '../utils/question-engine.js';

const app = document.getElementById('app');

async function render() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  if (!id) {
    app.innerHTML = `<div class="question-detail-page"><p>题目不存在</p></div>`;
    return;
  }

  const q = getQuestionById(id);
  // 需要从远程加载
  const questions = await import('../utils/question-engine.js').then(m => m.loadQuestions());
  const question = questions.map.get(id);

  if (!question) {
    app.innerHTML = `<div class="question-detail-page"><p>题目不存在</p></div>`;
    return;
  }

  const isSingle = question.type === 'single';
  const typeLabel = isSingle ? '单选题' : '判断题';
  const typeClass = isSingle ? 'type-tag-single' : 'type-tag-judge';

  // 选项
  const optionsHTML = question.options.map(opt => {
    const [label, text] = opt.split('. ');
    const isCorrect = label === question.answer;

    let displayLabel = label;
    if (!isSingle) {
      displayLabel = label === 'true' ? '是' : '否';
    }

    return `
      <div class="question-detail-option ${isCorrect ? 'is-answer' : ''}">
        <span class="question-detail-option-label">${displayLabel}</span>
        <span class="question-detail-option-text">${!isSingle ? opt : text}</span>
        ${isCorrect ? '<span style="color: var(--faction-good); margin-left: auto;">✓ 正确答案</span>' : ''}
      </div>
    `;
  }).join('');

  // 标签
  const tagsHTML = (question.tags || []).map(tag => `
    <span class="question-detail-tag">${tag}</span>
  `).join('');

  app.innerHTML = `
    <a href="javascript:history.back()" class="question-detail-back">← 返回</a>

    <div class="question-detail-card">
      <span class="question-detail-type-tag ${typeClass}">${typeLabel}</span>
      <p class="question-detail-text">${question.question}</p>

      <div class="question-detail-options">
        ${optionsHTML}
      </div>

      <div class="question-detail-explanation">
        <div class="question-detail-explanation-title">💡 解析</div>
        <p class="question-detail-explanation-text">${question.explanation}</p>
      </div>

      ${tagsHTML ? `
        <div class="question-detail-tags">
          ${tagsHTML}
        </div>
      ` : ''}
    </div>

    <div class="question-detail-nav">
      <button class="btn btn-secondary" id="btn-prev">← 上一题</button>
      <button class="btn btn-secondary" id="btn-next">下一题 →</button>
    </div>
  `;

  bindEvents(question);
}

function bindEvents(question) {
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    // 需要在所有题目中找上一题
    // 简化：返回上一页
    window.history.back();
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    window.history.back();
  });
}

render();
