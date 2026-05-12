/**
 * 成绩页
 */
import { formatScore, formatTime } from '../engine/scorer.js';
import { MistakeManager } from '../engine/mistake-manager.js';

const app = document.getElementById('app');
let examResult = null;

async function render() {
  const params = new URLSearchParams(window.location.search);
  const examId = params.get('examId');

  if (!examId) {
    app.innerHTML = `
      <div class="result-page">
        <h2>无考试记录</h2>
        <p>请先生成考试</p>
        <a href="exam.html" class="btn btn-primary">去考试</a>
      </div>
    `;
    return;
  }

  // 尝试从 localStorage 读取结果
  const saved = localStorage.getItem('clocktower_exam_result_' + examId);
  if (!saved) {
    app.innerHTML = `
      <div class="result-page">
        <h2>考试记录不存在</h2>
        <p>可能已过有效期，请重新考试</p>
        <a href="exam.html" class="btn btn-primary">重新考试</a>
      </div>
    `;
    return;
  }

  examResult = JSON.parse(saved);
  renderResult();
}

function renderResult() {
  const r = examResult;

  // 通过/未通过徽章
  const badgeClass = r.passed ? 'pass' : 'fail';
  const badgeText = r.passed ? '✅ 通过' : '❌ 未通过';

  // 详细错题列表
  const wrongDetails = r.wrongDetails || [];
  let wrongListHTML = '';
  if (wrongDetails.length > 0) {
    wrongListHTML = `
      <div class="result-wrong-list">
        ${wrongDetails.map((item, i) => {
          const q = item; // 题目数据
          const userLabel = q.type === 'single' ? q.userAnswer : (q.userAnswer === 'true' ? '是' : '否');
          const correctLabel = q.type === 'single' ? q.correctAnswer : (q.correctAnswer === 'true' ? '是' : '否');

          return `
            <div class="result-wrong-item" data-index="${i}">
              <div class="result-wrong-q">
                <span class="result-wrong-category tag ${q.type === 'single' ? 'type-tag-single' : 'type-tag-judge'}">
                  ${q.type === 'single' ? '单选' : '判断'}
                </span>
                <span class="result-wrong-q-text">${truncate(q.question, 40)}...</span>
                <span class="result-wrong-ans">你选${userLabel} → 正确${correctLabel}</span>
              </div>
              <button class="result-wrong-expand-btn btn-small" data-index="${i}">💡 解析</button>
            </div>
            <div class="result-wrong-explanation" data-index="${i}">
              <strong>💡 解析：</strong>${q.explanation}
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    wrongListHTML = `
      <div class="result-wrong-list">
        <p style="text-align: center; color: var(--text-secondary);">🎉 完美！全部正确！</p>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="result-header">
      <h2>🏆 考试结果</h2>
      <span class="result-badge ${badgeClass}">${badgeText}</span>
      <div class="result-score ${badgeClass}">${r.score}</div>
      <div class="result-score-label">满分 ${r.totalScore} · 需要 ${EXAM_CONFIG.PASS_SCORE} 分通过</div>
    </div>

    <div class="result-detail-card">
      <h3 class="result-detail-title">📊 分数详情</h3>
      <div class="result-score-breakdown">
        <div class="result-score-item single">
          <div class="value">${formatScore(r.singleScore, r.singleMax)}</div>
          <div class="label">单选题 · ${r.singleCount} 题</div>
        </div>
        <div class="result-score-item judge">
          <div class="value">${formatScore(r.judgeScore, r.judgeMax)}</div>
          <div class="label">判断题 · ${r.judgeCount} 题</div>
        </div>
      </div>
      <div class="result-stats-row">
        <div class="stat">
          <div class="stat-num" style="color: var(--faction-good);">${r.correctCount}</div>
          <div class="stat-label">正确</div>
        </div>
        <div class="stat">
          <div class="stat-num" style="color: var(--faction-evil);">${r.wrongCount}</div>
          <div class="stat-label">错误</div>
        </div>
        <div class="stat">
          <div class="stat-num">${r.accuracy}%</div>
          <div class="stat-label">正确率</div>
        </div>
      </div>
    </div>

    <div class="result-detail-card">
      <h3 class="result-detail-title">📚 错题清单（${wrongDetails.length} 题）</h3>
      ${wrongListHTML}
    </div>

    <div class="result-actions">
      <a href="index.html" class="btn btn-secondary">← 返回首页</a>
      <a href="exam.html" class="btn btn-primary">🔄 重新考试</a>
      <a href="mistakes.html" class="btn btn-outline">📚 去错题本</a>
    </div>
  `;

  // 绑定错题展开事件
  document.querySelectorAll('.result-wrong-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      const explanationEl = document.querySelector(`.result-wrong-explanation[data-index="${idx}"]`);
      explanationEl.classList.toggle('show');
      btn.textContent = explanationEl.classList.contains('show') ? '收起' : '💡 解析';
    });
  });
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen);
}

// 需要导入 EXAM_CONFIG
const EXAM_CONFIG = { PASS_SCORE: 90 };

render();
