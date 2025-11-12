import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 普通倒计时 hook
 *   @param milliseconds // 毫秒数
 */
export function useCountdown(milliseconds: number) {
  //设置计时器
  const countInterval = ref<number | null>(null);
  const allSeconds = ref<number>(Math.floor(milliseconds / 1000));
  const days = ref<number>(0);
  const hours = ref<number | string>('00');
  const minutes = ref<number | string>('00');
  const seconds = ref<number | string>('00');
  // 是否暂停
  const isPause = ref(false);
  /*
   * 开启定时器
   *  可以重新接收参数
   */
  function start(retime?: number) {
    if (retime!! > 0) allSeconds.value = retime!!;

    countInterval.value = setInterval(() => {
      if (allSeconds.value <= 0) {
        clear();
        return;
      }

      days.value = Math.floor(allSeconds.value / 60 / 60 / 24);
      hours.value = Math.floor((allSeconds.value / 60 / 60) % 24);
      hours.value = hours.value < 10 ? '0' + hours.value : hours.value;
      minutes.value = Math.floor((allSeconds.value / 60) % 60);
      minutes.value = minutes.value < 10 ? '0' + minutes.value : minutes.value;
      seconds.value = Math.floor(allSeconds.value % 60);
      seconds.value = seconds.value < 10 ? '0' + seconds.value : seconds.value;

      allSeconds.value--;
    }, 1000);
  }

  // 关闭定时器
  function close() {
    if (countInterval.value) {
      clearInterval(countInterval.value);
      countInterval.value = null;
    }
  }

  //关闭并清除数据
  function clear() {
    allSeconds.value = 0;
    days.value = 0;
    hours.value = '00';
    minutes.value = '00';
    seconds.value = '00';
    isPause.value = false;
    close();
  }

  /*
   *  暂停定时器
   */
  function pause() {
    if (!countInterval.value) return;
    isPause.value = true;
    const temp = allSeconds.value;
    close();
    allSeconds.value = temp;
  }

  /*
   *  继续定时器
   */
  function proceed() {
    if (!isPause.value) return;
    start(allSeconds.value);
    isPause.value = false;
  }

  /**
   *  重定时器
   *  可以接收参数
   * @param retime 毫秒数
   */
  function reset(retime?: number) {
    close();
    start(retime ? retime / 1000 : allSeconds.value);
  }

  onUnmounted(() => {
    close();
  });

  return {
    days,
    hours,
    minutes,
    seconds,
    allSeconds,
    start,
    close,
    proceed,
    reset,
    pause,
    clear,
  };
}

/**
 * 倒计时 具有日期  时间才用24小时制
 * startTime 和  endTime 格式为 YYYY-MM-DD （HH-MM-SS）或 时间戳
 *  @param startTime // 开始时间
 *  @param endTime  // 结束时间
 */
// 复合的倒计时功能
export function useDateCountDown(endTime: string, startTime?: string) {
  const year = ref<number>(0);
  const month = ref<number | string>('00');
  const date = ref<number | string>('00');
  const days = ref<number>(0);
  const hours = ref<number | string>('00');
  const minutes = ref<number | string>('00');
  const seconds = ref<number | string>('00');
  const countInterval = ref<number | null>(null);

  // 关闭定时器
  function close() {
    if (countInterval.value) {
      clearInterval(countInterval.value);
      countInterval.value = null;
    }
  }

  //关闭并清除数据
  function clear() {
    year.value = 0;
    month.value = '00';
    date.value = '00';
    days.value = 0;
    hours.value = '00';
    minutes.value = '00';
    seconds.value = '00';
    close();
  }

  function start() {
    const endMilliseconds = new Date(endTime).getTime();
    if (endMilliseconds <= Date.now()) return;

    const diffSeconds = ref<number>(0);

    // 将时间转化为时间戳
    const startMilliseconds = startTime
      ? new Date(startTime).getTime()
      : Date.now();

    // 计算正确开始计时时间
    // 若传入的开始时间 在 现在的时间之前，就使用现在的时间
    const rightStartTime =
      startMilliseconds > Date.now() ? startMilliseconds : Date.now();

    // 3. 计算时间差（取绝对值，避免顺序影响，转换为秒）
    diffSeconds.value =
      endMilliseconds - rightStartTime > 0
        ? (endMilliseconds - rightStartTime) / 1000
        : 0;

    // 何时开始
    // 当开始时间到的时候再开始倒计时
    const begin = setInterval(
      () => {
        if (startMilliseconds <= Date.now()) {
          // 开启定时器
          const dates = new Date();
          countInterval.value = setInterval(() => {
            // 获取 两天相差 天 小时 分钟 秒
            year.value = dates.getFullYear();
            month.value = dates.getMonth() + 1;
            month.value = month.value < 10 ? '0' + month.value : month.value;
            date.value = dates.getDate();
            date.value = date.value < 10 ? '0' + date.value : date.value;
            days.value = Math.floor(diffSeconds.value / 60 / 60 / 24);
            hours.value = Math.floor((diffSeconds.value / 60 / 60) % 24);
            hours.value = hours.value < 10 ? '0' + hours.value : hours.value;
            minutes.value = Math.floor((diffSeconds.value / 60) % 60);
            minutes.value =
              minutes.value < 10 ? '0' + minutes.value : minutes.value;
            seconds.value = Math.floor(diffSeconds.value % 60);
            seconds.value =
              seconds.value < 10 ? '0' + seconds.value : seconds.value;

            diffSeconds.value--;

            if (diffSeconds.value <= 0) {
              clear();
            }
          }, 1000);
          if (begin) clearInterval(begin);
        }
      },
      10 * 60 * 1000,
    );
  }

  onUnmounted(() => {
    clear();
  });

  return {
    year,
    month,
    date,
    days,
    hours,
    minutes,
    seconds,
    clear,
    start,
  };
}
