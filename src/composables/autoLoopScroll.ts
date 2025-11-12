/**
 * @tag 元素自动循环滚动（含父级滚轮同步）
 * @param el  目标元素
 * @param axis 平面坐标轴方向 x/X 或 y/Y
 * @param direction 向 left/ right/ top/ bottom 移动
 * @param spaceTime 间隔时间 单位 毫秒（ms） 取值范围 0~无穷
 * @param scrollStep  每次滚动的像素数
 */
import { ref, onUnmounted } from 'vue';

// 定时器
const scrollInterval = ref<number | null>(null);
// 每次滚动的距离（像素）
const step = ref<number>(1);
const orientation = ref<string>('Y');
const count = ref<number>(0);
const diff = ref<number>(0);

export function useAutoLoopScroll(
  el: HTMLElement | null,
  axis: string = 'y',
  direction: string = 'top',
  spaceTime: number = 100,
  scrollStep: number = 1,
) {
  if (!el) return;

  // 获取父元素
  const parentEl = el?.parentElement;

  if (!parentEl) return;

  const elHeight: number = el.scrollHeight;
  const elWidth: number = el.scrollWidth;
  const parentElHeight: number = parentEl.offsetHeight;
  const parentElWidth: number = parentEl.offsetWidth;
  parentEl.style.pointerEvents = 'none';

  if (axis === 'y' || axis === 'Y') {
    orientation.value = 'Y';
    diff.value = elHeight / 2 - parentElHeight / 3;
    if (elHeight <= parentElHeight) return;
  } else if (axis === 'x' || axis === 'X') {
    orientation.value = 'X';
    diff.value = elWidth / 2 - parentElWidth / 3;
    if (elWidth <= parentElWidth) return;
  } else {
    return;
  }

  if (axis === 'y' || axis === 'Y') {
    step.value = direction === 'top' ? -scrollStep : scrollStep;
  } else {
    step.value = direction === 'left' ? -scrollStep : scrollStep;
  }

  const clearScrollInterval = () => {
    if (scrollInterval.value) {
      count.value = 0;
      diff.value = 0;
      orientation.value = 'Y';
      step.value = 1;
      el.style.transform = `translate${orientation.value}(0)`;
      clearInterval(scrollInterval.value);
    }
  };

  clearScrollInterval();

  scrollInterval.value = window.setInterval(() => {
    const accumulate: number = count.value * step.value;
    if (Math.abs(accumulate) > diff.value) {
      count.value = 0;
      el.style.transform = `translate${orientation.value}(0px)`;
    }
    el.style.transform = `translate${orientation.value}(${accumulate}px)`;
    count.value++;
  }, spaceTime);

  onUnmounted(() => {
    clearScrollInterval();
  });

  return { clearScrollInterval };
}
