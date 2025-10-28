/*
 filter処理を実装した画像データ
*/
export const CanvasData = {

    import_modules: async function () {
        const sets = [
            [ // video_canvasのズーム、移動のテスト
                "./TestCanvasZoomer.mjs",
                e => e.TestCanvasZoomer,
                "add_init",
                "add_viewpoint_element",
            ],

            // [ //screen painterのテスト
            //     "./screen_painter/CanvasScreenPainter.mjs",
            //     e => e.CanvasScreenPainter,
            //     "add_init",
            //     "add_recognizer",
            //     "add_viewpoint_element",
            // ],

            // [ //仮想パンチルトを制御する。
            //     "./CanvasViewpoint.mjs",
            //     e => e.CanvasViewpoint,
            //     "add_init",
            //     "add_outputter",
            //     "add_viewpoint_element",
            // ],

            [ // Canvas上の認識範囲を制限する。
                "./CanvasRegion.mjs",
                e => e.CanvasRegion,
                "add_init",
                "add_filter",
                "add_outputter",
            ],

            [ // Canvas上をセル分割し、差分等を認識する。
                "./CanvasCells.mjs",
                e => e.CanvasCells,
                "add_init",
                "add_recognizer",
                "add_outputter",
                "add_viewpoint_factors",
            ],

            [ // CanvasViewpointをテストするモジュール
                "./TestCanvasViewpoint.mjs",
                e => e.TestCanvasViewpoint,
                "add_init",
                "add_recognizer",
                "add_outputter",
                "add_viewpoint_factors",
            ],

            [ // 物理エンジンによるエフェクトのテスト
                "./CanvasPhysics.mjs",
                e => e.CanvasPhysics,
                "add_init",
                "add_viewpoint_element",
            ],

            // [ // Canvas全体を転移学習によって分類学習する。
            //     "./CanvasTransferLearning.mjs",
            //     e=>e.CanvasTransferLearning,
            //     "add_init",
            //     "add_recognizer",
            //     "add_outputter",
            // ],

            [ // Canvas上のオブジェクトを認識する。
                "./CanvasObjects.mjs",
                e => e.CanvasObjects,
                "add_init",
                "add_recognizer",
                "add_outputter",
            ],

            // [ // Canvasの一部を転移学習で分類学習しようとしたもの。2022.09.08時点で転移学習はできていない。
            //     "./CanvasTransferSsd.mjs",
            //     e=>e.CanvasTransferSsd,
            //     "add_init",
            //     "add_recognizer",
            //     "add_outputter",
            // ],

            // [ // Canvas上の顔のランドマークを検出する。 
            //     "./CanvasFaceLandmarks.mjs",
            //     e=>e.CanvasFaceLandmarks,
            //     "add_init",
            //     "add_recognizer",
            //     "add_outputter",
            // ],
        ]
        this.modules.objects = (await Promise.all(sets.map(e => import(`${e[0]}?${Date.now()}`)))).map((e, i) => sets[i][1](e));
        // const gui_onChanges = {};
        this.modules.objects.forEach((e, i) => {
            const setting = sets[i];
            setting.slice(2).forEach(ei => {
                this[ei](e);
            });
        });
    },
    get_copied_all_params: function () {
        return this.modules.objects
            .filter(e => e.params !== undefined)
            .map(m => Object.entries(m.params)
                .filter(([k, v]) => k !== "object")
                .reduce((a, e) => ({ ...a, [e[0]]: e[1] }), {}));
    },
    init_gui: function ({ gui = undefined, enable_onchange = true }) {
        this.modules.objects.filter(e => e.params !== undefined).forEach((m, i) => {
            m.params.object = m;
            gui.add_all({ params: m.params, folder: gui.addFolder(m.params.module_name), enable_onchange: enable_onchange });
        });
    },

    dt: undefined,
    data: {
        canvas: undefined,
        canvas_wh: undefined,
        // canvas_size: undefined, たぶん使っていない？ 2024.04.09
        imageData: undefined,
        imageData_bk: undefined,
        output_canvas: undefined,
        output_canvas_wh: undefined,
    },
    set_image: function (canvas, imageData) {
        this.data.canvas = canvas;
        this.data.canvas_wh = [canvas.width, canvas.height];
        this.data.output_canvas_wh = [canvas.width, canvas.height];
        this.data.imageData = imageData;
    },
    set_output_canvas: function (canvas) {
        this.data.output_canvas = canvas;
        this.data.output_ctx = this.data.output_canvas?.getContext("2d", { willReadFrequently: true });
    },

    // 与えられたctxの中にグラフを描画する関数
    inner_graph: function (value, max_value, limit_value, gid = 0, px = 20, py = 10, w = 120, h = 40, dx = 1) {
        if (this.data.output_ctx === undefined || value === undefined || max_value === undefined) {
            return;
        }
        this.inner_graph_f = this.inner_graph_f ?? [];
        if (this.inner_graph_f[gid] === undefined) {
            // canvasからcanvasにコピーするときに透過率aが0の完全透過の画素は、コピーされずに元のcanvasの状態が残る。
            // そのため某グラフで一度高い数値を出した長い棒は、そのあとで同じ場所に短い棒を描画することができない。
            // これを回避するための2つのcanvasを用意し、clearRectによってcanvasを初期化しながら棒グラフを横に移動していく。
            const cs = [...Array(2)].map(e => {
                const c = document.createElement("canvas");
                c.width = w;  // グラフ領域の幅
                c.height = h; // グラフ領域の高さ
                return { c: c, ctx: c.getContext("2d", { willReadFrequently: true }) };
            });
            const pt = [px, py];   // グラフを配置する位置：グラフの左上の座標を指定する。
            // const dx = 1;
            this.inner_graph_f[gid] = function (ctx0, value, max_value, limit_value) {
                cs[1].ctx.clearRect(0, 0, cs[1].c.width, cs[1].c.height);
                cs[1].ctx.drawImage(cs[0].c, dx, 0, cs[0].c.width - dx, cs[0].c.height, 0, 0, cs[1].c.width - dx, cs[1].c.height);

                cs[1].ctx.fillStyle = "rgba(255,255,0,0.5)";
                const h = Math.round(cs[1].c.height * value / max_value);
                cs[1].ctx.fillRect(cs[1].c.width - dx, cs[1].c.height - h, dx, h);

                if (limit_value !== undefined) {
                    cs[1].ctx.fillStyle = "rgba(128,0,128,0.8)";
                    const hl = Math.round(cs[1].c.height * limit_value / max_value);
                    cs[1].ctx.fillRect(cs[1].c.width - dx, cs[1].c.height - hl, dx, 1);
                }

                cs[0].ctx.clearRect(0, 0, cs[0].c.width, cs[0].c.height);
                cs[0].ctx.drawImage(cs[1].c, 0, 0);
                ctx0.drawImage(cs[0].c, ...pt);
            };
        }
        return this.inner_graph_f[gid](this.data.output_ctx, value, max_value, limit_value);
    },

    get_modules: function () {
        return this.modules.objects;
    },
    modules: {
        objects: [],
        inits: [],
        settings: [],
        filters: [],
        recognizers: [],
        outputters: [],
        viewpoint_factors: [],
        viewpoints: [],
    },
    add_init: function (o) {
        this.modules.inits.push(o);
    },
    add_settings: function (o) {
        this.modules.settings.push(...o.get_settings());
    },
    add_filter: function (o) {
        this.modules.filters.push(o);
    },
    add_recognizer: function (o) {
        this.modules.recognizers.push(o);
    },
    add_outputter: function (o) {
        this.modules.outputters.push(o);
    },
    add_viewpoint_factors: function (o) {
        this.modules.viewpoint_factors.push(o);
    },
    add_viewpoint_element: function (o) {
        this.modules.viewpoints.push(o);
    },

    /* lil_guiに変更することにより、ここは削除予定 2022.09.28
    insert_settings_to_html: function (parent) {
        const to_html = function (o) {
            const def_v = [
                (v) => "value='" + v + "'",
                (v) => (v === true ? "checked" : " "),
                (v) => "",
            ];
            const t2h = {
                "boolean": ["input type='checkbox'", "", def_v[1]],
                "number": ["input type='number'", "", def_v[0]],
                "string": ["input type='text'", "", def_v[0]],
                "button": ["input type='button'", "", def_v[0]],
                "array": ["select", "/select", def_v[2]],
            }[o.type];

            return "<div class='settings_item'><label for='" + o.id + "'>" + o.name + "</label>" +
                "<" + t2h[0] + " id='" + o.id + "' " + t2h[2](o.value) + ">" +
                (o.type === "array" ? o.options.map((e, i) => "<option value='" + e + "' " + (o.value == i ? "selected" : "") + ">" + e + "</option>").join("") : "") +
                (t2h[1].length === 0 ? "" : "<" + t2h[1] + ">") +
                "</div>";
        };
        parent.innerHTML = this.modules.settings.map(o => to_html(o)).join("");
        // console.log(parent.innerHTML);
        this.modules.settings.forEach(o => {
            document.getElementById(o.id).addEventListener(o.type === "button" ? "click" : "change", o.on.func.bind(o.on.self));
        });
    },
    /**/


    init: async function (canvas) {
        for (const o of this.modules.inits) {
            await o.init(canvas);
        }
        this.data.canvas_wh = [canvas?.width, canvas?.height];
        this.data.canvas_size = canvas?.width * canvas?.height;
    },
    filter: async function () {
        let effective_pixels = this.data.canvas_size;

        // filter前のデータを保存しておく。CanvasTransferLearing.mjsにおいて、画面上部の教師データを使用したいため。
        // CanvasTransferLearningの学習が終わったら、処理時間を上げるために、ここの部分は削除する。
        this.data.imageData_bk = new ImageData(this.data.imageData.data.slice(), this.data.imageData.width, this.data.imageData.height);
        for (const o of this.modules.filters) {
            effective_pixels = Math.min(effective_pixels, await o.filter(this.data));
        }
        return effective_pixels;
    },
    recognize: async function (dt) {
        this.dt = dt;
        for (const o of this.modules.recognizers) {
            await o.recognize(this.data, dt);
        }
        return this;
    },
    output: async function () {
        if (this.data.output_ctx === undefined) {
            return this.data;
        }
        this.data.output_ctx.inner_graph = this.data.output_ctx.inner_graph ?? ((...arg) => { this.inner_graph(...arg); });
        for (const o of this.modules.outputters) {
            await o.output(this.data.output_ctx);
        }
        return this.data;
    },
    get_viewpoint_factors: async function () {
        const ret = [];
        for (const o of this.modules.viewpoint_factors) {
            ret.push(...(await o.get_viewpoint_factors()));
        }
        return ret;
    },
    set_viewpoint_element: function (elem, ctx, wh) {
        // console.log(elem.userData.wrapped_canvas_info);
        this.modules.viewpoints.forEach(e => e.set_viewpoint_element(elem, ctx, wh));
        this.modules.viewpoints.forEach(e=>elem.userData.wrapped_canvas_info.add_ev_handlers(e.get_ev_handlers?.bind(e)))
    },
    get_viewpoint_element: function () {
        const ret = [];
        this.modules.viewpoints.forEach(e => ret.push(e.get_viewpoint_element()));
        return ret;
    },
    update_viewpoint: function (viewpoint_factors, dt, effective_pixels) {
        this.modules.viewpoints.forEach(e => e.update_viewpoint(viewpoint_factors, dt, effective_pixels));
    },
};
