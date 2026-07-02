/*
転移学習(Transfer Learning)のテストモジュール

学習したい画面の状態のときに、ラベルになる文字を入力する。
正解データがあると、分類を実施し、推定されたラベルを画面上に表示する。

knnClassifier : tensorflow
https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier

tensorflow.jsのモデル一覧
https://www.tensorflow.org/js/models?hl=ja
*/
export const CanvasTransferLearning = {
    params: {
        module_name: "CanvasTransferLearning",
        enable_add_example_by_key: false,
        type_add_example_by_display: "評価のみ",
        clear_model: false,

        dropdowns: {
            type_add_example_by_display: [
                "何もしない",
                "評価のみ",
                "間違えたときに学習する",
            ],
        },

        names: {
            enable_add_example_by_key: "キー入力で教師データを与える",
            type_add_example_by_display: "画面左上[全画面/追従/固定]学習",
            clear_model: "モデルのクリア",
        },
        onChanges: {
            clear_model: function(e){
                if(e){
                    this.object.clear();
                    this.clear_model = false;
                }
            },
        },
        disables:[
            "module_name",
        ],
    },
    // types_add_example_by_display: [
    // ],
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
    /*
    get_settings: function () {
        return [
            {
                name: "場面学習 キー入力で教師データを与える",
                type: "boolean",
                id: "CanvasTransferLearning_enable_add_example_by_key",
                value: this.params.enable_add_example_by_key,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "場面学習 画面上の教師信号から学習",
                type: "array",
                id: "CanvasTransferLearning_type_add_example_by_display",
                options: this.types_add_example_by_display,
                value: this.params.type_add_example_by_display,
                on: { func: this.set_settings, self: this },
            },
            {
                name: "場面学習 ",
                type: "button",
                id: "CanvasTransferLearning_clear_model",
                value: "モデルのクリア",
                on: { func: this.set_settings, self: this },
            },
        ];
    },
    set_settings: function (e) {
        const pname = e.target.id.split("CanvasTransferLearning_")[1];
        if (pname === "clear_model") {
            this.clear();
        } else if (pname === "enable_add_example_by_key") {
            this.params[pname] = e.target.checked;
        } else if (pname === "type_add_example_by_display") {
            this.params[pname] = this.types_add_example_by_display.indexOf(e.target.value);
        }
    },
    /* */
    init: async function (canvas) {
        if (this.net === undefined) {
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2");

            // mobilenetによる転移学習。interメソッドにより最終層のtensorが取得できる？ので、それをknnの入力にして学習する。
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet");
            this.net = await mobilenet.load();

            console.log("net", this.net);

            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier");
            this.classifier = knnClassifier.create();

            this.load();
        }
        this.canvas_wh = [canvas.width, canvas.height];
        ["keydown"].forEach(e => {
            const ef = `on_${e}`;
            const _ef = `_${ef}`;
            this[_ef] ??= (ei) => { this[ef](ei); };
            const elem = (e.includes("key") ? document.body : canvas);
            elem.removeEventListener(e, this[_ef]);
            elem.addEventListener(e, this[_ef]);
        });

        // 領域を分割した転移学習は試していない
        // this.cells = this.create_cells(this.canvas_wh, [10, 10]);
    },
    recognize: async function (data) {
        if (this.classifier.getNumClasses() > 0) {
            const activation = this.net.infer(data.canvas, "conv_preds");
            this.prediction = await this.classifier.predictClass(activation);
        }

        // 画面の一部に教師データをセットする。
        const label = { 254: "追従", 255: "全画面", 1: "固定" }[data.imageData_bk?.data[0]];
        // console.log("label",label);
        if (this.params.type_add_example_by_display != "何もしない" && label !== undefined && this.prediction?.label != label) {
            console.log(`failed (予測:${this.prediction?.label} 正解:${label})`);

            if (this.params.type_add_example_by_display == "間違えたときに学習する") {
                const activation = await this.net.infer(data.canvas, true);
                this.classifier.addExample(activation, label);
                //console.log(`saved instances is ${this.classifier.getClassifierDataset()}`);
                // console.log(this.classifier.getClassifierDataset());
                Object.entries(this.classifier.getClassifierDataset()).forEach(([k, v]) => {
                    console.log(`${k} ${v.shape[0]}`)
                })
                this.save();
            }
        }


        // key入力で教師データをセットする。this.exampleにはキーの文字が入り、キーイベント時にセットされる。
        if (this.example !== undefined) {
            // mobilenetの場合は、第二引数にtrueを指定して途中のアクティベーションを取得する。
            const activation = await this.net.infer(data.canvas, true);
            this.classifier.addExample(activation, this.example);
            this.example = undefined;
            this.save();
        }
    },
    output: async function (ctx) {
        ctx.font = Math.round(this.canvas_wh[0] * 0.12) + "px serif";
        ctx.textAlign = "center";
        const t = (Date.now() / 1000) % (Math.PI * 2);
        const lab = [0.82, Math.sin(t), Math.cos(t)];
        const rgb = Colors.lab2rgb(...lab);
        const lab2 = Colors.rgb2lab(...rgb);
        const rgb_s = "rgb(50, 168, 82)";
        ctx.fillStyle = rgb_s;
        ctx.fillText(this.prediction?.label, ...this.canvas_wh.map(e => e / 2));

    },

    // canvasサイズの保存
    canvas_wh: undefined,
    // 画像認識する既存のモデル
    net: undefined,
    // kNN classifier
    classifier: undefined,

    // キーボード入力による学習データの作成
    on_keydown: function (e) {
        if (this.params.enable_add_example_by_key === true) {
            this.example = e.key;
        }
    },
    // キー情報を取得しておいて、recognizeメソッドの実行タイミングで画像データと合わせて学習データとする。
    example: undefined,


    // モデルのクリア
    clear: function () {
        this.classifier.clearAllClasses();
        localStorage.removeItem("knn_classifier_dataset");
    },
    // モデルのセーブ
    save: function () {
        const dataset = {};
        Object.entries(this.classifier.getClassifierDataset()).forEach(([k, e]) => {
            dataset[k] = Array.from(e.dataSync());
        })
        console.log(dataset);
        localStorage.setItem("knn_classifier_dataset", JSON.stringify(dataset));
    },
    // モデルのロード
    load: function () {
        const dataset = JSON.parse(localStorage.getItem("knn_classifier_dataset") ?? "{}");
        Object.keys(dataset).forEach(k => {
            dataset[k] = tf.tensor(dataset[k], [dataset[k].length / 1024, 1024]);
        })
        this.classifier.setClassifierDataset(dataset);
    },



    // cellで分割して転移学習を試みようとしたけどやってない 2022.03.22
    // cells: undefined,
    // create_cells: function (canvas_wh, cell_wh) {
    //     const cells = [];
    //     const p0 = canvas_wh.map((e, i) => (Math.trunc((e % cell_wh[i]) / 2) - cell_wh[i]) % cell_wh[i]);
    //     for (let y = p0[1]; y < canvas_wh[1]; y += cell_wh[1]) {
    //         for (let x = p0[0]; x < canvas_wh[0]; x += cell_wh[0]) {
    //             let c = {
    //                 x: Math.max(0, x),
    //                 y: Math.max(0, y),
    //             };
    //             c = {
    //                 ...c,
    //                 w: Math.min(x + cell_wh[0], canvas_wh[0]) - c.x,
    //                 h: Math.min(y + cell_wh[1], canvas_wh[1]) - c.y,
    //             };
    //             c = {
    //                 ...c,
    //                 size: c.w * c.h,
    //                 canvas_indices: [...Array(c.w * c.h).keys()].map(i => {
    //                     const x = i % c.w + c.x;
    //                     const y = Math.trunc(i / c.w) + c.y;
    //                     const idx = (y * canvas_wh[0] + x) * 4;
    //                     return idx;
    //                 }),
    //             };
    //             cells.push(c);
    //         }
    //     }
    //     return cells;
    // },
};
