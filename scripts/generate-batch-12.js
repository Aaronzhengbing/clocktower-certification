/**
 * 题目生成脚本 - 第十二批：最后补充至 1000 题
 * 目标：约35题
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

// ========== 最后补充 ==========

newQuestions.push(genJudge('角色能力', 'hard',
  '洗衣妇每夜可以检查已死亡的玩家。',
  false,
  '洗衣妇每夜只能检查存活玩家。参见：角色能力-洗衣妇。',
  ['洗衣妇', '死亡', '检查']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '洗衣妇如果在第一夜被处决，当晚是否还能获得信息？',
  ['A. 能', 'B. 不能', 'C. 由说书人决定', 'D. 取决于是否被唤醒'],
  'B',
  '被处决的玩家当晚不拥有能力。参见：重要细节-死亡与能力。',
  ['洗衣妇', '处决', '死亡']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '洗衣妇每夜检查的玩家可以是之前已经检查过的。',
  true,
  '洗衣妇每夜可以选择任意玩家（包括之前检查过的）。参见：角色能力-洗衣妇。',
  ['洗衣妇', '检查', '重复']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '图书管理员在首夜可以检查的玩家数量是？',
  ['A. 1名', 'B. 2名', 'C. 3名', 'D. 任意数量'],
  'B',
  '图书管理员在首夜可检查2名玩家。参见：角色能力-图书管理员。',
  ['图书管理员', '首夜', '数量']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '图书管理员首夜得知的两名玩家中至少有一名不是镇民。',
  true,
  '图书管理员在首夜可得知的两名玩家中至少有1名不是镇民。参见：角色能力-图书管理员。',
  ['图书管理员', '首夜', '镇民']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '调查员每夜可以检查的玩家中包括自己吗？',
  ['A. 可以', 'B. 不可以', 'C. 只有在特定剧本中可以', 'D. 由说书人决定'],
  'B',
  '调查员每夜检查两名"其他"玩家，不能检查自己。参见：角色能力-调查员。',
  ['调查员', '检查', '自己']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '调查员得知"两名玩家中至少有一个是镇民"，这意味着不可能两名都是爪牙。',
  true,
  '调查员得知至少有一个是镇民，说明两名玩家中不可能都是爪牙。参见：角色能力-调查员。',
  ['调查员', '镇民', '爪牙']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '厨师检查的两名玩家必须是？',
  ['A. 任意两名玩家', 'B. 座位相邻的两名玩家', 'C. 同一阵营的两名玩家', 'D. 由说书人决定'],
  'B',
  '厨师必须选择两名座位相邻的玩家。参见：角色能力-厨师。',
  ['厨师', '相邻', '座位']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '厨师检测到"邪恶组合"意味着至少有一名是爪牙或恶魔。',
  true,
  '邪恶组合意味着至少有一名是爪牙或恶魔。参见：角色能力-厨师。',
  ['厨师', '邪恶组合', '爪牙']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '共情者每夜可以检查的玩家中包括自己吗？',
  ['A. 可以', 'B. 不可以', 'C. 只有在特定剧本中可以', 'D. 由说书人决定'],
  'B',
  '共情者每夜检查"其他"玩家，不能检查自己。参见：角色能力-共情者。',
  ['共情者', '检查', '自己']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '共情者检查的是玩家的阵营身份，不是具体角色。',
  true,
  '共情者得知的是玩家是否为恶魔（阵营判断），不是具体角色名。参见：角色能力-共情者。',
  ['共情者', '阵营', '身份']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '占卜师在首夜可以检查的玩家数量是？',
  ['A. 0名', 'B. 1名', 'C. 2名', 'D. 任意数量'],
  'B',
  '占卜师在首夜可检查1名玩家。参见：角色能力-占卜师。',
  ['占卜师', '首夜', '数量']
));

newQuestions.push(genJudge('角色能力', 'easy',
  '占卜师只有首夜一次能力，后续夜晚无法使用。',
  true,
  '占卜师只有首夜一次能力。参见：角色能力-占卜师。',
  ['占卜师', '首夜', '一次性']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '送葬者在一名玩家死亡后，可以在什么时候查看该玩家的角色？',
  ['A. 死亡后立即', 'B. 死亡当晚', 'C. 第二天白天', 'D. 第二天夜晚'],
  'B',
  '送葬者在玩家死亡后的当晚可以查看角色。参见：角色能力-送葬者。',
  ['送葬者', '死亡', '当晚']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '送葬者在旅行者死亡时不得到信息。',
  true,
  '送葬者在旅行者死亡时不得到信息。参见：角色能力-送葬者。',
  ['送葬者', '旅行者', '死亡']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '僧侣每夜可以保护几名玩家（不包括自己）？',
  ['A. 0名', 'B. 1名', 'C. 2名', 'D. 任意数量'],
  'B',
  '僧侣每夜只能保护1名其他玩家。参见：角色能力-僧侣。',
  ['僧侣', '保护', '数量']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '僧侣可以选择保护自己。',
  true,
  '僧侣可以选择保护自己或其他玩家。参见：角色能力-僧侣。',
  ['僧侣', '保护', '自己']
));

newQuestions.push(genSingle('角色能力', 'hard',
  '哲学家出局后转移角色，该转移是？',
  ['A. 公开的', 'B. 秘密的', 'C. 部分公开', 'D. 由说书人决定'],
  'B',
  '哲学家的角色转移是秘密进行的。参见：角色能力-哲学家。',
  ['哲学家', '转移', '秘密']
));

newQuestions.push(genJudge('能力互动', 'hard',
  '哲学家出局后只能选择存活玩家转移角色。',
  true,
  '哲学家只能选择存活玩家。参见：角色能力-哲学家。',
  ['哲学家', '转移', '存活']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '偶像每夜可以保护几名玩家？',
  ['A. 0名', 'B. 1名', 'C. 2名', 'D. 任意数量'],
  'B',
  '偶像每夜保护1名其他玩家。参见：角色能力-偶像。',
  ['偶像', '保护', '数量']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '偶像不能保护自己。',
  true,
  '偶像每夜保护的是"其他"玩家，不能保护自己。参见：角色能力-偶像。',
  ['偶像', '保护', '自己']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '驱魔人每夜可以驱魔几名玩家？',
  ['A. 0名', 'B. 1名', 'C. 2名', 'D. 任意数量'],
  'B',
  '驱魔人每夜驱魔1名玩家。参见：角色能力-驱魔人。',
  ['驱魔人', '驱魔', '数量']
));

newQuestions.push(genJudge('角色相克', 'hard',
  '驱魔人可以驱魔任何玩家，但只有驱魔恶魔时有特殊效果。',
  true,
  '驱魔人可以驱魔任何玩家。参见：角色能力-驱魔人。',
  ['驱魔人', '驱魔', '任何']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '士兵的保护是？',
  ['A. 需要主动选择', 'B. 被动生效', 'C. 只有在特定剧本中', 'D. 由说书人决定'],
  'B',
  '士兵的保护是被动生效的。参见：角色能力-士兵。',
  ['士兵', '保护', '被动']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '士兵被驱魔人驱魔后，士兵的保护能力当晚失效。',
  true,
  '被驱魔的玩家整夜失去能力。参见：角色能力-士兵、驱魔人。',
  ['士兵', '驱魔人', '失去能力']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '掘墓人在一名玩家死亡后，可以查看该玩家的什么信息？',
  ['A. 角色名', 'B. 阵营', 'C. 投票记录', 'D. 无任何信息'],
  'A',
  '掘墓人在玩家死亡后的当晚可以查看该玩家的角色名。参见：角色能力-掘墓人。',
  ['掘墓人', '死亡', '信息']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '掘墓人查看的信息是公开信息，可以选择分享给其他玩家。',
  true,
  '掘墓人查看的信息是非私密的，可以选择公开。参见：角色能力-掘墓人。',
  ['掘墓人', '信息', '公开']
));

newQuestions.push(genSingle('角色能力', 'normal',
  '园丁在首夜选择的两名玩家必须是？',
  ['A. 任意两名玩家', 'B. 座位相邻的两名玩家', 'C. 同一阵营的两名玩家', 'D. 由说书人决定'],
  'B',
  '园丁在首夜选择的两名玩家必须是相邻的。参见：角色能力-园丁。',
  ['园丁', '首夜', '相邻']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '园丁首夜得知的两名玩家中至少有一名是镇民。',
  true,
  '园丁得知至少有一名是镇民。参见：角色能力-园丁。',
  ['园丁', '首夜', '镇民']
));

newQuestions.push(genSingle('游戏机制', 'normal',
  '市长的额外一票在什么情况下可以使用？',
  ['A. 任何时候', 'B. 投票平局时', 'C. 恶魔在场时', 'D. 由说书人决定'],
  'B',
  '市长的额外一票只在投票平局时使用。参见：角色能力-市长。',
  ['市长', '投票', '平局']
));

newQuestions.push(genJudge('游戏机制', 'normal',
  '市长被处决后，其额外一票能力立即失效。',
  true,
  '市长死亡后失去所有能力。参见：角色能力-市长。',
  ['市长', '处决', '失效']
));

newQuestions.push(genSingle('角色能力', 'hard',
  '教母在首夜选择保护的玩家是否可以是自己？',
  ['A. 可以', 'B. 不可以', 'C. 只有在特定剧本中可以', 'D. 由说书人决定'],
  'B',
  '教母在首夜选择的是"其他"玩家，不能保护自己。参见：角色能力-教母。',
  ['教母', '首夜', '选择']
));

newQuestions.push(genJudge('角色能力', 'hard',
  '教母的保护只在第一个夜晚有效。',
  true,
  '教母的保护只持续第一个夜晚。参见：角色能力-教母。',
  ['教母', '首夜', '一次性']
));

newQuestions.push(genSingle('角色能力', 'hard',
  '吟游诗人在游戏开始时选择听众后，如果该听众当晚死亡，会发生什么？',
  ['A. 吟游诗人失去能力', 'B. 听众无法获得能力', 'C. 吟游诗人选择新的听众', 'D. 说书人决定'],
  'B',
  '如果听众在吟游诗人死亡前已经死亡，听众无法获得能力。参见：角色能力-吟游诗人。',
  ['吟游诗人', '听众', '死亡']
));

newQuestions.push(genJudge('能力互动', 'hard',
  '吟游诗人死亡后，听众获得吟游诗人的完整能力。',
  true,
  '听众获得吟游诗人的完整能力。参见：角色能力-吟游诗人。',
  ['吟游诗人', '听众', '能力']
));

// ========== 最后验证 ==========

console.log(`📊 本批新增题目: ${newQuestions.length} 道`);
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
console.log(`   单选: ${allTypeCount.single}, 判断: ${allTypeCount.judge}`);
