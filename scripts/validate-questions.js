/**
 * 题目 JSON 验证脚本（CI/CD 使用）
 */
const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, '..', 'data', 'questions.json');

// 期望配置
const EXPECTED = {
  total: 500,
  single: 200,
  judge: 300,
  categories: ['游戏机制', '角色能力', '能力互动', '角色相克', '特殊情况'],
  difficulties: ['easy', 'normal', 'hard']
};

const errors = [];
const warnings = [];

function validate() {
  // 1. 读取文件
  let data;
  try {
    const raw = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    errors.push(`❌ JSON 格式错误: ${e.message}`);
    return false;
  }

  // 2. 检查 questions 数组
  if (!Array.isArray(data.questions)) {
    errors.push('❌ 缺少 questions 数组');
    return false;
  }

  const questions = data.questions;
  console.log(`📄 共 ${questions.length} 道题目\n`);

  // 3. 检查 ID 唯一性
  const ids = new Set();
  questions.forEach((q, i) => {
    if (ids.has(q.id)) {
      errors.push(`❌ ID ${q.id} 重复（题目索引 ${i}）`);
    }
    ids.add(q.id);
  });

  // 4. 检查每道题的字段
  questions.forEach((q, i) => {
    // 必填字段
    ['id', 'type', 'category', 'question', 'options', 'answer', 'explanation', 'tags'].forEach(field => {
      if (!(field in q)) {
        errors.push(`❌ 题目 ${q.id || i}: 缺少字段 "${field}"`);
      }
    });

    // 类型校验
    if (q.type !== 'single' && q.type !== 'judge') {
      errors.push(`❌ 题目 ${q.id}: type 应为 single 或 judge，实际为 "${q.type}"`);
    }

    // 分类校验
    if (!EXPECTED.categories.includes(q.category)) {
      errors.push(`❌ 题目 ${q.id}: 无效分类 "${q.category}"`);
    }

    // 难度校验
    if (!EXPECTED.difficulties.includes(q.difficulty)) {
      warnings.push(`⚠️ 题目 ${q.id}: 未知难度 "${q.difficulty}"`);
    }

    // 选项数量
    const expectedOptions = q.type === 'single' ? 4 : 2;
    if (q.options.length !== expectedOptions) {
      errors.push(`❌ 题目 ${q.id}: ${q.type === 'single' ? '单选' : '判断'}题应有 ${expectedOptions} 个选项，实际 ${q.options.length} 个`);
    }

    // 答案有效性
    if (q.type === 'single') {
      if (!['A', 'B', 'C', 'D'].includes(q.answer)) {
        errors.push(`❌ 题目 ${q.id}: 单选题答案应为 A/B/C/D，实际为 "${q.answer}"`);
      }
    } else if (q.type === 'judge') {
      if (!['true', 'false'].includes(q.answer)) {
        errors.push(`❌ 题目 ${q.id}: 判断题答案应为 true/false，实际为 "${q.answer}"`);
      }
      // 判断题选项应为 "是"/"否"
      if (!q.options.includes('是') || !q.options.includes('否')) {
        warnings.push(`⚠️ 题目 ${q.id}: 判断题选项建议为 ["是", "否"]`);
      }
    }

    // 解析长度
    if (!q.explanation || q.explanation.trim().length < 20) {
      warnings.push(`⚠️ 题目 ${q.id}: 解析过短（<20 字符）`);
    }

    // 标签
    if (!Array.isArray(q.tags) || q.tags.length === 0) {
      warnings.push(`⚠️ 题目 ${q.id}: 缺少标签`);
    }
  });

  // 5. 统计分布
  const typeCount = { single: 0, judge: 0 };
  const categoryCount = {};
  const difficultyCount = { easy: 0, normal: 0, hard: 0 };

  questions.forEach(q => {
    typeCount[q.type]++;
    categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    if (difficultyCount[q.difficulty] !== undefined) {
      difficultyCount[q.difficulty]++;
    }
  });

  console.log('📊 题型分布:');
  console.log(`   单选题: ${typeCount.single}`);
  console.log(`   判断题: ${typeCount.judge}\n`);

  console.log('📊 分类分布:');
  EXPECTED.categories.forEach(cat => {
    const count = categoryCount[cat] || 0;
    console.log(`   ${cat}: ${count}`);
  });
  console.log();

  console.log('📊 难度分布:');
  EXPECTED.difficulties.forEach(d => {
    console.log(`   ${d}: ${difficultyCount[d] || 0}`);
  });
  console.log();

  // 6. 检查数量是否达标
  if (typeCount.single !== EXPECTED.single) {
    warnings.push(`⚠️ 单选题应为 ${EXPECTED.single} 道，实际 ${typeCount.single} 道`);
  }
  if (typeCount.judge !== EXPECTED.judge) {
    warnings.push(`⚠️ 判断题应为 ${EXPECTED.judge} 道，实际 ${typeCount.judge} 道`);
  }

  // 7. 报告结果
  console.log('========================================');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 全部校验通过！');
    return true;
  } else {
    if (errors.length > 0) {
      console.log(`❌ 发现 ${errors.length} 个错误:`);
      errors.forEach(e => console.log(`   ${e}`));
    }
    if (warnings.length > 0) {
      console.log(`\n⚠️ 发现 ${warnings.length} 个警告:`);
      warnings.forEach(w => console.log(`   ${w}`));
    }
    return errors.length === 0;
  }
}

const valid = validate();
process.exit(valid ? 0 : 1);
