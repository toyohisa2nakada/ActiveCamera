/*
 仮想パンチルトの位置を決定する。
 動画リソースが2つ以上で1つの配信動画を構成するような方式には、このCanvasViewpointは対応しない。
 対応するためには、07時点では、set_viewpoint_element周辺を作成する必要がある。2022.03.07時点では、set_viewpoint_elementは中途半端に実装されているので、
 赤い枠は複数リソースを囲むが、viewpointの移動はvideos[0]のみとなっている。
*/
export const CanvasViewpoint = {
    params: {
        module_name: "CanvasViewpoint",

        // viewpointの有効化
        enable_viewpoint: true,

        // 位置の平均、その標準偏差を、新規データでアップデートする割合 2022.02.22 ばねモデルを採用してこのパラメータは未使用
        // update_ratio: 0.1, // 0.01

        // ビューポイントの最大最小幅(縦横のうち長い方の辺を1.0としたときの割合)
        viewpoint_max_size: 1.0,
        viewpoint_min_size: 0.6,


        // viewpointの中心位置の100ms単位の変化を検出する最小単位(これより小さい変化は無視する)。値は画面の縦横幅を1.0としたときの割合で指定する。
        min_dp: 0.000,

        // viewpointの縦横幅の100ms単位の変化を検出する最小単位(これより小さい変化は無視する)。値は画面の縦横幅を1.0としたときの割合で指定する。
        min_ds: 0.000,

        // min_dp, min_ds, spring_model_paramsの移動距離の基準になる単位、100とした場合、100msでどれだけ動くか、という設定になる。
        unit_msec: 100,

        // ビューポイントを移動させるfactorの重み（現在はピクセル数）の認識画面内での割合の最小値、この値未満のfactorは無視する。
        min_factor_rate: 0.000,

        // 位置の標準偏差に以下の係数をかけた幅を、視点の幅、高さとする。
        viewpoint_box_sd_effect: 5.0,

        // ばねモデルのパラメータの決定は、以下のサイトが便利
        // https://www.geogebra.org/graphing?lang=ja
        // maxEF - (maxEF / (1.0 + exp(-1 * (x - halfEffectL) / halfEffectSlope)))
        // この数値に最小値 min_effect のうち大きい方が採択される。

        // ばねモデル (バスケットボール用) 変化量の基準単位は100ms(10fps)のときの画面全体を1としたときの移動距離
        spring_model_params: {
            half_effect_l: 0.8,       // 割合が半分になる距離
            half_effect_slope: 0.1,   // 割合が0.5になる位置の勾配（数値が小さいと右下がりが強くなる）
            max_effect: 0.04,         // 勾配割合の最大値
            min_effect: 0.00,         // 勾配割合の最小値
        },
        // ばねモデル（モータースポーツ用）
        //     half_effect_l: 0.6,         // 割合が半分になる距離
        //     half_effect_slope: 0.1,    // 割合が0.5になる位置の勾配（数値が小さいと右下がりが強くなる）
        //     max_effect: 1.0,           // 勾配割合の最大値
        //     min_effect: 0.02,          // 勾配割合の最小値

        names: {
            enable_viewpoint: "プレビュー移動の有効化 (v)",

            // viewpoint_factorsの標準偏差にかける数値
            viewpoint_box_sd_effect: "差分SDからの倍率",
            // 振動しないように設定する:大→小:1.0-0.0
            viewpoint_max_size: "最大幅(1.0-0.0)",
            // 振動しないように設定する:小→大:1.0-0.0
            viewpoint_min_size: "最小幅(1.0-0.0)",

            // 

            //振動しないように設定する:大→小:1.0-0.0
            min_dp: "位置感度の最小値(1.0-0.0)",
            // 振動しないように設定する:大→小:1.0-0.0
            min_ds: "ズーム感度の最小値",
            // 基本は変えない
            unit_msec: "設定値の単位時間(ms)",
            // 無視する割合:小→大:1.0-0.0
            min_factor_rate: "差分感度の最小値",
        },
        details: {
            module_name: "この機能のプログラム上の名前です。変更することはできません。",
            enable_viewpoint: "自動パンチルトを有効化します。キーボードの v を押しても同じです。",
            viewpoint_max_size: "ズームアウトするときの、元の画面サイズを 1 としたときの最大幅を指定します。例えば0.8とすると、最もカメラを引いたときに元の画面の80%が見えている状態になります。",
            viewpoint_min_size: "ズームインするときの、元の画面サイズを 1 としたときの最小幅を指定します。例えば0.6とすると、最もズームしても元の画面の60%部分が画面全体に拡大されるだけとなります。",
            min_dp: "カメラ位置を変更する最小の変化量を指定します。最小の変化量にみたない変化は無視されることになります。変化がある領域を、画面全体を 1 としたときの割合で指定します。この値は、基準の単位時間(デフォルトで100ms)の間に起こる変化として処理されます。",
            min_ds: "カメラのズームを変化させるための最小の変化量を指定します。最小の変化量にみたない変化は無視されることになります。変化がある領域を、画面全体を 1 としたときの割合で指定します。この値は、基準の単位時間(デフォルトで100ms)の間に起こる変化として処理されます。",
            unit_msec: "時間に依存する設定値の基準となる単位時間を指定します。この設定は、画像を解析するサンプリングレートに相当します。基本は、設定を変更しません。",
            min_factor_rate: "ビューポイントを計算するときの、画素の変化などの変化を与える要因の最小量を指定します。処理内部ではfactorsの重みとなっていて、差分の場合にはピクセル数と重みは同じになります。",
            viewpoint_box_sd_effect: "ビューポイントを決定するための要因から算出された標準偏差にこの数値をかけた値をビューポイントの幅とします。基本は設定を変更しません。",
        },
        disables: [
            "module_name",
        ],
        hiddens: [
            "module_name",
            // "min_dp",
            // "min_ds",
            // "unit_msec",
            // "min_factor_rate",
            // "viewpoint_box_sd_effect",
        ],
    },

    init: async function (canvas) {
        this.canvas_wh = [canvas?.width, canvas?.height];
        this.canvas_size = canvas?.width * canvas?.height;
        this.aspect_ratio = [this.canvas_wh[1] / this.canvas_wh[0], this.canvas_wh[0] / this.canvas_wh[1]];

        ["keydown"].forEach(e => {
            const ef = `on_${e}`;
            const _ef = `_${ef}`;
            this[_ef] ??= (ei) => { this[ef](ei); };
            const elem = (e.includes("key") ? document.body : canvas);
            elem.removeEventListener(e, this[_ef]);
            elem.addEventListener(e, this[_ef]);
        });
    },
    output: async function (ctx) {
        const p = this.p.map((e, i) => e * this.canvas_wh[i]);
        const pbox = this.pbox.map((e, i) => e * this.canvas_wh[i]);

        // ビューポイントの描画
        ctx.fillStyle = "rgba(0,255,255,1)";
        ctx.beginPath();
        ctx.ellipse(...p, 4, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,255,255,1)";
        ctx.strokeRect(...p.map((e, i) => e - pbox[i] / 2), ...pbox, 0, 0, 2 * Math.PI);


        // 認識画面内にグラフを描画する。この処理は、処理時間が結構かかる。
        // [
        //     [this.factors_dp, this.params.min_dp],
        //     [this.factors_ds, this.params.min_ds],
        //     [this.factors_rate, this.params.min_factor_rate],
        //     [this.factors_weight_sum, this.factors_weight_sum_time_array.max()],
        //     [this.factors_weight_sum_time_array.max(), this.factors_effective_pixels / 4],
        // ].forEach((e, i) => {
        //     ctx.inner_graph(e[0], e[1] * 1.2, e[1], i, 10 + i * 130, 10, 120, 80, Math.round(this.dt / this.params.unit_msec));
        // });

    },
    set_viewpoint: function () {
        if (this.viewpoint_element.tagName === "VIDEO") {
            const p = this.p.map((e, i) => Math.round((this.pbox[i] / 2 - e) * this.viewpoint_element_wh[i]) + "px");
            const str = "scale(" +
                (1.0 / this.pbox[0]) +
                ") translate(" +
                p.join(",") +
                ")";
            this.viewpoint_element.style.transformOrigin = "left top";
            this.viewpoint_element.style.transform = str;
        } else if (this.viewpoint_element.tagName === "CANVAS") {
            const p = this.p.map((e, i) => e * this.viewpoint_element.userData.wh[i]);
            const pbox = this.pbox.map((e, i) => e * this.viewpoint_element.userData.wh[i]);
            const ltwh = [p[0] - pbox[0] / 2, p[1] - pbox[1] / 2, pbox[0], pbox[1]];
            this.viewpoint_element_ctx.drawImage(this.viewpoint_element.userData.source
                , ...ltwh, 0, 0, ...this.viewpoint_element.userData.wh);
        }
    },

    /* lil_guiにパラメータ設定を変更して、get_settings, set_settingsは廃止予定 2022.09.28 
    get_settings: function () {
        return [
            {
                name: "viewpoint プレビュー移動の有効化 (v)",
                type: "boolean",
                id: "CanvasViewpoint_enable_set_viewpoint",
                value: this.params.enable_set_viewpoint,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "viewpoint boxサイズの倍率",
                type: "number",
                id: "CanvasViewpoint_viewpoint_box_sd_effect",
                value: this.params.viewpoint_box_sd_effect,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "viewpoint 最大幅<span style='font-size:x-small'>(振動しない:大→小:1.0-0.0)</span>",
                type: "number",
                id: "CanvasViewpoint_viewpoint_max_size",
                value: this.params.viewpoint_max_size,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "viewpoint 最小幅<span style='font-size:x-small'>(振動しない:小→大:1.0-0.0)</span>",
                type: "number",
                id: "CanvasViewpoint_viewpoint_min_size",
                value: this.params.viewpoint_min_size,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "viewpoint 位置感度/ut<span style='font-size:x-small'>(振動しない:大→小:1.0-0.0)</span>",
                type: "number",
                id: "CanvasViewpoint_min_dp",
                value: this.params.min_dp,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "viewpoint ズーム感度/ut<span style='font-size:x-small'>(振動しない:大→小:1.0-0.0)</span>",
                type: "number",
                id: "CanvasViewpoint_min_ds",
                value: this.params.min_ds,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "viewpoint 差分感度<span style='font-size:x-small'>(無視する:小→大:1.0-0.0)</span>",
                type: "number",
                id: "CanvasViewpoint_min_factor_rate",
                value: this.params.min_factor_rate,
                on: { func: this.set_settings, self: this },
            },

            // spring model関連
            {
                name: "viewpoint spring model parameters (割合半分の距離,割合半分位置の勾配,割合最大,割合最小)",
                type: "string",
                id: "CanvasViewpoint_spring_model_parameters",
                value: Object.values(this.params.spring_model_params).join(","),
                on: { func: this.set_settings, self: this },
            },
        ];
    },
    set_settings: function (e) {
        const pname = e.target.id.split("CanvasViewpoint_")[1];
        if (pname === "enable_set_viewpoint") {
            if (e.target.checked === false) {
                // this.p = [0.5, 0.5];
                // this.pbox = [1, 1];
                this.reset_viewpoint();
                this.set_viewpoint();
            }
            this.params[pname] = e.target.checked;
        } else if (pname === "spring_model_parameters") {
            const v = e.target.value.split(",");
            Object.keys(this.params.spring_model_params).forEach((k, i) => {
                // console.log(k, v[i]);
                this.params.spring_model_params[k] = v[i];
            });
        } else {
            this.params[pname] = Number(e.target.value);
            // console.log(pname,e.target.value,this.params[pname]);
        }
    },
    /* */
    on_keydown: function (e) {
        if (e.key === "v") {
            // this.reset_viewpoint();
            // this.set_viewpoint();
            this.params.enable_viewpoint = !this.params.enable_viewpoint;

            // 画面のチェックボックスの状態を更新する。
            // const id = this.get_settings().filter(e => e.value === this.params.enable_set_viewpoint)[0].id;
            // document.getElementById(id).checked = this.params.enable_set_viewpoint;
        }
    },

    // 最新sz個のデータを保持する固定長配列
    // pushで値をセットして、maxで最大値を出力する。
    fixed_array: function (sz) {
        // console.log("size", sz);
        const ar = [];
        let i = 0;
        let mx = 0;
        let mx_i = i;
        const funcs = {
            push: (v, c) => {
                // console.log(v, c);
                for (let j = 0; j < c; j++) {
                    ar[(i + j) % sz] = v;
                }
                const check_mx_i = mx_i < i ? mx_i + sz : mx_i;
                if (i <= check_mx_i && check_mx_i <= i + c - 1) {
                    [mx, mx_i] = ar.reduce((a, e, i) => a[0] >= e ? a : [e, i], [ar[0], 0]);
                } else if (v > mx) {
                    [mx, mx_i] = [v, (i + c - 1) % sz];
                }
                i = (i + c) % sz;
                return funcs;
            },
            max: () => {
                return mx;
            },
            size: () => {
                return ar.length;
            },
        };
        return funcs;
    },

    // 変更するviewpointであるHTMLElement
    viewpoint_element: undefined,
    viewpoint_element_ctx: undefined,
    // viewpointを変更するvideoの横縦幅
    viewpoint_element_wh: undefined,
    set_viewpoint_element: function (e, ctx, wh) {
        this.viewpoint_element = e;
        this.viewpoint_element_ctx = ctx;
        this.viewpoint_element_wh = wh ?? e.wh;
        return this;
    },
    get_viewpoint_element: function () {
        return this.viewpoint_element;
    },

    points: [],
    add_point: function (p) {
        this.points.push(p);
    },

    // 位置(画面の左上を0,0、右下を1,1としたときの座標)、tの付く方は移動したいターゲット位置、tの無い方は現在の表示位置、スプリングモデルによりターゲット位置に徐々に近づく。
    p: [0.5, 0.5],
    pt: [0.5, 0.5],
    // 速度 速度モデルで使用するパラメータ
    // v: [0, 0],
    // 位置点の範囲（幅、高さ）、元々の幅、高さを1としたときの割合
    pbox: [1.0, 1.0],
    pboxt: [1.0, 1.0],
    // 位置、位置の範囲を計算したときの要因のデータ数 ばねモデルにしてから使用していない。
    // n: 0,
    // 認識画面のアスペクト比
    aspect_ratio: undefined,
    // 認識画面の横縦幅
    canvas_wh: undefined,
    // 認識画面のピクセル数
    canvas_size: undefined,

    // スプリングモデルによる変化量の計算 vec: 現在の長さ - 自然長の距離
    spring: function (vec, params) {
        const rad = Math.atan2(vec[1], vec[0]);
        const div = Math.sqrt(vec.reduce((a, e) => a + Math.pow(e, 2), 0));
        const effect = Math.max(params.min_effect, params.max_effect - (params.max_effect / (1.0 + Math.exp(-1 * (Math.abs(div) - params.half_effect_l) / params.half_effect_slope))));
        const div2 = div * effect;
        const dp = [div2 * Math.cos(rad), div2 * Math.sin(rad)];
        return dp;
    },

    // viewpointの更新
    // factors: [x,y,重み]を要素とするリスト
    // dt:前回updateからの経過時間(ms)
    update_viewpoint: function (factors, dt, effective_pixels) {
        this.dt = dt;

        // 移動したいところ
        let pt = [0.5, 0.5];
        let pboxt = [1, 1];
        // デフォルトでは、最初に横幅を計算し、アスペクト比から縦幅を計算する。横幅はindex 0にデータが入っていて、先にそれを計算するので、0,1の順序にしている。
        let idx = [0, 1];

        if (this.params.enable_viewpoint) {

            // 合計[x,y,重み]を求める。x,y座標のfactors[0],factors[1]は重み(factors[2])をかけてから合計し、重みはそのまま合計する。
            const sum = factors.map(e => [...e.slice(0, 2).map(ei => ei * e[2]), e[2]]).reduce((a, e) => a.map((ei, i) => ei + e[i]), [0, 0, 0]);
            this.factors_weight_sum = sum[2];
            this.factors_weight_sum_time_average = (this.factors_weight_sum_time_average ?? 0) * 0.99 + 0.01 * this.factors_weight_sum * dt / this.params.unit_msec;
            // console.log("dt",dt)
            // 最新 a ミリ秒間のweight_sumの最大値を保持する。 コメントのmsの前に、 a の数値を記載する。
            // そのあとの*10の2か所は、this.params.unit_msecを何分割してデータして保存するかを決定する。10の場合、1つのデータは100ms / 10 = 100msの平均を表すことになる。
            // 例えばdt=200msの場合、2個のデータを更新することになる。
            this.factors_weight_sum_time_array = (this.factors_weight_sum_time_array ?? this.fixed_array(60 * 1000/*ms*/ * 10 / this.params.unit_msec)).push(this.factors_weight_sum, Math.round(dt * 10 / this.params.unit_msec));
            this.factors_effective_pixels = effective_pixels;
            this.factors_rate = sum[2] / this.canvas_size;

            // 最小factorを上回らない場合は、viewpoint変更の処理を行わない。
            if (factors.length !== 0 && this.factors_rate >= this.params.min_factor_rate) {

                // 平均[x,y,重み]を求める。x,y座標のfactors[0],factors[1]は重みで割り、重みはfactorsの要素数で割る。
                const ave = sum.map((e, i) => e / (i === 2 ? factors.length : sum[2]));
                // 標準偏差[x,y,重み]を求める。(e-ave)^2に重みをかけて合計値で割り、平方根をとる。
                const sd = factors.reduce((a, e) => a.map((ai, i) => ai + Math.pow(e[i] - ave[i], 2) * e[2]), [0, 0, 0]).map(e => Math.sqrt(e / sum[2]));
                this.factors_sd = sd;
                // console.log(`sum=${sum}, ave=${ave}, sd=${sd}, ef_pix=${effective_pixels}`);
                // console.log(`rate=${sum[2]/effective_pixels}`)

                // 中央値のテスト
                // const median_idx = Math.trunc(factors.length/2);
                // for(let i=0;i<2;i+=1){
                //     console.log("1",i,ave[i]);
                //     ave[i] = factors.map(e=>e[i]).sort()[median_idx];
                //     console.log("2",i,ave[i]);
                // }


                const ave_r = ave.slice(0, 2).map((e, i) => e / this.canvas_wh[i]);
                const sd_r = sd.slice(0, 2).map((e, i) => e / this.canvas_wh[i]);
                // console.log(`ave_r=${ave_r}, sd_r=${sd_r}`);


                // 目標のカメラポジション、ズーム幅を計算し、前の値からの変化が最小単位のparams.min_dp, params.min_ds以上なら更新する。

                // カメラポジションのターゲットはfactorsの平均位置
                pt = ave_r;
                // 幅はまず、アスペクト比に対して横縦で大きい方を先に計算する。
                idx = sd[1] / sd[0] > this.aspect_ratio[0] ? [1, 0] : [0, 1];
                pboxt = [0, 0];
                pboxt[idx[0]] = Math.min(this.params.viewpoint_max_size, Math.max(this.params.viewpoint_min_size, this.params.viewpoint_box_sd_effect * sd_r[idx[0]]));
                // console.log("min",this.params.viewpoint_min_size,"max",this.params.viewpoint_max_size,"res",pboxt[idx[0]])
                pboxt[idx[1]] = pboxt[idx[0]];

                // カメラポジションと幅のターゲットは有効になる最小単位を決める。
                this.factors_dp = Math.sqrt(pt.map((e, i) => Math.pow(e - this.pt[i], 2)).reduce((a, e) => a + e));
                if (this.factors_dp >= this.params.min_dp * dt / this.params.unit_msec) {
                    this.pt = pt;
                } else {
                    pt = this.pt;
                }
                this.factors_ds = Math.abs(pboxt[0] - this.pboxt[0]);
                if (this.factors_ds >= this.params.min_ds * dt / this.params.unit_msec) {
                    this.pboxt = pboxt;
                } else {
                    pboxt = this.pboxt;
                }
            }
        }


        // -----------------------
        // ここで移動したい先 ptと 移動したい画角 pboxtが決定する。


        // spring modelのパラメータhalf_effect_lに前回からの経過時間をかけ合わせる
        const spring_model_params = Object.assign({}, this.params.spring_model_params);
        // springモデルのパラメータは、1枚の画像で移動したいところと現在の位置の差分から移動距離の係数を求める。dtには関係ないはず？
        // spring_model_params.half_effect_l = spring_model_params.half_effect_l*dt/this.params.unit_msec;

        // factorsの重み付き平均位置と現在のカメラポジションの差分をとる。
        const dif_p = pt.map((e, i) => e - this.p[i]);
        // 移動したいカメラポジションから実際に移動する量をスプリングモデルで計算する。
        const dp = this.spring(dif_p, spring_model_params);
        // 新しいカメラポジションを計算する。pboxの計算後に補正する可能性があるので、一時変数に保存しておく。
        let p = dp.map((e, i) => e + this.p[i]);


        // 移動したい場所と、springモデルによって実際に移動する場所（枠外の補正前）を出力
        // console.log(`移動したい位置とSpringModelによる移動位置との差分: ${Math.sqrt(p.map((e,i)=>Math.pow(e-pt[i],2)).reduce((a,e)=>a+e))}`)


        // factorsの重み付き標準偏差にthis.params.viewpoint_box_sd_effectを乗算したものを幅として、現在の幅との差分からばねモデルで実際の移動量を求める。
        const ds = this.spring([pboxt[idx[0]] - this.pbox[idx[0]], 0], spring_model_params)[0];
        // 一時変数のpboxに新しい幅を計算する。
        const pbox = [0, 0];
        pbox[idx[0]] = Math.min(1, this.pbox[idx[0]] + ds);
        // pboxは元の幅高さの割合として計算されるため、他方の辺も同じ割合ぬすることでアスペクト比が保たれる。
        pbox[idx[1]] = pbox[idx[0]];

        // 枠が画面外にでないように補正する。
        p = p.map((e, i) => Math.max(pbox[i] / 2, Math.min(1 - pbox[i] / 2, e)));

        // 現在位置、幅の更新
        this.p = p;
        this.pbox = pbox;

        this.set_viewpoint();


        /*
        // カメラに速度を持たせるモデル：慣性が強くてあまり使い物にならない。
        // const params = {
        //     friction_len_r: 0.1,
        //     max_v_r: 0.1,
        //     camera_m: 0.1,
        // }
        // const f_p = ave_r.map((e, i) => e - this.p[i]);
        // const a_p = f_p.map((e, i) => (e - Math.sign(e) * Math.min(Math.abs(e), params.friction_len_r)) / params.camera_m);
        // this.v = this.v.map((e, i) => Math.min(params.max_v_r, Math.max(-params.max_v_r, e + a_p[i] * dt)));
        // this.p = this.p.map((e, i) => e + this.v[i] * dt);

        */


        /*
        // 単純に計測値を平均するモデル

        // 位置、位置の幅を計算するための要因データ数の更新
        const n0 = this.n * (1 - this.params.update_ratio);
        const n1 = sum[2] * this.params.update_ratio;
        this.n = n0 + n1;
        const r = [n0 / this.n, n1 / this.n];

        // 単純に更新する場合の位置を計算する。
        const p1 = this.p.map((e, i) => e * r[0] + ave[i] * r[1]);
        // console.log(`p1=${p1}`);

        // アクティベーション関数(位置用)
        // 関数の形は、https://www.geogebra.org/graphing?lang=ja で確認できる。
        // const act_ratio_p = (x) => (1 / (1 + Math.exp(-40 * (x - 0.1))));
        // const act_ratio_p = (x) => x < 0.02 ? 0 : 1;
        const act_ratio_p = (x) => 1;

        // p1をアクティベーション関数を通して、次の位置を算出する。
        // 移動したい差分値
        const dp = p1.map((e, i) => e - this.p[i]);
        // 現在のビューポイントの位置と変更したい位置の差分の画面全体に対する割合
        const dpr = dp.map((e, i) => act_ratio_p(Math.abs(e) / this.canvas_wh[i]));
        // 差分の割合から、そのうち何パーセントを実際の次の位置に充てるかを計算する。
        this.p = this.p.map((e, i) => (e + dp[i] * dpr[i]));
        // console.log(dp, dpr, this.p);

        // 位置の幅はまず、アスペクト比に大して横縦で大きい方を先に計算する。
        const idx = sd[1] / sd[0] > this.aspect_ratio[0] ? [1, 0] : [0, 1];
        const pbox1 = [0, 0];
        pbox1[idx[0]] = this.pbox[idx[0]] * r[0] + this.params.viewpoint_box_sd_effect * sd[idx[0]] * r[1];
        pbox1[idx[0]] = Math.min(this.canvas_wh[idx[0]], pbox1[idx[0]]);
        pbox1[idx[1]] = pbox1[idx[0]] * this.aspect_ratio[idx[0]];
        // console.log(`pbox1=${pbox1}`);

        // アクティベーション関数(幅高さ用)
        // const act_ratio_s = (x) => (1 / (1 + Math.exp(-20 * (x - 0.5))));
        // const act_ratio_s = (x) => x < 0.02 ? 0 : 1;
        const act_ratio_s = (x) => 1;

        // pbox1をアクティベーション関数を通して、次の位置の幅を決める。
        const ds = pbox1.map((e, i) => (e - this.pbox[i]));
        const dsr = ds.map((e, i) => act_ratio_s(Math.abs(e) / this.canvas_wh[i]));
        this.pbox = this.pbox.map((e, i) => (e + ds[i] * dsr[i]));
        // console.log(ds, dsr, this.pbox);

        this.set_viewpoint();
        */

        return;
    },
    // 注目点の要素の標準偏差から、viewpointの幅高さを求める。
    // sd2box: function (prev, sd) {
    //     return prev * (1 - this.params.update_ratio[1]) + this.params.viewpoint_box_sd_effect * sd * this.params.update_ratio[1];
    // },
};
