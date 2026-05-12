/**
 * 错题本页
 */
import { MistakeManager } from '../engine/mistake-manager.js';
import { CATEGORY_COLORS, CATEGORY_CLASS, QUESTION_CATEGORY } from '../constants.js';

const app = document.getElementById('app');
const mistakeManager = new MistakeManager();

function render() {
  const mistakes = mistakeManager.getMistakeQuestions();
  const count = mistakeManager.count();

  if (count === 0) {
    app.innerHTML = `
      <div class="mistakes-page">
        <div class="mistakes-header">
          <h2>📚 错题本</h2>
        </div>
        <div class="mistakes-empty">
          <div class="icon">🎉</div>
          <p>暂无错题</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">答题正确时不会出现错题哦</p>
          <div style="margin-top: var(--space-5); display: flex; gap: var(--space-3); justify-content: center;">
            <a href="learn.html?mode=order" class="btn btn-primary">开始练习</a>
            <a href="exam.html" class="btn btn-secondary">模拟考试</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 分类统计
  const categories = mistakeManager.getMistakeCategories();

  // 错误卡片渲染
  const cardsHTML = mistakes.map(m => {
    const q = m.questionData;
    const userLabel = q.type === 'single' ? m.userAnswer : (m.userAnswer === 'true' ? '是' : '否');
    const correctLabel = q.type === 'single' ? m.correctAnswer : (m.correctAnswer === 'true' ? '是' : '否');
    const catColor = CATEGORY_COLORS[q.category] || '#6B5B7A';
    const dateStr = new Date(m.timestamp).toLocaleDateString('zh-CN');

    return `
      <div class="mistake-card">
        <div class="mistake-card-header">
          <div>
            <div class="mistake-card-title">${q.question}</div>
            <div class="mistake-card-meta">
              <span class="tag ${CATEGORY_CLASS[q.category]}" style="border-left-color: ${catColor}; color: ${catColor};">${q.category}</span>
              · ${dateStr}
            </div>
            <div class="mistake-card-ans">
              <span class="user">你选 ${userLabel}</span>
              · <span class="correct">正确 ${correctLabel}</span>
            </div>
          </div>
          <div class="mistake-card-actions">
            <a href="question-detail.html?id=${q.id}" class="btn btn-small btn-outline">查看</a>
            <button class="btn btn-small btn-danger" data-remove="${q.id}">删除</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="mistakes-page">
      <div class="mistakes-header">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <a href="index.html" class="mistakes-back">← 返回首页</a>
          <h2>📚 错题本</h2>
          <span class="mistakes-count-badge">${count} 题</span>
        </div>
        <a href="learn.html?mode=mistakes" class="btn btn-primary btn-small">🔄 练习全部错题</a>
      </div>

      <div class="mistakes-filter">
        <div class="mistakes-category-filter">
          <button class="mistakes-category-btn active" data-category="all">全部</button>
          ${Object.values(QUESTION_CATEGORY).map(cat => `
            <button class="mistakes-category-btn" data-category="${cat}">${cat}</button>
          `).join('')}
        </div>
      </div>

      <div class="mistakes-list">
        ${cardsHTML}
      </div>

      <div class="mistakes-footer">
        <button class="btn btn-danger" id="btn-clear-all">🗑️ 清空错题本</button>
      </div>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  // 分类筛选
  document.querySelectorAll('.mistakes-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mistakes-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMistakes(btn.dataset.category);
    });
  });

  // 删除单个错题
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = parseInt(btn.dataset.remove);
      if (confirm('确认删除这道错题吗？')) {
        mistakeManager.removeMistake(qid);
        render();
      }
    });
  });

  // 清空全部
  document.getElementById('btn-clear-all')?.addEventListener('click', () => {
    if (confirm(`确认清空错题本吗？（共 ${mistakeManager.count()} 题）此操作不可恢复`)) {
      mistakeManager.clearMistakes();
      render();
    }
  });
}

function filterMistakes(category) {
  const mistakesWithQuestionData = mistakeManager.getMistakeQuestions();
  const filtered = category === 'all'
    ? mistakesWithQuestionData
    : mistakesWithQuestionData.filter(m => m.category === category);

  if (filtered.length === 0) {
    document.querySelector('.mistakes-list').innerHTML = `
      <div class="mistakes-empty">
        <p>该分类下暂无错题</p>
      </div>
    `;
    return;
  }

  // 重新渲染卡片
  const cardsHTML = filtered.map(m => {
    const q = m.questionData;
    const userLabel = q.type === 'single' ? m.userAnswer : (m.userAnswer === 'true' ? '是' : '否');
    const correctLabel = q.type === 'single' ? m.correctAnswer : (m.correctAnswer === 'true' ? '是' : '否');
    const catColor = CATEGORY_COLORS[q.category] || '#6B5B7A';
    const dateStr = new Date(m.timestamp).toLocaleDateString('zh-CN');

    return `
      <div class="mistake-card">
        <div class="mistake-card-header">
          <div>
            <div class="mistake-card-title">${q.question}</div>
            <div class="mistake-card-meta">
              <span class="tag ${CATEGORY_CLASS[q.category]}" style="border-left-color: ${catColor}; color: ${catColor};">${q.category}</span>
              · ${dateStr}
            </div>
            <div class="mistake-card-ans">
              <span class="user">你选 ${userLabel}</span>
              · <span class="correct">正确 ${correctLabel}</span>
            </div>
          </div>
          <div class="mistake-card-actions">
            <a href="question-detail.html?id=${q.id}" class="btn btn-small btn-outline">查看</a>
            <button class="btn btn-small btn-danger" data-remove="${q.id}">删除</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.querySelector('.mistakes-list').innerHTML = cardsHTML;
}

render();
