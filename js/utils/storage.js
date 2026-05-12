/**
 * LocalStorage 统一封装
 */
const { STORAGE_KEYS } = require('../constants');

class StorageManager {
  // 获取数据
  get(key) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS[key]);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`storage.get ${key} failed:`, e);
      return null;
    }
  }

  // 设置数据
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (e) {
      console.error(`storage.set ${key} failed:`, e);
      alert('存储空间不足，请清理错题本后重试');
    }
  }

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } catch (e) {
      console.error(`storage.remove ${key} failed:`, e);
    }
  }

  // 清除全部
  clear() {
    localStorage.clear();
  }

  // 检查是否已存在某条错题
  hasMistake(questionId) {
    const mistakes = this.get('MISTAKES') || [];
    return mistakes.some(m => m.questionId === questionId);
  }

  // 获取所有分类
  getMistakeCategories() {
    const mistakes = this.get('MISTAKES') || [];
    return [...new Set(mistakes.map(m => m.category))];
  }
}

const storage = new StorageManager();
module.exports = { StorageManager, storage };
