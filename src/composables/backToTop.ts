import { onMounted, onUnmounted, ref } from 'vue';

/**
 *
 * 回到顶部
 * @param threshold
 */

export function useBackToTop(threshold = 600) {
  // 是否显示
  const isVisible = ref(false);

  // 使用requestAnimationFrame和节流优化滚动事件处理
  let ticking = false;
  let lastScrollY = 0;

  function checkScroll() {
    // 获取当前滚动位置，兼容不同浏览器
    lastScrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // 如果没有正在进行的动画帧请求，则请求一个
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // 在动画帧中更新状态
        isVisible.value = lastScrollY > threshold;
        ticking = false;
      });

      ticking = true;
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScroll);
    // 初始检查，确保页面加载时状态正确
    checkScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll);
  });

  return {
    isVisible,
    scrollToTop,
  };
}
