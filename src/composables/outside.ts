// useOutside.ts
import { onMounted, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';

/**
 *  点击外部判断消失函数
 *
 * @param isOpen
 * @param boxRef
 * @param iconRef
 */

export function useOutside(
  isOpen: Ref<boolean>,
  boxRef: Ref<HTMLElement | null>,
  iconRef: Ref<HTMLElement | null>,
) {
  // 点击外部关闭函数
  const handleClickOutside = (event: MouseEvent) => {
    if (
      isOpen.value &&
      boxRef.value &&
      !boxRef.value.contains(event.target as Node) &&
      iconRef.value &&
      !iconRef.value.contains(event.target as Node)
    ) {
      isOpen.value = false;
    }
  };

  // 添加和移除事件监听
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
}
