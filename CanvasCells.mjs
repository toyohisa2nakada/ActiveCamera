/*
 Canvas上を格子（セル）に分けて、それぞれのセルで処理を実施する。
*/
export const CanvasCells = {

    params: {
        module_name: "CanvasCells",

        enable: true,
        // cell_wh: [2, 2],
        cell_w: 2,
        cell_h: 2,
        diff_lower_threshold: 20, // 単位時間(unit_msec)ごとの変化があったと判定される各画素の1画素あたりの差分(最小0 最大255)
        unit_msec: 100, // 距離の単位時間ms(例えば100とすると100msの間にどれだけ動いたかの数値とする。)

        scene_update_ratio: 0.1,  // unit_msecごとの背景を更新する割合
        diffed_scene_weight: 0.9, // 前フレームからの変化があるセルに対して、背景からの変化があるセルのviewpoint_factorに与える影響力
        // to_reset_scene: true,       // 次のrecognizeのときに0以外のpixel値でsceneの値をリセットする。一度実行するとfalseになる。
        enable_clustering: true,

        onChanges: {
            cell_w: function (e) {
                this.object.init(this.object.canvas);
            },
            cell_h: function (e) {
                this.object.init(this.object.canvas);
            },
        },
        names: {
            enable: "差分の有効化 (s)",
            // 人の動き検知できる:大→小:px
            cell_w: "セル横幅px",
            cell_h: "セル縦幅px",
            // /ut 白いユニフォーム検知できる:小→大:0-255, 数値はRGB1要素あたりの閾値
            diff_lower_threshold: "差分の閾値(255-0)",
            // /ut 背景に青が残らない→止まっている人が青い:小→大→小:0-1
            scene_update_ratio: "背景値の更新割合(1-0)",
            // 早い展開に付いていける→フリースローで止まる:大→小→大:0-x 移動しているものを1とする
            diffed_scene_weight: "背景値の重み(x-0)",
            // 基本は変えない。
            unit_msec: "設定値の単位時間(ms)",
            // 差分セルのクラスタリング、およびクラスターの簡易オプティカルフローを実施するか
            enable_clustering: "クラスタリング有効化",
        },
        details: {
            module_name: "この機能のプログラム上の名前です。変更することはできません。",
            enable: "差分の計測を有効化します。チェックボックスを外すと、カメラが固定されます。",
            cell_w: "差分計測のための1つの区画（セルと呼びます）の幅を指定します。セルが小さいと画面の小さな変化をとらえることができますが、処理は重くなります。",
            cell_h: "差分計測のための1つの区画（セルと呼びます）の高さを指定します。セルが小さいと画面の小さな変化をとらえることができますが、処理は重くなります。",
            diff_lower_threshold: "差分ありと判定する閾値を指定します。数値は0以上255以下で指定し、RGBの1要素あたりの差を表します。",
            unit_msec: "時間に依存する設定値の基準となる単位時間を指定します。この設定は、画像を解析するサンプリングレートに相当します。基本は、設定を変更しません。",
            scene_update_ratio: "各画素の変化が起きていないときの画素値を背景値と呼び、その背景値を計算するときの新しい値で背景値を更新する割合を0以上1以下で指定します。大きい数値の場合、背景値は新しい値ですぐに更新され、小さい数値の場合は、ゆっくりと更新されていくようになります。",
            diffed_scene_weight: "ビューポイントの位置を決定する要因を作成するときに、背景から変化があるセルの重みを指定します。重みは、前フレームからの差分があるセルの重みを1としたときの割合で指定します。",
            enable_clustering: "差分セルをクラスタリング、およびクラスターの簡易オプティカルフロー(移動の軌跡)の計算を有効化します。クラスターは青い四角、軌跡は緑の線で表示されます。",
        },
        disables: [
            "module_name",
        ],
        hiddens: [
            "module_name",
            // "diff_lower_threshold",
            // "unit_msec",
        ],
    },

    /* lil_guiにパラメータ設定を変更して、get_settings, set_settingsは廃止予定 2022.09.28 */
    get_settings: function () {
        return [
            {
                name: "セル差分の有効化 (s)",
                type: "boolean",
                id: "CanvasCells_enable",
                value: this.params.enable,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "セルサイズ(横幅)<span style='font-size:x-small'>(人の動き検知できる:大→小:pixel x pixel)</span>",
                type: "number",
                id: "CanvasCells_cell_w",
                value: this.params.cell_w,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "セルサイズ(縦幅)<span style='font-size:x-small'>(人の動き検知できる:大→小:pixel x pixel)</span>",
                type: "number",
                id: "CanvasCells_cell_h",
                value: this.params.cell_h,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "セル差分のRGB1要素あたりの閾値/ut<span style='font-size:x-small'>(白いユニフォームの差分が検知できる:小→大:0-255)</span>",
                type: "number",
                id: "CanvasCells_diff_lower_threshold",
                value: this.params.diff_lower_threshold,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "セル差分の背景値を更新する割合/ut<span style='font-size:x-small'>(背景に青が残らない→止まっている人が青い:小→大→小:0-1)</span>",
                type: "number",
                id: "CanvasCells_scene_update_ratio",
                value: this.params.scene_update_ratio,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "セル差分の移動していないものの影響力(移動しているものを1とする)<span style='font-size:x-small'>(早い展開に付いていける→フリースローで止まる:大→小→大:0-x)</span>",
                type: "number",
                id: "CanvasCells_diffed_scene_weight",
                value: this.params.diffed_scene_weight,
                on: { func: this.set_settings, self: this },
            },
        ];
    },
    set_settings: function (e) {
        const pname = e.target.id.split("CanvasCells_")[1];
        console.log(e.target.value);
        if (pname === "enable") {
            this.params[pname] = e.target.checked;
        } else {
            this.params[pname] = Number(e.target.value);
            if (pname.startsWith("cell_")) {
                this.init(this.canvas);
            }
        }
    },
    init: async function (canvas) {
        this.set(canvas);

        ["keydown"].forEach(e => {
            const ef = `on_${e}`;
            const _ef = `_${ef}`;
            this[_ef] ??= (ei) => { this[ef](ei); };
            const elem = (e.includes("key") ? document.body : canvas);
            elem.removeEventListener(e, this[_ef]);
            elem.addEventListener(e, this[_ef]);
        });

        // クラスタ表示関連の関数宣言
        Array.prototype.ltrb2pixelXYWH = function () {
            return [this[0][0], this[0][1], this[1][0] - this[0][0], this[1][1] - this[0][1]];
        };
        Array.prototype.ltrb2center = function () {
            return [(this[1][0] - this[0][0]) / 2 + this[0][0], (this[1][1] - this[0][1]) / 2 + this[0][1]];
        };
        Array.prototype.pair = function () {
            return this.reduce((a, e) => { a.a = a.a === undefined ? [] : [...a.a, [a.e, e]]; a.e = e; return a; }, []).a;
        };
        Array.prototype.pts_dis = function () {
            return Math.sqrt(this[0].reduce((a, e, i) => a + Math.pow(e - this[1][i], 2), 0));
        };
        Array.prototype.max = function () {
            return Math.max(...this);
        }
        Array.prototype.min = function () {
            return Math.min(...this);
        }
        Array.prototype.average = function () {
            return this.length === 0 ? 0 : this.reduce((a, e) => a + e) / this.length;
        }
    },
    // 差分元の画像を固定する。
    // imageDataまたはrgbで固定される元画像を指定する。両方の指定がある場合、imageDataが優先される。両方の指定がない場合は固定は解除される。
    pin_diff_source: function ({ imageData, rgb }) {
        if (imageData !== undefined) {
            this.pinned_diff_source = false;
            this.update(imageData);
            this.cells.forEach(cell => {
                cell.prev_ave = cell.ave;
                cell.ave = [0, 0, 0];
            });
            this.pinned_diff_source = true;
        } else if (rgb !== undefined) {
            this.cells.forEach(cell => {
                cell.prev_ave = rgb;
                cell.ave = [0, 0, 0];
            });
            this.pinned_diff_source = true;
        } else {
            this.pinned_diff_source = false;
        }
    },
    recognize: async function (data, dt) {
        if (this.params.enable) {
            this.dt = dt;
            this.update(data.imageData);
            this.diff(dt);
        }
    },
    output: async function (ctx) {

        // 自動フィルタリングのテスト：あまり変化のないところは次第に暗くなっていく。
        // const max_total_diffed_count = Math.max(...this.cells.map(e => e.total_diffed_count));
        // this.cells.forEach(e => {
        //     ctx.fillStyle = `rgba(0,0,0,${(max_total_diffed_count - e.total_diffed_count) / max_total_diffed_count})`;
        //     ctx.fillRect(e.x, e.y, e.w, e.h);
        // });

        // 背景を描画する
        // this.cells.forEach((e, i) => {
        //     ctx.fillStyle = `rgba(${Math.round(e.scene[0])},${Math.round(e.scene[1])},${Math.round(e.scene[2])},1)`;
        //     ctx.fillRect(e.x, e.y, e.w, e.h);
        // });

        // 変化のある部分を赤く表示
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        this.diff().forEach((e, i) => {
            ctx.fillRect(e.x, e.y, e.w, e.h);
        });

        // 移動していない移動体を描画する
        ctx.fillStyle = "rgba(0,0,255,0.5)";
        this.scene_diff().forEach((e) => {
            // ctx.fillStyle = `rgba(${Math.round(e.ave[0])},${Math.round(e.ave[1])},${Math.round(e.ave[2])},1)`;
            ctx.fillRect(e.x, e.y, e.w, e.h);
        });


        // クラスタを枠で表示
        if (this.clusters !== undefined) {
            ctx.strokeStyle = "rgba(0,0,255,0.5)";
            // const ltrb2pixelXYWH = (ltrb) => {
            //     return [ltrb[0][0], ltrb[0][1], ltrb[1][0] - ltrb[0][0], ltrb[1][1] - ltrb[0][1]].map((e, i) => e * this.canvas_wh[i % 2]);
            // };
            this.clusters?.forEach(e => {
                ctx.strokeRect(...e.ltrb.ltrb2pixelXYWH().map((e, i) => e * CanvasCells.canvas_wh[i % 2]));
            });
        }

        // クラスタの簡易オプティカルフロー
        (this.clusters_hist ?? []).forEach(cls => {
            [...cls.prev_clss, cls].map(e => e.ltrb.ltrb2center().map((e, i) => e * this.canvas_wh[i])).pair().forEach(pts => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,${255 * pts.pts_dis() / 10},0,1)`;
                ctx.moveTo(...pts[0]);
                ctx.lineTo(...pts[1]);
                ctx.stroke();
            });
        });

        // [
        //     [this.clusters_distances.average(), 0.01],
        //     [this.clusters_distances.max(), 0.01],
        //     [this.clusters_distances.length, 5],
        //     [this.diffed_cells?.length, 200],
        //     [this.diff().length / (this.diff().length + this.scene_diff().length), 1],
        // ].forEach((e, i) => {
        //     ctx.inner_graph(e[0], e[1] * 1.2, e[1], i, 5 + i * 80, 10, 270, 40, Math.round(this.dt / this.params.unit_msec));
        // });
    },
    get_viewpoint_factors: async function () {
        const diffed = this.diff();
        const scene_diffed = this.scene_diff();
        // let m = performance?.memory.usedJSHeapSize / performance?.memory.totalJSHeapSize;
        if ((diffed.length === 0 || diffed.length > 100000) && (scene_diffed.length === 0 || scene_diffed.length > 100000)) {
            // diffed.lengthが大きすぎるときは以下のエラーがこの関数のreturnの部分で発生する。
            // Uncaught (in promise) RangeError: Maximum call stack size exceeded
            // これを避けるために、大きすぎる要因数の場合は、処理をしない。
            return [];
        }
        // CanvasPhysicsを入れると上記の閾値でもメモリエラーが発生することがある。このときのデバッグのために
        // 以下のメモリ状態を出力するコードを残しておく。 2022.10.23
        // console.log("check_performance.memory", diffed.length, performance.memory);
        // const factors = this.cells.filter(e => e.diffed || e.scene_diffed).map(e => [e.x + e.w / 2, e.y + e.h / 2, e.size * (e.scene_diffed ? this.params.diffed_scene_weight : 1)]);
        const c2pw_diff = e => [e.x + e.w / 2, e.y + e.h / 2, e.size ];
        const c2pw_scen = e => [e.x + e.w / 2, e.y + e.h / 2, e.size * this.params.diffed_scene_weight];
        const factors = [
            ...diffed.map(c2pw_diff),
            ...scene_diffed.map(c2pw_scen),
        ];
        return factors;
    },

    on_keydown: function (e) {
        if (e.key === "s") {
            this.params.enable = !this.params.enable;
            // const id = this.get_settings().filter(e => e.value === this.params.enable)[0].id;
            // document.getElementById(id).checked = this.params.enable;
        }
    },

    canvas: undefined,
    canvas_wh: undefined,
    ctx: undefined,

    // canvas_indices, ave, prev_ave, diffed:true/false, x,y,w,h, size, undiffed_count
    cells: undefined,
    // cells filtered by diffed=true
    diffed_cells: undefined,
    // cells filtered by diffed=false && 移動体
    scene_diffed_cells: undefined,
    // array of array of cells
    clusters: undefined,
    clusters_bk: undefined,
    clusters_hist: undefined,
    clusters_distances: undefined,
    // diffed_clusters: undefined,
    dt: undefined,

    pinned_diff_source: false,

    load_script: function (fname) {
        return new Promise((resolve, reject) => {
            const sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.src = fname;
            sc.onload = () => resolve();
            sc.onerror = (e) => reject(e);
            const s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(sc, s);
        });
    },

    set: function (canvas) {
        if (canvas === undefined) {
            return;
        }
        this.canvas = canvas;
        this.canvas_wh = [canvas.width, canvas.height];
        this.ctx = canvas.getContext("2d");
        this.cells = [];
        this.diffed_cells = undefined;
        this.scene_diffed_cells = undefined;

        // 1つのセルのサイズ(ピクセル単位)
        const wh = [this.params.cell_w, this.params.cell_h];
        // 最初のセルの左上の位置（ピクセル単位）、canvasサイズをセルサイズで割り切れなかった場合、セルが等間隔に配置されるように全体をずらす。
        const p0 = this.canvas_wh.map((e, i) => (Math.trunc((e % wh[i]) / 2) - wh[i]) % wh[i]);
        // canvasが縦横何個のセルで構成されているか（セル単位）
        this.cells_wh = p0.map((e, i) => Math.ceil((this.canvas_wh[i] - e) / wh[i]));
        // console.log("wh",wh,"p0",p0,"this.cells_wh",this.cells_wh);

        // 処理速度向上のためのテスト
        // let scr = ""
        for (let [y, yi] = [p0[1], 0]; y < this.canvas_wh[1]; [y, yi] = [y + wh[1], yi + 1]) {
            for (let [x, xi] = [p0[0], 0]; x < this.canvas_wh[0]; [x, xi] = [x + wh[0], xi + 1]) {
                let c = {
                    index: this.cells.length,
                    cell_index: [xi, yi],
                    x: Math.max(0, x),
                    y: Math.max(0, y),
                    diffed: true,

                    // セル内の平均値
                    ave: [0, 0, 0],
                    // 前フレームのセル内の平均値
                    prev_ave: [0, 0, 0],

                    // 背景値
                    scene: [0, 0, 0],
                    scene_diffed: false,
                    // scene: {
                    //     cur: [0, 0, 0], // 現在のセルの代表値（算術平均）
                    //     prev: [0, 0, 0], // 1つ前のフレームのセルの代表値
                    //     unit: [0, 0, 0], // 変化がなかったときのセルの代表値の平均
                    // },

                    // undiffed_count: 0,
                    // total_diffed_count: 0,  // これまでに差分があったアプリ開始時からの回数（自動フィルタリングのテスト）
                };
                c = {
                    ...c,
                    w: Math.min(x + wh[0], this.canvas_wh[0]) - c.x,
                    h: Math.min(y + wh[1], this.canvas_wh[1]) - c.y,

                };
                c = {
                    ...c,
                    size: c.w * c.h,
                    // ltrbは画面サイズを1,1としたときの割合とする。それ以外のx,y,w,hなどはピクセル値
                    ltrb: [[x, y], [x + c.w, y + c.h]].map(e => e.map((ei, i) => ei / this.canvas_wh[i])),
                    // 処理の高速化のために試したコード
                    // canvas_indices: [...Array(c.w * c.h).keys()].map(i => {
                    //     const x = i % c.w + c.x;
                    //     const y = Math.trunc(i / c.w) + c.y;
                    //     const idx = (y * this.canvas_wh[0] + x) * 4;
                    //     return idx;
                    // }),
                };
                this.cells.push(c);


                // セル内のピクセル値の平均を、for文等の繰り返しを使わずにベタで処理するプログラムをここで作成し、関数化する。
                // 処理速度の向上を試みたが、平均を求める処理がで約150msだったのが約200msと増えた....
                // 試した時のパラメータ: chrome, 1920x1080画素(RGBA), 1つのセルのサイズ10x10,
                // firefoxでも同様に遅い。aveを 1+2+... で一気に計算する方法でも、 += で足し合わせる方法でも遅い。+=はメモリオーバーでchromeでは動かない。
                // const ci = this.cells.length-1;
                // const scri = "c[" + ci + "].prev_ave=c[" + ci + "].ave||[0,0,0];" +
                //     "c[" + ci + "].ave=[" +
                //     c.canvas_indices.reduce((a, e) => a + "+d[" + (e + 0) + "]", "0") + "," +
                //     c.canvas_indices.reduce((a, e) => a + "+d[" + (e + 1) + "]", "0") + "," +
                //     c.canvas_indices.reduce((a, e) => a + "+d[" + (e + 2) + "]", "0") +
                //     "];" +
                //     "c[" + ci + "].ave[0]=0.9*c[" + ci + "].prev_ave[0]+0.1*c[" + ci + "].ave[0]/c[" + ci + "].size;" +
                //     "c[" + ci + "].ave[1]=0.9*c[" + ci + "].prev_ave[1]+0.1*c[" + ci + "].ave[1]/c[" + ci + "].size;" +
                //     "c[" + ci + "].ave[2]=0.9*c[" + ci + "].prev_ave[2]+0.1*c[" + ci + "].ave[2]/c[" + ci + "].size;";
                // scr += scri;
            }
        }
        // 処理速度向上のためのテスト
        // this.ftest = new Function("d","c",scr);
        // document.querySelector("#debug_console").textContent = scr;
        // console.log(scr);
        return;
    },
    update: function (imageData) {
        if (typeof TimeChecker !== "undefined") {
            TimeChecker?.check("CanvasCells", 0);
        }
        // console.log(imageData)

        // if (this.params.to_reset_scene) {
        //     const sum = [0, 0, 0];
        //     let cnt = 0;
        //     for (let i = 0; i < imageData.data.length; i += 4) {
        //         if (imageData.data[i + 0] != 0 || imageData.data[i + 1] != 0 || imageData.data[i + 2] != 0) {
        //             sum[0] += imageData.data[i + 0];
        //             sum[1] += imageData.data[i + 1];
        //             sum[2] += imageData.data[i + 2];
        //             cnt += 1;
        //         }
        //     }
        //     const ave = sum.map(e=>e/cnt);
        //     this.cells.forEach(e=>{
        //         e.scene = ave;
        //     });
        //     this.params.to_reset_scene = false;
        // }

        // 高速化のためにベタで書く
        this.cells.forEach((cell, i) => {

            if (this.pinned_diff_source === false) {
                cell.prev_ave = cell.ave;
            }
            cell.ave = [0, 0, 0];

            for (let y = cell.y; y < cell.y + cell.h; y++) {
                for (let x = cell.x; x < cell.x + cell.w; x++) {
                    const i = (y * this.canvas_wh[0] + x) * 4;
                    cell.ave[0] += imageData.data[i + 0];
                    cell.ave[1] += imageData.data[i + 1];
                    cell.ave[2] += imageData.data[i + 2];
                }
            }

            cell.ave[0] /= cell.size;
            cell.ave[1] /= cell.size;
            cell.ave[2] /= cell.size;
        });
        this.diffed_cells = undefined;
        this.scene_diffed_cells = undefined;

        if (typeof TimeChecker !== "undefined") {
            TimeChecker?.check("CanvasCells", 1);
        }
    },
    scene_diff: function () {
        return this.scene_diffed_cells;
    },
    diff: function (dt) {
        if (this.cells === undefined || this.cells[0].prev_ave === undefined) {
            return [];
        }
        if (this.diffed_cells !== undefined) {
            return this.diffed_cells;
        }
        // 以下は処理速度が遅いので入れ替え。
        // const diff = (p0, p1) => {
        //     return [...Array(3).keys()].reduce((a, e, i) => a + Math.abs(p0[i] - p1[i])) / 3;
        // };
        // this.diffed_cells = this.cells.filter(e => diff(e.prev_ave, e.ave) > params.lower_threshold);

        // unit_msecよりも早い時間でフレームが更新される場合は、サンプリングレートが高いため、画素の変化量が小さく刻まれて
        // 1つ1つの判定は「変化量なし」となってしまうため dt で補正する。但し、unit_msecよりも遅い時間でフレームが更新される場合、
        // その分だけ画面の変化量が増え続けるわけではないので、この補正の最大値は1.0としている。
        // また逆に高いフレームレートだとthresholdが小さくなるわけであるが、小さすぎると画面のチラツキに反応して差分ありとしてしまう。
        // よってdtは30fps相当の33を最小値として計算する。
        const lower_threshold3 = this.params.diff_lower_threshold * 3 * Math.min(1.0, Math.max(33, dt) / this.params.unit_msec);
        const scene_update_ratio = this.params.scene_update_ratio * dt / this.params.unit_msec;
        this.cells.forEach(e => {
            e.diffed = (
                Math.abs(e.prev_ave[0] - e.ave[0]) +
                Math.abs(e.prev_ave[1] - e.ave[1]) +
                Math.abs(e.prev_ave[2] - e.ave[2])
            ) > lower_threshold3;
            if (e.diffed === false) {
                e.scene = e.scene.map((ei, i) => ei * (1 - scene_update_ratio) + e.ave[i] * scene_update_ratio);
            }
            // 前フレームとの差分なし、かつ、背景との差分あり、つまり動きのない移動体の場合
            e.scene_diffed = e.diffed === false && (
                Math.abs(e.scene[0] - e.ave[0]) +
                Math.abs(e.scene[1] - e.ave[1]) +
                Math.abs(e.scene[2] - e.ave[2])
            ) > lower_threshold3;
        });
        this.diffed_cells = this.cells.filter(e => e.diffed);
        this.scene_diffed_cells = this.cells.filter(e => e.scene_diffed);

        // 密度によるクラスタリング
        if (this.params.enable_clustering) {
            this.cluster(this.diffed_cells, this.cells, this.cells_wh);
            this.cluster_hist(this.clusters, this.clusters_bk, 0.05, dt, this.params.unit_msec);
        }
        return this.diffed_cells;
    },
    // 現在と1つ前のフレームのクラスタ情報から、クラスタの移動履歴を推定する。
    cluster_hist: function (clusters, clusters_bk, sim_limit, dt, unit_msec) {
        // 簡易オプティカルフロー
        // 2つの四角形の時間変化差分 ltrb: [[左上x,左上y],[右下x,右下y]]
        const diff = (ltrb0, ltrb1) => {
            // ltrbから中心位置を取得する。
            const ltrb2c = (ltrb) => {
                return [ltrb[0][0] + (ltrb[1][0] - ltrb[0][0]) / 2, ltrb[0][1] + (ltrb[1][1] - ltrb[0][1]) / 2];
            };
            // ltrbで表された四角形の幅を取得する。
            const width = (ltrb) => {
                return ltrb[1][0] - ltrb[0][0];
            };
            // ltrbで表された四角形の高さを取得する。
            const height = (ltrb) => {
                return ltrb[1][1] - ltrb[0][1];
            };
            // 2つの点間の距離
            const dis = (p0, p1) => {
                return Math.sqrt(p0.reduce((a, e, i) => a + Math.pow(e - p1[i], 2), 0));
            }
            // 2022.09.02段階で採用アルゴリズム, 中心間距離 + 幅の差分 + 高さの差分
            return dis(ltrb2c(ltrb0), ltrb2c(ltrb1)) + Math.abs(width(ltrb1) - width(ltrb0)) + Math.abs(height(ltrb1) - height(ltrb1));
        };
        this.clusters_hist = [];
        this.clusters_distances = [];
        clusters.forEach(cls => {
            const min_cls_bk = clusters_bk?.reduce((min, cls_bk) => {
                const s = diff(cls.ltrb, cls_bk.ltrb);
                return (min.cls === undefined || min.similarity > s) ?
                    { cls: cls_bk, similarity: s } : min;
            }, { cls: undefined, similarity: -1 });
            // console.log("dt", dt);
            if (min_cls_bk.cls !== undefined && min_cls_bk.similarity < (sim_limit * dt / unit_msec)) {
                cls.prev_clss = [...(min_cls_bk.cls.prev_clss ?? []), min_cls_bk.cls];
                this.clusters_distances.push([min_cls_bk.cls, cls].map(e => e.ltrb.ltrb2center()).pts_dis() * dt / unit_msec);
                // console.log((this.clusters_distances.slice(-1)[0]+"0000000000").slice(0,10),dt,unit_msec)
                cls.similarity = min_cls_bk.similarity;
                this.clusters_hist.push(cls);
            }
        });
        return [this.clusters_hist, this.clusters_distances];
    },
    // 密度によるクラスタリング
    // https://en.wikipedia.org/wiki/DBSCAN
    cluster: function (diffed_cells, cells, cells_wh) {
        if (diffed_cells === undefined) {
            return this.clusters;
        }
        this.clusters_bk = this.clusters ?? [];
        this.clusters = [];

        // 調査対象のポイントから同一クラスタと見なされる上下左右の距離、クラスタは円ではなく正方形とする。
        const eps = 2;
        // 最小ポイント数、ここでの処理は縦横の幅がeps*2+1の正方形をクラスタの最小形として、そこに対象がどれだけ詰まっているかの割合とする。
        const minPts = Math.trunc(0.3 * (eps * 2 + 1) ** 2);

        cells.forEach(e => e.cluster_label = "undefined");

        const range_query = (db, db_wh, q, eps) => {
            const n = [];

            const w = eps * 2 + 1;
            const f = (x, y) => x >= 0 && x < db_wh[0] && y >= 0 && y < db_wh[1];
            const a = (x0, y0) => Array.from(Array(w ** 2)).map((v, i) => [i % w - eps + x0, Math.trunc(i / w) - eps + y0]).filter(e => f(...e));
            // console.log("---------------------------------------");
            // console.log(q[0], q[1]);
            // console.log("++++++");
            a(q[0], q[1]).forEach(e => {
                const i = e[1] * db_wh[0] + e[0];
                if ((q[0] !== e[0] || q[1] !== e[1]) && db[i].diffed) {
                    n.push(i)
                }
            })
            return n;
        };
        diffed_cells.forEach(p => {
            if (p.cluster_label !== "undefined") {
                return;
            }
            const n = range_query(cells, cells_wh, p.cell_index, eps);
            if (n.length < minPts) {
                p.cluster_label = "noise";
                return;
            }
            const cluster_label = this.clusters.length.toString();
            this.clusters.push(cluster_label);
            p.cluster_label = cluster_label;
            for (let i = 0; i < n.length; i += 1) {
                const c = cells[n[i]];
                if (c.cluster_label === "noise") {
                    c.cluster_label = cluster_label;
                } else if (c.cluster_label === "undefined") {
                    c.cluster_label = cluster_label;
                    const n2 = range_query(cells, cells_wh, c.cell_index, eps);
                    if (n2.length >= minPts) {
                        n.push(...n2);
                    }
                }
            }
        });
        this.clusters = this.clusters.map(label => {
            const cls = cells.filter(e => e.cluster_label === label);
            // clusterのデータ形式は、n:セルの個数, ltrb:クラスターの左上右下の画面全体を1.0としたときの位置割合
            const ret = { n: cls.length, ltrb: [[1.0, 1.0], [0.0, 0.0]] };
            ret.ltrb = cls.reduce((a, e) => {
                return e.ltrb.map((ei, i) => {
                    const f = [Math.min, Math.max][i];
                    return [f(ei[0], a[i][0]), f(ei[1], a[i][1])];
                });
            }, ret.ltrb);
            return ret;
        });
        return [this.clusters, this.clusters_bk];
    },
    forEach: function (f) {
        if (this.cells !== undefined) {
            this.cells.forEach(f);
        }
    },
    cell_length: function () {
        return this.cells.length;
    },
    canvas_wh: function () {
        return this.canvas_wh ?? [0, 0];
    },
};
