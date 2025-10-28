/*
 canvas上に多角形を作成し、その内側と外側とを区別する。
 hammer.jsを使用するためあらかじめhammer.min.jsを読み込んでおく必要がある。
*/
export const CanvasRegion = {

    params: {
        module_name: "CanvasRegion",

        operate_region: true,
        clear_region: false,

        points_str: "",

        presets: "前回最後の状態",

        dropdowns: {
            presets: {
                "前回最後の状態": "[]",
                "女子02開志国際vs新潟中央": "[{\"pt\":[0.016,0.76],\"moving\":false},{\"pt\":[0.98,0.76],\"moving\":false},{\"pt\":[0.87,0.66],\"moving\":false},{\"pt\":[0.15,0.65],\"moving\":false}]",
                "女子02TC清心女子vs村松桜": "[{\"pt\":[0.090,0.68],\"moving\":false},{\"pt\":[0.90,0.68],\"moving\":false},{\"pt\":[0.87,0.63],\"moving\":false},{\"pt\":[0.13,0.63],\"moving\":false}]",
                "男子01佐渡vs北越": "[{\"pt\":[0.0125,0.82],\"moving\":false},{\"pt\":[0.98,0.82],\"moving\":false},{\"pt\":[0.92,0.61],\"moving\":false},{\"pt\":[0.10,0.61],\"moving\":false}]",
            },
        },
        onChanges: {
            points_str: function (e) {
                this.object.load(e);
                this.object.save();
            },
            presets: function (e) {
                this.object.load(e);
                this.object.save();
            },
            operate_region: function (e) {
                this.object.operate_region(e);
            },
            clear_region: function (e) {
                if (e) {
                    this.object.load("[]");
                    this.object.save();
                    this.clear_region = false;
                }
            },
        },
        names: {
            operate_region: "領域操作の有効化",
            clear_region: "領域のクリア",
            presets: "プリセット",
        },
        details: {
            module_name: "この機能のプログラム上の名前です。変更することはできません。",
            operate_region: "処理対象領域の編集を有効化します。有効になっていると分析画面において、領域を修正することができます。",
            clear_region: "処理対象領域をクリアします。",
            presets: "事前に定義済みの処理対象領域を読み込みます。事前の定義済み領域を変更したり追加するのはここではできなくて、プログラムの修正が必要です。",
        },
        disables: [
            "module_name",
        ],
        hiddens: [
            "module_name",
            "points_str",
        ],
    },
    init: async function (canvas, to_save = true) {
        this.data.canvas = canvas;
        this.data.canvas_wh = [canvas?.width, canvas?.height];
        this.data.canvas_size = this.data.canvas_wh[0] * this.data.canvas_wh[1];
        this.data.ctx = canvas?.getContext("2d");
        this.data.to_save = to_save;
        if (to_save) {
            this.params.points_str = this.load();
            this.params.dropdowns.presets["前回最後の状態"] = this.params.points_str;
            console.log("loaded region", this.params.dropdowns.presets["前回最後の状態"]);
            this.operate_region(this.params.operate_region);
        }
    },
    filter: async function (data) {
        if (this.data.imageData === undefined) {
            return this.data.n_pixels;
        }
        for (let i = 0; i < data.imageData.data.length; i += 4) {
            if (false === this.is_in_index(i)) {
                data.imageData.data[i + 0] = 0;
                data.imageData.data[i + 1] = 0;
                data.imageData.data[i + 2] = 0;
            }
        }
        return this.n_pixels;
    },
    output: async function (ctx) {
        if (this.data.ctx !== undefined) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(221,255,221,1)";
            this.data.points.forEach((e, i) => {
                ctx[["moveTo", "lineTo"][Math.min(i, 1)]](...e.pt);
            });
            ctx.closePath();
            ctx.stroke();

            const s = this.settings.operate_region_pt_size;
            this.data.points.forEach(e => {
                ctx.fillStyle = ["rgba(0,255,0,1)", "rgba(255,255,0,1)"][Number(e.moving)];
                ctx.beginPath();
                ctx.ellipse(...e.pt, s, s, 0, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    },
    points_str: function () {
        return JSON.stringify(this.data.points.map(e => ({ ...e, pt: e.pt.map((ei, i) => ei / this.data.canvas_wh[i]) })));
    },
    save: function () {
        if (this.data.to_save) {
            localStorage.setItem("points", this.points_str());
        }
    },
    load: function (points_str) {
        this.data.imageData = undefined;
        this.data.n_pixels = this.data.canvas_size;
        this.data.points = [];

        this.params.points_str = points_str ?? localStorage.getItem("points") ?? "[]";
        this.data.points = JSON.parse(this.params.points_str).map(e => ({ ...e, pt: e.pt.map((ei, i) => ei * this.data.canvas_wh[i]) }));
        this.update();
        return this.params.points_str;
    },

    // paramsは公開されユーザから変更可能となる。これに対してsettingsは#defineのようにプログラム内部で定義する。
    settings: {
        operate_region_pt_size: ("ontouchstart" in window) ? 12 : 6,
        min_points: 4, // 認識領域を形成するのに必要な最低頂点数。この頂点数になるまで、キャンバスをクリックする必要がある。    
    },
    data: {
        canvas: undefined,
        canvas_wh: undefined,
        ctx: undefined,
        imageData: undefined,
        n_pixels: 0,
        canvas_size: undefined,
        // add_point_index: -1,
        points: [],
        to_save: true,
        hammer: undefined,
        // おそらく画面表示時のタイミグでcanvasの位置を取得するタイミングが早すぎて、ずれるときがあるので、
        // その都度、計算するように修正
        // canvas_offset: undefined,
    },
    add_point: function (index, point) {
        this.data.points.splice(index, 0, { pt: point, moving: false });
        this.update();
        this.save();
    },
    on_points: function (p) {
        if (this.data.points.length === 0) {
            return undefined;
        }
        // 2点間の距離
        const dis = (p0, p1) => Math.sqrt(p0.map((pi, i) => Math.pow(p0[i] - p1[i], 2)).reduce((a, e) => a + e));
        // クリック点(p)からの各ポイントまでの距離を算出し、ポイントの半径以下の最小値を求める。
        const mi = this.data.points.map(e => ({ d: dis(e.pt, p), pt: e })).reduce((a, e) => a.d < e.d ? a : e);
        // ポイント半径を下回る距離にあるポイントを戻り値とする。
        return mi.d < this.settings.operate_region_pt_size ? mi.pt : undefined;
    },
    on_line: function (p) {
        if (this.data.imageData === undefined) {
            return -1;
        }
        return this.data.imageData.data[(p[1] * this.data.canvas_wh[0] + p[0]) * 4] - 100;
    },


    on_tap: function (ev) {
        console.log("on_tap", ev);
        const p = ev.offset;
        const p_index = this.data.points.length < this.settings.min_points ? this.data.points.length : this.on_line(p);
        if (p_index >= 0) {
            // const p = ev.offset;
            this.add_point(p_index + 1, p);
        }
    },
    on_panstart: function (ev) {
        // console.log("on_panstart", ev);
        const p = [ev.deltaX, ev.deltaY].map((e, i) => ev.offset[i] - e);

        const m = this.on_points(p);
        if (m !== undefined) {
            m.moving = true;
        }
    },
    on_panmove: function (ev) {
        // console.log("on_panmove", ev);
        const p = ev.offset;
        const mp = this.data.points.filter(e => e.moving);
        if (mp.length > 0) {
            mp[0].pt = p;
            this.update();
        }
    },
    // on_mouseup: function (e) {
    on_panend: function (ev) {
        // console.log("on_panend", ev);
        if (this.data.points.filter(e => e.moving).length > 0) {
            this.data.points.forEach(e => { e.moving = false; });
            this.save();
        }
    },
    operate_region: function (enable) {
        const event_names = ["tap", "panstart", "panmove", "panend"];

        event_names.forEach(e => {
            this.data.hammer?.off(e);
        });
        this.data.hammer = undefined;

        if (enable) {
            this.data.hammer = new Hammer(this.data.canvas);
            this.data.hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
            // this.data.canvas_offset = ["left", "top"].map(e => this.data.canvas.getBoundingClientRect()[e]);
            event_names.forEach(ev_name => {
                this.data.hammer.on(ev_name, ev => {
                    // console.log(ev.center.y,this.data.canvas_offset[1]);
                    ev.offset = [[ev.center.x, "left"], [ev.center.y, "top"]].map(e => e[0] - this.data.canvas.getBoundingClientRect()[e[1]]);
                    this[`on_${ev_name}`](ev);
                });
            });
        }
    },
    update: function () {
        this.params.points_str = this.points_str();
        // 変更したことをcontroller appにも送信するために、guiで変更したことをエミュレートするメソッドを実行する。
        this.params.gui_on_change?.("points_str", this.params.points_str);
        if (this.data.points.length < this.settings.min_points || this.data.ctx === undefined) {
            return;
        }

        // 現在の画像をバックアップし、すべてをクリアにする
        const prev_imageData = this.data.ctx.getImageData(0, 0, ...this.data.canvas_wh);
        this.data.ctx.fillStyle = "rgba(0,0,0,1)";
        this.data.ctx.fillRect(0, 0, ...this.data.canvas_wh);

        // ヒット対象領域を多角形図形として描画
        this.data.ctx.beginPath();
        this.data.ctx.fillStyle = "rgba(" + [0, 0, 255, 1] + ")";
        this.data.points.forEach((e, i) => {
            this.data.ctx[["moveTo", "lineTo"][Math.min(i, 1)]](...e.pt);
        });
        this.data.ctx.closePath();
        this.data.ctx.fill();

        // 領域の境界線上でマウスをクリックしたときに、その境界線を文壇する新しいポイントを作成できるようにするために、
        // 境界線を特別な色(r=ポイントの番号+100,g=0,b=0,a=1)で描画しておく。ピクセル値がこの値かどうかをもって、
        // クリックされた場所が境界線上であるかどうかを判定する。
        this.data.ctx.save();
        this.data.ctx.globalCompositeOperation = "lighter";
        this.data.ctx.lineWidth = this.settings.operate_region_pt_size;
        this.data.points.forEach((e, i) => {
            this.data.ctx.strokeStyle = "rgba(" + [i + 100, 0, 0, 1] + ")";
            this.data.ctx.beginPath();
            this.data.ctx.moveTo(...e.pt);
            this.data.ctx.lineTo(...this.data.points[(i + 1) % this.data.points.length].pt);
            this.data.ctx.stroke();
        });
        this.data.ctx.restore();

        // ヒット判定用の領域の画像データを取得
        this.data.imageData = this.data.ctx.getImageData(0, 0, ...this.data.canvas_wh);

        // 領域内のピクセル数を保存する。
        this.data.n_pixels = this.data.imageData.data.filter((e, i) => e === 255 && i % 4 === 2).length;

        // バックアップされたイメージの復元
        this.data.ctx.putImageData(prev_imageData, 0, 0);

        return;
    },
    filtered: function (f_in, f_out) {
        if (this.data.imageData === undefined) {
            return;
        }
        const f = [f_out, f_in];
        for (let i = 0; i < this.data.imageData.data.length; i += 4) {
            f[Number(this.is_in_index(i))](i);
        }
    },
    is_in_index: function (i) {
        return this.data.imageData === undefined ? true : this.data.imageData.data[i + 2] === 255;
    },
    is_in: function (p) {
        p = p.map(e => Math.trunc(e));
        return this.is_in_index((p[1] * this.data.canvas_wh[0] + p[0]) * 4);
    },
};
