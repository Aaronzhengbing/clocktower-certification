/**
 * 题目生成脚本 - 第五批：旅行者 + 传奇角色 + 奇遇角色 + 实验性角色
 * 目标：约150题（60单选 + 90判断）
 */
const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, '..', 'data', 'questions.json');

let existingData = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
const existingIds = new Set(existingData.questions.map(q => q.id));
const nextId = Math.max(...existingIds) + 1;
const newQuestions = [];
let id = nextId;

function genSingle(category, difficulty, question, options, answer, explanation, tags) {
  return { id: id++, type: 'single', category, difficulty, question, options, answer, explanation, tags };
}

function genJudge(category, difficulty, question, answer, explanation, tags) {
  return {
    id: id++, type: 'judge', category, difficulty,
    question, options: ['是', '否'],
    answer: answer ? 'true' : 'false',
    explanation, tags
  };
}

// ========== 旅行者（16个旅行者）==========

newQuestions.push(genJudge('游戏机制', 'easy',
  '旅行者不是固定的在场角色，需要在剧本配置中明确选择。',
  true,
  '旅行者不是固定在场角色，说书人需要在剧本配置中明确选择哪些旅行者出现在本场游戏中。参见：旅行者规则。',
  ['旅行者', '配置']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '旅行者加入游戏后拥有什么身份？',
  ['A. 善良阵营', 'B. 邪恶阵营', 'C. 独立阵营', 'D. 无阵营'],
  'C',
  '旅行者是独立阵营角色，既不属于善良也不属于邪恶。参见：旅行者规则。',
  ['旅行者', '阵营']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '旅行者在游戏中的投票权与其他玩家相同。',
  true,
  '旅行者在游戏过程中有完整的投票权，与其他在场玩家相同。参见：旅行者规则。',
  ['旅行者', '投票']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '旅行者死亡后会发生什么？',
  ['A. 游戏继续，不影响其他玩家', 'B. 游戏立即结束', 'C. 其他玩家随之死亡', 'D. 说书人随机选择一人死亡'],
  'A',
  '旅行者死亡后仅退出游戏，不影响其他玩家的阵营和能力。参见：旅行者规则。',
  ['旅行者', '死亡']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '旅行者可以随时加入游戏，无需说书人同意。',
  false,
  '旅行者必须经过说书人同意才能加入游戏。参见：旅行者规则。',
  ['旅行者', '加入']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '旅行者可以随时离开游戏，无需说书人同意。',
  false,
  '旅行者离开游戏需要经过说书人同意。参见：旅行者规则。',
  ['旅行者', '离开']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '旅行者加入游戏后，是否会影响游戏的阵营平衡？',
  ['A. 会影响，增加一方人数', 'B. 不会，旅行者是独立阵营', 'C. 由说书人决定', 'D. 只有在特定剧本中影响'],
  'B',
  '旅行者是独立阵营，不影响善恶阵营的人数平衡。参见：旅行者规则。',
  ['旅行者', '阵营', '平衡']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '旅行者在游戏中的角色信息是公开的。',
  false,
  '旅行者虽然是独立阵营，但其具体身份和能力信息是私密的。参见：旅行者规则。',
  ['旅行者', '信息', '私密']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果旅行者被处决，会发生什么？',
  ['A. 旅行者死亡，游戏继续', 'B. 游戏立即结束', 'C. 旅行者复活', 'D. 说书人随机选择一人死亡'],
  'A',
  '旅行者被处决后死亡，游戏继续。旅行者死亡不影响胜负条件。参见：旅行者规则。',
  ['旅行者', '处决', '死亡']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '旅行者是否拥有夜间能力？',
  ['A. 是，所有旅行者都有夜间能力', 'B. 否，旅行者没有夜间能力', 'C. 部分旅行者有夜间能力', 'D. 由说书人决定'],
  'C',
  '部分旅行者拥有夜间能力（如流浪汉等），部分没有。参见：旅行者规则。',
  ['旅行者', '夜间能力']
));

// ========== 传奇角色（13个传奇角色）==========

newQuestions.push(genSingle('游戏机制', 'normal',
  '传奇角色属于哪个阵营？',
  ['A. 善良阵营', 'B. 邪恶阵营', 'C. 独立阵营', 'D. 取决于具体角色'],
  'D',
  '传奇角色的阵营取决于具体角色，部分属于善良，部分属于邪恶。参见：传奇角色规则。',
  ['传奇角色', '阵营']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '传奇角色在剧本配置中属于角色池的一部分。',
  true,
  '传奇角色是剧本角色池的一部分，说书人可以从角色池中选择传奇角色。参见：传奇角色规则。',
  ['传奇角色', '角色池']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果传奇角色被处决，其角色信息公开后，其他玩家会怎样？',
  ['A. 无变化', 'B. 可能触发特殊效果', 'C. 游戏立即结束', 'D. 说书人决定'],
  'B',
  '部分传奇角色被处决后可能触发特殊效果。参见：传奇角色规则。',
  ['传奇角色', '处决', '特殊效果']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '传奇角色的能力通常比普通镇民/外来者更强大或更复杂。',
  true,
  '传奇角色的能力设计通常比普通角色更强大或更复杂。参见：传奇角色规则。',
  ['传奇角色', '能力']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '传奇角色是否可以被旅行者替换？',
  ['A. 可以', 'B. 不可以', 'C. 只有在特定情况下可以', 'D. 由说书人决定'],
  'B',
  '传奇角色和旅行者是不同的角色类别，不能互相替换。参见：传奇角色规则、旅行者规则。',
  ['传奇角色', '旅行者', '替换']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '如果传奇角色通过哲学家转移给另一名玩家，该玩家成为新的传奇角色。',
  true,
  '哲学家转移后，该玩家成为新角色。如果原角色是传奇角色，新玩家也成为传奇角色。',
  ['传奇角色', '哲学家', '转移']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果一名玩家被替换为传奇角色（通过某些机制），原角色的能力会怎样？',
  ['A. 消失', 'B. 保留', 'C. 与新能力叠加', 'D. 说书人决定'],
  'A',
  '角色被替换后，原角色能力消失。参见：重要细节-角色唯一性。',
  ['传奇角色', '替换', '能力']
));

// ========== 奇遇角色（11个奇遇角色）==========

newQuestions.push(genSingle('游戏机制', 'normal',
  '奇遇角色在游戏中的地位如何？',
  ['A. 与镇民相同', 'B. 与外来者相同', 'C. 独立角色类别', 'D. 取决于具体角色'],
  'D',
  '奇遇角色的地位和阵营取决于具体角色。参见：奇遇角色规则。',
  ['奇遇角色', '地位']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '奇遇角色是剧本角色池的一部分。',
  true,
  '奇遇角色是剧本角色池的一部分，说书人可以选择奇遇角色。参见：奇遇角色规则。',
  ['奇遇角色', '角色池']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果奇遇角色被处决，会发生什么？',
  ['A. 无特殊效果', 'B. 可能触发特殊效果', 'C. 游戏立即结束', 'D. 由说书人决定'],
  'B',
  '部分奇遇角色被处决后可能触发特殊效果。参见：奇遇角色规则。',
  ['奇遇角色', '处决', '特殊效果']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '奇遇角色的能力可能涉及随机性或奇遇元素。',
  true,
  '奇遇角色的设计通常涉及随机性或奇遇元素。参见：奇遇角色规则。',
  ['奇遇角色', '能力', '随机']
));

// ========== 实验性角色（60个实验性角色，部分覆盖）==========

newQuestions.push(genJudge('游戏机制', 'normal',
  '实验性角色是官方正在测试的角色，可能在未来正式推出。',
  true,
  '实验性角色是官方正在测试的角色，可能在未来正式推出或修改。参见：实验性角色规则。',
  ['实验性角色', '测试']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '实验性角色在官方剧本中是否可以使用？',
  ['A. 可以，如同正式角色', 'B. 不可以，只能用于测试', 'C. 由说书人决定', 'D. 仅在特定剧本中可以使用'],
  'C',
  '实验性角色是否可以使用取决于说书人的决定和具体规则。参见：实验性角色规则。',
  ['实验性角色', '使用']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '实验性角色的能力可能会被修改或移除。',
  true,
  '实验性角色是正在测试的角色，能力可能会被修改或移除。参见：实验性角色规则。',
  ['实验性角色', '修改']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果实验性角色被正式推出，其能力会发生什么变化？',
  ['A. 保持不变', 'B. 可能被修改', 'C. 会被移除', 'D. 由说书人决定'],
  'B',
  '实验性角色正式推出时，能力可能被修改以适应正式规则。参见：实验性角色规则。',
  ['实验性角色', '推出', '修改']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '实验性角色不属于任何官方剧本的默认角色池。',
  true,
  '实验性角色不在官方剧本的默认角色池中，需要说书人特别添加。参见：实验性角色规则。',
  ['实验性角色', '角色池']
));

// ========== 旅行者/传奇/奇遇/实验性补充 ==========

newQuestions.push(genSingle('游戏机制', 'normal',
  '以下哪个角色类别不属于阵营（既不是善良也不是邪恶）？',
  ['A. 镇民', 'B. 外来者', 'C. 旅行者', 'D. 爪牙'],
  'C',
  '旅行者属于独立阵营，既不是善良也不是邪恶。参见：旅行者规则。',
  ['旅行者', '阵营']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '如果一场游戏中同时有传奇角色和奇遇角色，他们可以互相交换角色。',
  false,
  '角色交换需要通过特定能力（如哲学家）。传奇角色和奇遇角色本身没有交换能力。参见：重要细节-角色唯一性。',
  ['传奇角色', '奇遇角色', '交换']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果旅行者死亡后被"复活"（通过某些特殊机制），该玩家的身份会怎样？',
  ['A. 仍然是旅行者', 'B. 变成其他角色', 'C. 失去旅行者身份', 'D. 说书人决定'],
  'D',
  '旅行者复活的情况在官方规则中很少见，具体由说书人根据特殊机制决定。',
  ['旅行者', '复活', '特殊情况']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '传奇角色如果通过哲学家转移给另一名玩家，原传奇角色牌被废弃。',
  true,
  '哲学家转移后，该玩家成为新角色。原角色牌不再存在。',
  ['传奇角色', '哲学家', '转移']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果奇遇角色被驱魔人驱魔（作为恶魔），会发生什么？',
  ['A. 该角色整夜失去能力', 'B. 驱魔人无法驱魔非恶魔', 'C. 游戏立即结束', 'D. 由说书人决定'],
  'B',
  '驱魔人只能驱魔恶魔。如果奇遇角色不是恶魔，驱魔人无法驱魔。参见：角色能力-驱魔人。',
  ['驱魔人', '奇遇角色', '驱魔']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '实验性角色如果通过某种方式获得了恶魔能力，该玩家成为恶魔。',
  true,
  '如果实验性角色获得恶魔能力，该玩家成为恶魔（拥有恶魔能力）。参见：实验性角色规则。',
  ['实验性角色', '恶魔', '能力']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果一名旅行者被替换为镇民（通过某些机制），该玩家的身份变化是？',
  ['A. 变成镇民', 'B. 保持旅行者身份', 'C. 同时拥有两个身份', 'D. 说书人决定'],
  'A',
  '角色被替换后，原身份消失。旅行者变成镇民。参见：重要细节-角色唯一性。',
  ['旅行者', '镇民', '替换']
));

// ========== 角色类别补充 ==========

newQuestions.push(genJudge('游戏机制', 'normal',
  '镇民、外来者、爪牙、恶魔都属于有阵营的角色。',
  true,
  '镇民和外来者是善良阵营，爪牙和恶魔是邪恶阵营。参见：角色分类。',
  ['镇民', '外来者', '爪牙', '恶魔']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '以下哪个角色类别一定属于邪恶阵营？',
  ['A. 镇民', 'B. 外来者', 'C. 爪牙', 'D. 旅行者'],
  'C',
  '爪牙属于邪恶阵营。参见：角色分类。',
  ['爪牙', '阵营']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '以下哪个角色类别一定属于善良阵营？',
  ['A. 爪牙', 'B. 恶魔', 'C. 镇民', 'D. 旅行者'],
  'C',
  '镇民属于善良阵营。参见：角色分类。',
  ['镇民', '阵营']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '外来者属于善良阵营。',
  true,
  '外来者是善良阵营角色，但有特殊能力或限制。参见：角色分类。',
  ['外来者', '阵营']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '以下哪个角色类别不属于官方剧本的默认配置？',
  ['A. 镇民', 'B. 外来者', 'C. 爪牙', 'D. 实验性角色'],
  'D',
  '实验性角色不在官方剧本的默认配置中。参见：实验性角色规则。',
  ['实验性角色', '配置']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '如果一场游戏中没有配置任何爪牙，只有恶魔，邪恶阵营仍然可以获胜。',
  true,
  '邪恶阵营获胜条件：恶魔存活且所有善良玩家死亡。爪牙不是必需的。参见：重要细节-游戏结束。',
  ['邪恶', '胜利条件', '爪牙']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果一场游戏中配置了传奇角色但传奇角色全部死亡，游戏会怎样？',
  ['A. 继续，无特殊效果', 'B. 游戏立即结束', 'C. 传奇角色阵营自动失败', 'D. 由说书人决定'],
  'A',
  '传奇角色全部死亡后游戏继续，除非满足胜负条件。参见：传奇角色规则。',
  ['传奇角色', '死亡', '游戏继续']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '如果奇遇角色通过某种方式获得爪牙能力，该玩家成为爪牙。',
  true,
  '如果奇遇角色获得爪牙能力，该玩家成为爪牙（拥有爪牙能力）。',
  ['奇遇角色', '爪牙', '能力']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果实验性角色在测试中被发现与现有角色有严重冲突，官方会如何处理？',
  ['A. 立即移除该角色', 'B. 修改角色能力或暂时搁置', 'C. 强制推出', 'D. 由玩家投票决定'],
  'B',
  '实验性角色如果发现严重冲突，官方会修改角色能力或暂时搁置。参见：实验性角色规则。',
  ['实验性角色', '冲突', '修改']
));

newQuestions.push(genJudge('游戏机制', 'hard',
  '如果一场游戏中同时有镇民和外来者，外来者的数量通常少于镇民。',
  true,
  '在官方剧本配置中，外来者的数量通常少于镇民。参见：剧本配置。',
  ['外来者', '镇民', '配置']
));

newQuestions.push(genSingle('游戏机制', 'hard',
  '如果一场游戏中配置了多个旅行者，旅行者的最大数量限制是多少？',
  ['A. 无限制', 'B. 取决于剧本', 'C. 最多3名', 'D. 最多5名'],
  'B',
  '旅行者的数量取决于剧本配置和说书人的选择。参见：旅行者规则。',
  ['旅行者', '数量']
));

// ========== 角色类别补充结束 ==========

console.log(`📊 本批新增旅行者+传奇+奇遇+实验性题目: ${newQuestions.length} 道`);
console.log(`   单选: ${newQuestions.filter(q => q.type === 'single').length}`);
console.log(`   判断: ${newQuestions.filter(q => q.type === 'judge').length}`);

// 合并
const allQuestions = [...existingData.questions, ...newQuestions];
const allTypeCount = { single: 0, judge: 0 };
const allCategoryCount = {};
const allDifficultyCount = { easy: 0, normal: 0, hard: 0 };

allQuestions.forEach(q => {
  allTypeCount[q.type]++;
  allCategoryCount[q.category] = (allCategoryCount[q.category] || 0) + 1;
  allDifficultyCount[q.difficulty]++;
});

const updatedData = {
  ...existingData,
  lastUpdated: new Date().toISOString().split('T')[0],
  statistics: {
    total: allQuestions.length,
    single: allTypeCount.single,
    judge: allTypeCount.judge,
    byCategory: allCategoryCount,
    byDifficulty: allDifficultyCount
  },
  questions: allQuestions
};

fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
console.log(`✅ 题库已更新：共 ${allQuestions.length} 道题目`);
