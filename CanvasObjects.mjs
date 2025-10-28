/*
 tensorflowのオブジェクト検出を用いた画像認識
 https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd

 検出可能オブジェクトの種類は90種類
 https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts

 coco-ssdの説明サイト
 https://www.acceluniverse.com/blog/developers/2020/02/SSD.html
*/
export const CanvasObjects = {
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
    object2pt: (p) => ([p.bbox[0] + p.bbox[2] / 2, p.bbox[1] + p.bbox[3]]),
    net: undefined,
    params: {
        module_name: "CanvasObjects",
        net_type: "yolox_nano_320_320_coco", // 最初のモデル名, dropdowns.net_typeの value の方のどれかを記載する。
        max_detected_objects: 160, // for coco-ssd
        min_accuracy: 0.1, // for yolox
        max_iou: 0.45, // for yolox

        dropdowns: {
            net_type: {
                "none": "none",
                "coco-ssd": "coco-ssd",
                "yolox_x_coco_416": "yolox_x_416_416_coco",
                "yolox_coco_640": "yolox_nano_640_640_coco",
                "yolox_coco_320": "yolox_nano_320_320_coco",
                "yolox_msp_416": "yolox_tiny_416_416_motorsports",
                "yolov3tiny_zoo": "yolox_yolov3tiny_416_416_coco",
                "yolox_msp_320": "yolox_nano_320_320_motorsports",
                "yolox_msp_32": "yolox_nano_32_32_motorsports",
                "yolox_bsk_640": "yolox_nano_640_640_basketball",
                "yolox_bsk_416": "yolox_nano_416_416_basketball",
                "yolox_s_bsk_416": "yolox_s_416_416_basketball",
                "yolox_nano_dice_416": "yolox_nano_416_416_dice",
            },
        },
        onChanges: {
            net_type: function (e) {
                // console.log(e);
                // console.log(this.net_type);
                // console.log(this);
                this.object.net = undefined;
                this.object.init();
            },
        },
        names: {
            net_type: "モデル名",
            max_detected_objects: "発見できる最大数(coco-ssd)",
            min_accuracy: "最小acc(yolox)",
            max_iou: "最大IoU(yolox)",
        },
        details: {
            max_iou: "この値未満のIoU値を持つbboxは別個体として扱われる",
        },
        disables: [
            "module_name",
        ],
        hiddens: [
            "module_name",
        ],
    },
    // 指定したサイズの画像データにコピーする。送り先が小さい場合は中心の一部を切り取る、大きい場合は中心に元画像を配置する。
    _resized_copy_to: function (src, dst, w, h) {
        // src: ImageData, dst:Float32Array, w:int, h:int

        // dst の座標系における srcの四隅の座標を計算し、dst,srcの四隅の小さい方の値でループする。

        // src,dstの中心位置
        const src_cs = [Math.trunc(src.width / 2), Math.trunc(src.height / 2)];
        const dst_cs = [w, h].map(e => Math.trunc(e / 2));

        // src を dst 座標においたときの左上の数値
        const src_xy0 = src_cs.map((e, i) => dst_cs[i] - e);

        for (let dst_y = Math.max(0, src_xy0[1]); dst_y < Math.min(src_xy0[1] + src.height, h); dst_y += 1) {
            for (let dst_x = Math.max(0, src_xy0[0]); dst_x < Math.min(src_xy0[0] + src.width, w); dst_x += 1) {
                const dst_pi = dst_y * w + dst_x;
                const src_x = dst_x - src_xy0[0];
                const src_y = dst_y - src_xy0[1];
                const src_pi = src_y * src.width + src_x;
                [...Array(3).keys()].forEach(i => {
                    dst[dst_pi + i * w * h] = src.data[src_pi * 4 + i];
                })
            }
        }
        return [dst, function (dst, i) { return dst - src_xy0[i]; }];
    },
    // [{bbox:[x,y,w,h],class:"label"},...]
    _predictions: undefined,
    _canvas_wh: undefined,
    init: async function (canvas) {
        if (this.net !== undefined) {
            return;
        }
        this._predictions = undefined;
        // console.log(this.params.net_type);
        if (this.params.net_type === "coco-ssd") {
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2");
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd");
            console.log("CanvasObjects loading mobilenet_v2 ....");
            this.net = {
                model: await cocoSsd.load({ base: "mobilenet_v2" }),
                max_detected_objects: this.params.max_detected_objects,
                detect: async function (imageData) {
                    return await this.model.detect(imageData, this.max_detected_objects);
                },
            };
            console.log("CanvasObjects load complete ", this.net);
        } else if (this.params.net_type.startsWith("yolox")) {
            await this.load_script("https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js");
            // await this.load_script("libs_backup/onnxruntime/ort.min.js");
            console.log("CanvasObjects loading onnx javascript runtime");

            const [mtype, w, h, cls] = this.params.net_type.slice("yolox".length + 1).split("_");
            // console.log(this.params.net_type)
            // console.log(mtype,w,h,cls);

            const model_file = `./object_detection_models/yolox_${[mtype, "inp", "3", w, h, cls].join("_")}.onnx`;
            console.log(`loading ${model_file}`)
            const wh = [w, h].map(e => Number(e));
            this._class_labels = this[`_${cls}_class_labels`];
            // this._class_labels = cls === "coco" ? this._coco_class_labels : this._basketball_class_labels;

            this.net = {
                model: await ort.InferenceSession.create(model_file),
                object: this,
                detect: async function (imageData) {
                    // console.log(this.model);
                    const [img_float32, dst2src] = this.object._resized_copy_to(imageData, new Float32Array(wh[0] * wh[1] * 3), ...wh);
                    const tensor = new ort.Tensor("float32", img_float32, [1, 3, wh[1], wh[0]]);
                    const image_shape = this.model.inputNames?.[1] === "image_shape" ?
                        { image_shape: new ort.Tensor("float32", new Float32Array([wh[1], wh[0]]), [1, 2]) } : {};
                    const results = await this.model.run({ [this.model.inputNames[0]]: tensor, ...image_shape });


                    if ("dets" in results) {
                        return [...Array(results.dets.dims[1]).keys()].
                            filter(e => results.dets.data[e * 5 + 4] >= this.object.params.min_accuracy).
                            map(e => {
                                const [x, y] = [results.dets.data[e * 5 + 0], results.dets.data[e * 5 + 1]];
                                const [w, h] = [results.dets.data[e * 5 + 2] - x, results.dets.data[e * 5 + 3] - y];
                                return { bbox: [...[x, y].map(dst2src), w, h], class: "bike" };
                            });
                    } else if ("modelOutput" in results) {
                        return this.object._yolox_postprocess(results.modelOutput, this.object.params.min_accuracy, this.object.params.max_iou).map(e =>
                            ({ bbox: [...[e.bbox[0], e.bbox[1]].map(dst2src), e.bbox[2], e.bbox[3]], class: e.class }));

                    }
                    return undefined;
                }
            };
        } else {
            console.log(`net_type(${this.params.net_type}) is unknown`);
        }
    },
    recognize: async function (data) {
        if (this.net === undefined) {
            return;
        }
        this._canvas_wh = data.canvas_wh;
        this._predictions = await this.net.detect(data.imageData);
    },
    output: async function (ctx) {
        if (this._predictions === undefined) {
            return;
        }
        ctx.lineWidth = 2;
        ctx.font = "24px serif";
        this._predictions.forEach(obj => {
            // ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.strokeStyle = this._pallet.color(obj.class);
            ctx.strokeRect(...obj.bbox);
            // ctx.fillStyle = "rgba(0,0,255,1)";
            ctx.fillStyle = this._pallet.color(obj.class);
            ctx.fillText(obj.class, obj.bbox[0], obj.bbox[1]);

            ctx.beginPath();
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.ellipse(...this.object2pt(obj), 3, 2, 0, 0, 2 * Math.PI);
            ctx.fill();
        });

        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.font = "24px serif";
        ctx.fillText("objects:" + this._predictions.length, this._canvas_wh[0] - 120, 82);
    },
    // color pallet (original https://github.com/nagix/chartjs-plugin-colorschemes/blob/master/src/colorschemes/colorschemes.brewer.js)
    _pallet: {
        _brewer_aired12: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        _classLabel_palletIdx: {},
        color: function (class_label) {
            const pallet_index = this._classLabel_palletIdx[class_label] ?? Object.keys(this._classLabel_palletIdx).length % this._brewer_aired12.length;
            this._classLabel_palletIdx[class_label] = pallet_index;
            return this._brewer_aired12[pallet_index];
        },
    },
    // ms-coco 80 class labels
    _coco_class_labels: [
        "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "trafficlight",
        "firehydrant", "stopsign", "parkingmeter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
        "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
        "skis", "snowboard", "sportsball", "kite", "baseballbat", "baseballglove", "skateboard", "surfboard", "tennisracket", "bottle",
        "wineglass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
        "broccoli", "carrot", "hotdog", "pizza", "donut", "cake", "chair", "couch", "pottedplant", "bed",
        "diningtable", "toilet", "tv", "laptop", "mouse", "remote", "keyboard", "cellphone", "microwave", "oven",
        "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors", "teddybear", "hairdrier", "toothbrush",
    ],
    _basketball_class_labels: [
        // "ball","mopper","a","b","referee",
        "a", "b", "r",
    ],
    _dice_class_labels: [
        // "ball","mopper","a","b","referee",
        "1", "2", "3", "4", "5", "6",
    ],
    _class_labels: undefined,
    _yolox_postprocess: function (modelOutput, conf_thre = 0.7, nms_thre = 0.45) {
        // console.log(modelOutput);
        // console.log(modelOutput.dims)
        const num_cands = modelOutput.dims[1]; // 出力候補数
        const num_vals = modelOutput.dims[2];  // 1つの出力候補の要素数
        // const num_classes = num_vals - 5; // 5 means bbox 4, obj conf 1
        const indices = [...Array(num_cands).keys()];
        // max class score and index [[class pred,class label index],....]
        const class_preds = indices.map(
            i => modelOutput.data.slice(i * num_vals + 5, (i + 1) * num_vals).reduce((a, e, i) => a[0] >= e ? a : [e, i], [0, -1])
        );
        // [{class_pred,obj_pred,class_index,class_obj_pred},...]
        const class_obj_preds = class_preds.map(
            (e, i) => ({ class_pred: e[0], obj_pred: modelOutput.data[i * num_vals + 4], class_index: e[1], class_obj_pred: modelOutput.data[i * num_vals + 4] * e[0] })
        );
        // console.log(class_obj_preds);
        const detected_indices = indices.filter(i => class_obj_preds[i].class_obj_pred >= conf_thre)
            .sort((i0, i1) => class_obj_preds[i1].class_obj_pred - class_obj_preds[i0].class_obj_pred)
        // console.log(detected_indices);


        const _iou = (b0, b1) => {
            // console.log(b0);
            // console.log(b1);
            const [c0, c1] = [b0, b1].map(b => [b[0] - b[2] / 2, b[1] - b[3] / 2, b[0] + b[2] / 2, b[1] + b[3] / 2]);
            const intersect = Math.max(0, Math.min(c0[2], c1[2]) - Math.max(c0[0], c1[0])) *
                Math.max(0, Math.min(c0[3], c1[3]) - Math.max(c0[1], c1[1]));
            const union = [b0, b1].map(e => e[2] * e[3]).reduce((a, e) => a + e) - intersect;
            // console.log(union, intersect);
            return intersect / union;
        }

        const nms_out_indices = [];
        let open_indices = [...detected_indices];
        while (open_indices.length > 0) {
            nms_out_indices.push(open_indices.shift());
            const i0 = nms_out_indices[nms_out_indices.length - 1];
            const cls_index0 = class_obj_preds[i0].class_index;
            const bbox0 = modelOutput.data.slice(i0 * num_vals, i0 * num_vals + 4);
            open_indices = open_indices.filter(i1 => /*cls_index0 !== class_obj_preds[i1].class_index ||*/ _iou(bbox0, modelOutput.data.slice(i1 * num_vals, i1 * num_vals + 4)) < nms_thre);
        }

        return nms_out_indices.map(i => ({
            bbox: [
                modelOutput.data[i * num_vals + 0] - modelOutput.data[i * num_vals + 2] / 2,
                modelOutput.data[i * num_vals + 1] - modelOutput.data[i * num_vals + 3] / 2,
                modelOutput.data[i * num_vals + 2],
                modelOutput.data[i * num_vals + 3],
            ],
            class: this._class_labels?.[class_obj_preds[i].class_index],
        }));
    },
};
