// 安装 npm install vue-i18n
import { createI18n } from 'vue-i18n';

// 直接导入 JSON 文件
import cnMessages from '~/locales/cn.json';
import enMessages from '~/locales/en.json';

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'cn', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: {
    cn: cnMessages,
    en: enMessages,
  },
  globalInjection: true, // 全局注入 $t 函数
});

export default i18n;

// 导出切换语言的函数
export function setLocale(lang: 'cn' | 'en') {
  i18n.global.locale.value = lang;
}

// 获取当前语言
export function getLocale(): 'cn' | 'en' {
  return i18n.global.locale.value as 'cn' | 'en';
}

export function t(
  key: string,
  params?: Record<string, any>,
  lang?: 'cn' | 'en',
): string {
  const locale = lang || getLocale();
  // @ts-ignore
  return i18n.global.t(key, params, locale);
}
