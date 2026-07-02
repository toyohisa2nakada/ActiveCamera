export function createDebounceTimer(callback, delay) {
    let timerId = null; // 現在のタイマーID

    return {
        reset: function () {
            clearTimeout(timerId); // 前のタイマー解除
            timerId = setTimeout(callback, delay); // 新しく開始
        }
    };
}
