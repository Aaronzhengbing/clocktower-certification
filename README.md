# 🕯️ 染钟楼说书人认证备考

> 基于钟楼百科 246 页规则文档，500 道精选题目的说书人认证备考练习工具

## ✨ 功能

| 功能 | 说明 |
|------|------|
| **📖 顺序练习** | 按顺序刷完 500 道题目，每道题即时反馈解析 |
| **🎲 随机练习** | 随机抽取题目练习，专治薄弱环节 |
| **📝 模拟考试** | 16 单选 + 26 判断 = 42 题，满分 100 分，限时 120 分钟 |
| **📚 错题本** | 自动记录错题，支持查看、筛选、删除、专项练习 |

## 📊 考试规则

| 项目 | 内容 |
|------|------|
| **单选题** | 16 道 × 3 分 = **48 分** |
| **判断题** | 26 道 × 2 分 = **52 分** |
| **总分** | **100 分** |
| **及格线** | **90 分** |
| **时限** | **120 分钟** |

## 📚 题库覆盖

| 分类 | 说明 |
|------|------|
| 游戏机制 | 基础规则、死亡与能力、夜晚行动顺序等 |
| 角色能力 | 各剧本角色能力详解（暗流涌动/黯月初升/梦殒春宵等） |
| 能力互动 | 角色间能力触发顺序与相互作用 |
| 角色相克 | 驱魔人、守鸦人等克制恶魔的机制 |
| 特殊情况 | 极端边缘情况处理 |

> ⚠️ 当前题库不包含「华灯初上」角色题目

## 🚀 快速开始

### 方式一：在线使用（推荐）

访问：`https://<your-github-username>.github.io/clocktower-certification/`

### 方式二：本地运行

```bash
# 克隆或下载本项目
cd clocktower-certification

# 用浏览器打开 index.html
# 或使用本地服务器
npx serve .
```

## 📁 项目结构

```
clocktower-certification/
├── css/                    # 样式
│   ├── variables.css       # CSS 自定义属性
│   ├── base.css            # 基础样式
│   ├── layout.css          # 布局
│   ├── components.css      # 组件
│   └── pages/              # 页面专属样式
├── js/
│   ├── app.js              # 首页入口
│   ├── constants.js        # 常量定义
│   ├── engine/             # 核心引擎
│   │   ├── quiz-engine.js  # 练习模式
│   │   ├── exam-engine.js  # 考试模式
│   │   ├── scorer.js       # 评分
│   │   └── mistake-manager.js  # 错题本
│   ├── utils/              # 工具
│   │   ├── storage.js      # LocalStorage 封装
│   │   └── question-engine.js  # 题目加载
│   └── pages/              # 页面 JS（待生成）
├── data/
│   └── questions.json      # 500 道题目
├── scripts/
│   └── validate-questions.js  # 题目验证脚本
└── .github/workflows/
    └── deploy.yml          # GitHub Pages CI/CD
```

## 🛠️ 题目质量保障

- ✅ 自动校验：ID 唯一性、答案有效性、选项格式
- ✅ 每道题含详细解析，引用官方规则来源
- ✅ 按分类和难度标注，方便定向练习
- ✅ 题目来源：钟楼百科（官方中文规则站）

## 📈 题目批量生成流程

```
钟楼百科 246 页 Markdown
       ↓
   AI 分批次生成（每批 50 题）
       ↓
   自动化脚本校验（格式/答案/重复）
       ↓
   人工审核（角色能力准确性）
       ↓
   合并入 questions.json
       ↓
   Git 版本控制 + CI 自动验证
```

## 📝 贡献题目

本项目支持社区贡献题目。提交 PR 时请：

1. 在 `data/questions.json` 末尾追加新题目
2. 确保格式符合 JSON Schema
3. 运行 `node scripts/validate-questions.js` 通过校验
4. 提供题目解析和来源引用

## 📄 题库来源

- [钟楼百科](https://clocktower-wiki.gstonegames.com/index.php?title=首页)（集石独家运营）
- 抓取时间：2026-05-12
- 已抓取页面：246 个

---

> ⚠️ 声明：本工具仅供学习备考使用，题目内容均来自官方公开规则文档。不构成任何认证考试的官方认可。
