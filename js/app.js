/**
 * 应用入口 - 首页
 */
import { storage } from './utils/storage.js';
import { MistakeManager } from './engine/mistake-manager.js';
import { loadQuestions } from './utils/question-engine.js';
import { TOTAL_SCORE, EXAM_CONFIG } from './constants.js';

const app = document.getElementById('app');

async function render() {
  try {
    // 加载题目统计数据
    const stats = await loadQuestions().then(q => q.stats);

    const mistakeManager = new MistakeManager();
    const mistakeCount = mistakeManager.count();

    app.innerHTML = `
      <h1 class="home-logo">🕯️ 染钟楼说书人认证备考</h1>
      <p class="home-subtitle">基于钟楼百科 246 页规则文档 · 500 道精选题目</p>

      <div class="home-actions">
        <!-- 学习卡片 -->
        <a href="learn.html?mode=order" class="home-action-card">
          <div class="home-action-icon">📖</div>
          <h3 class="home-action-title">顺序练习</h3>
          <p class="home-action-desc">按顺序刷完 500 道题目<br>每道题即时反馈解析</p>
        </a>

        <a href="learn.html?mode=random" class="home-action-card">
          <div class="home-action-icon">🎲</div>
          <h3 class="home-action-title">随机练习</h3>
          <p class="home-action-desc">随机抽取题目练习<br>专治薄弱环节</p>
        </a>

        <!-- 考试卡片 -->
        <a href="exam.html" class="home-action-card">
          <div class="home-action-icon">📝</div>
          <h3 class="home-action-title">模拟考试</h3>
          <p class="home-action-desc">16 单选 + 26 判断 = 42 题<br>满分${TOTAL_SCORE}，限时120分钟</p>
        </a>
      </div>

      <!-- 错题本快捷入口 -->
      ${mistakeCount > 0 ? `
        <a href="mistakes.html" class="home-mistakes-quick">
          <span>📚 错题本</span>
          <span class="mistake-count">${mistakeCount} 题待复习</span>
        </a>
      ` : ''}

      <!-- 题库统计 -->
      ${stats ? `
        <div class="card" style="margin-top: var(--space-6); max-width: 400px;">
          <h4 class="text-center" style="margin-bottom: var(--space-4);">📊 题库统计</h4>
          <div class="grid grid-3">
            <div class="stat-card gold">
              <div class="stat-value">${stats.total || 0}</div>
              <div class="stat-label">总题数</div>
            </div>
            <div class="stat-card single">
              <div class="stat-value">${stats.single || 0}</div>
              <div class="stat-label">单选题</div>
            </div>
            <div class="stat-card judge">
              <div class="stat-value">${stats.judge || 0}</div>
              <div class="stat-label">判断题</div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="home-footer">
        <p>题库来源: <a href="https://clocktower-wiki.gstonegames.com/" target="_blank">钟楼百科</a> · 2026-05-12</p>
      </div>
    `;
  } catch (err) {
    console.error('首页渲染失败:', err);
    app.innerHTML = `
      <div class="home-page">
        <h1 class="home-logo">⚠️ 加载失败</h1>
        <p>题目数据加载失败，请刷新页面重试</p>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">${err.message}</p>
      </div>
    `;
  }
}

render();
