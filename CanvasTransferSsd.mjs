/*
Coco-Ssd を転移学習するためのテストモジュール

試そうとしたもの：
coco-ssdの出力からcoco-ssdでは認識できていない例えばボールを認識するために、新たにボールの正解データを与えて転移学習させる。

現状（2022.09.08に見直し）：
coco-ssdの出力がtensorではなく認識オブジェクト一覧のため、そのままknnに入れることができない。

現状でできていること：
this.recognizeで認識したすべてのオブジェクトとその個数をconsoleに表示
this.recognizeで定義されたsimilar_objectsの中で最も認識精度の高いものを認識画面上で黄色い四角で表示
認識画面上でマウスで四角形を作成すると、その四角形に接触する（Jaccard係数0.5以上）認識されたオブジェクトを表示する。これによりボールが違う認識をされているか確認できる。
*/
export const CanvasTransferSsd = {
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
    init: async function (canvas) {
        if (this.net === undefined) {
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2");

            // coco-ssdによる転移学習のテスト、net.inferの出力がcoco-ssdの場合にはtensorではなく推定されたオブジェクト情報のため、そのままknnの入力とできないので、とりあえず保留 2022.03.20
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd");
            this.net = await cocoSsd.load({ base: "mobilenet_v2" });

            console.log("net", this.net);
        }
        this.canvas_wh = [canvas.width, canvas.height];
        ["keydown", "mousedown", "mouseup", "mousemove"].forEach(e => {
            const ef = `on_${e}`;
            const _ef = `_${ef}`;
            this[_ef] ??= (ei) => { this[ef](ei) };
            // document.body.removeEventListener(e,this[_ef]);
            // document.body.addEventListener(e,this[_ef]);
            const elem = (e.includes("key") ? document.body : canvas);
            elem.removeEventListener(e, this[_ef]);
            elem.addEventListener(e, this[_ef]);
        })
    },
    recognize: async function (data) {
        // coco-ssdの場合は第2に引数をundefinedにして、取得するオブジェクト数をデフォルトとする。
        const activation = await this.net.infer(data.canvas);
        // 発見されたオブジェクトとその数をヒストグラムとして求める。 {class名:個数, ... }
        const hist = activation.reduce((a, e) => { a[e.class] = (a[e.class] ?? 0) + 1; return a; }, {});
        console.log("hist", hist);

        // console.log("activation", activation);
        // console.log("filtered", activation.filter(e => e.class == "tv"));

        // debug
        const similar_objects = ["apple", "stop sign"/*,"person"*/];
        // similar_objectsの中で最も認識精度の高いオブジェクトを選び、similar_objectに代入する。
        const similar_object = activation.filter(e => similar_objects.includes(e.class)).sort((e0, e1) => e1.score - e0.score).at(0);
        console.log("class", similar_object?.class);
        // CanvasTransferSsdに保存
        this.sample_bbox = similar_object?.bbox;

        // debug
        // 認識画面上にマウスで作成した四角形を取得する。
        const ltrb = this.rect.getLtrb();
        if (ltrb.length === 4) {
            // Jaccard係数が0.5以上の認識されたオブジェクト一覧を取得する。
            this.sample_similar_objects = activation.filter(e => this.rect.jaccard(this.rect.rect2ltrb(e.bbox), ltrb) > 0.5);
            console.log("filtered", this.sample_similar_objects);
            console.log("filtered hist", this.sample_similar_objects.reduce((a, e) => { a[e.class] = (a[e.class] ?? 0) + 1; return a; }, {}))
        }

    },
    output: async function (ctx) {

        this.rect.draw(ctx);
        // this.recognizeで定義されているsimilar_objectsの中で最も認識精度の高いオブジェクトがある場合、それを描画する。
        if (this.sample_bbox !== undefined) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 1;
            ctx.strokeRect(...this.sample_bbox);

            // if (this.rect.hasRect()) {
            //     const sample_ltrb = this.rect.rect2ltrb(this.sample_bbox);
            //     const a = this.rect.intersect(sample_ltrb, this.rect.getLtrb());
            //     if (a.length === 4) {
            //         ctx.fillRect(...this.rect.ltrb2rect(a));
            //         console.log("jaccard", this.rect.jaccard(sample_ltrb, this.rect.getLtrb()));
            //     }
            // }
        }
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        // マウスで作成された四角形に接する認識されたオブジェクトをすべて表示する。
        this.sample_similar_objects?.forEach(e => {
            ctx.strokeRect(...e.bbox);
            ctx.fillStyle = "rgba(0,0,255,1)";
            ctx.fillText(e.class, e.bbox[0], e.bbox[1]);
        })
    },

    // canvasサイズの保存
    canvas_wh: undefined,
    // 画像認識する既存のモデル
    net: undefined,

    // キーボード入力による学習データの作成 (2022.03.22時点で未使用)
    on_keydown: function (e) {
        console.log("onKeyDown", e.key);
    },


    // クリック入力による学習データの作成
    on_mousedown: function (e) {
        console.log("onMouseDown", e);
        this.rect.start([e.offsetX, e.offsetY]);
    },
    on_mouseup: function (e) {
        console.log("onMouseUp", e);
        this.rect.finish([e.offsetX, e.offsetY]);
    },
    on_mousemove: function (e) {
        // console.log("onMouseMove", e);
        this.rect.working([e.offsetX, e.offsetY]);
    },
    rect: {
        // 左上と右下の座標
        ltrb: [],
        working_flag: false,
        start: function (e) {
            this.box = [...e];
            this.working_flag = true;
        },
        finish: function (e) {
            this.working(e);
            this.working_flag = false;
        },
        working: function (e) {
            if (this.working_flag) {
                this.ltrb = [...this.box.slice(0, 2), ...e];
            }
        },
        draw: function (ctx) {
            if (this.hasRect()) {
                ctx.strokeStyle = "green";
                ctx.lineWidth = 15;
                ctx.strokeRect(...this.ltrb2rect(this.nor(this.ltrb)));
            }
        },
        getLtrb: function () {
            return this.nor(this.ltrb);
        },
        getRect: function () {
            return this.ltrb2rect(this.nor(this.ltrb))
        },
        hasRect: function () {
            return this.ltrb.length === 4;
        },

        // 以下はこのオブジェクトに依存しない static な関数

        // 対角線の2点の座標[x0,y0,x1,y1]を、四角形の左上p0、右下p1の[...p0,...p1]の形式に変換する。
        nor: function (ltrb) {
            return ltrb.map((e, i) => [Math.min, Math.max][Math.trunc(i / 2)](ltrb[i % 2], ltrb[i % 2 + 2]));
        },
        // 面積を求める。
        area: function (ltrb) {
            return ltrb.slice(0, 2).map((e, i) => ltrb[i + 2] - e).reduce((a, e) => a * e);
        },
        // 左上右下の座標を記録する[x0,y0,x1,y1]形式から左上と幅高さ[x,y,w,h]の形式に変換する。
        ltrb2rect: function (ltrb) {
            return ltrb.map((e, i) => i < 2 ? e : e - ltrb[i % 2]);
        },
        // 左上の座標と幅高さ[x,y,w,h]の形式から左上右下の座標[x0,y0,x1,y1]の形式に変換する。
        rect2ltrb: function (rect) {
            return [...rect.slice(0, 2), ...rect.slice(0, 2).map((e, i) => e + rect[i + 2])];
        },
        intersect: function (ltrb0, ltrb1) {
            const mf = [Math.max, Math.min];
            const pt = ltrb0.map((e, i) => mf[Math.trunc(i / 2)](e, ltrb1[i]));
            return pt.slice(0, 2).some((e, i) => pt[i + 2] - e < 0) ? [] : pt;
        },
        hasIntersection: function (ltrb0, ltrb1) {
            return this.intersect(ltrb0, ltrb1).length === 4;
        },
        // 2つの四角形間のJaccard係数(A∩B/A∪B)を求める(最小0 (未接触), 最大1(完全一致))
        jaccard: function (ltrb0, ltrb1) {
            const a = this.intersect(ltrb0, ltrb1);
            const s = a.length === 0 ? 0 : this.area(a);
            return s / (this.area(ltrb0) + this.area(ltrb1) - s);
        },
    },
    // debug
    sample_bbox: undefined,
    sample_similar_objects: undefined,

};
