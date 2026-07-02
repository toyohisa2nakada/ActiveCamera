// 処理時間を計測する。
// TimeChecker.num回数だけ実施し、その平均をコンソールに表示する。
//
// 使い方は、sample_functionを参照のこと。
const TimeChecker = {
    // true: 計測する、 false: 計測しない
    enable: true,
    // {index:0, data:Array(this.num).fill(0)}
    buffers: {},
    // この回数だけ計測したら平均時間を出力する。
    num: 100,
    check: function (id, st) {

        if(this.enable === false){
            return;
        }

        this.buffers[id] ??= { index: 0, data: Array(this.num).fill(0) };
        const buf = this.buffers[id];
        if(buf.index === this.num){
            console.log(`[tm:${id}] ${buf.data.reduce((a,e)=>a+e)/this.num}`);
            buf.index = 0;
        }
        if(st == 0){
            buf.data[buf.index] = Date.now();
        }else{
            buf.data[buf.index] = Date.now() - buf.data[buf.index];
            buf.index += 1;
        }

        /*
        if (this.buffer === undefined) {
            this.buffer = Array(this.num).fill(0);
            this.buffer_index = 0;
        }
        if (this.buffer_index === this.num) {
            console.log(this.buffer.reduce((a, e) => a + e) / this.num);
            this.buffer_index = 0;
        }
        if (st === 0) {
            this.buffer[this.buffer_index] = Date.now();
        } else {
            this.buffer[this.buffer_index] = Date.now() - this.buffer[this.buffer_index];
            this.buffer_index += 1;
        }
        */
    },
    sample_function: () => {
        for (let i = 0; i < 201; i++) {
            // 時間計測を開始する。
            TimeChecker.check("id", 0);
            [...Array(10000).keys()].forEach(e => e * e);
            // ここまでの経過時間をconsoleに出力する。
            TimeChecker.check("id", 1);
        }
    },
};
