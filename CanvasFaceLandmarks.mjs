/*
 tensorflowの顔のランドマークの検出

 2022.05.14時点で、以下の2つの情報のうち、これまで動作していたblogの方でも動作せず。
 上のURLの元の情報から、このモジュールは再度構築し直す必要がある。
 
 たくさんのランドマークを取る以下のモデルは、1つ目のURLのでは実行できず、2つ目のblogの方で動作する。face landmarks
 https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
 https://blog.tensorflow.org/2020/11/iris-landmark-tracking-in-browser-with-MediaPipe-and-TensorFlowJS.html

 シンプルな以下のモデルは実行できる。 blazeface
 https://github.com/tensorflow/tfjs-models/tree/master/blazeface
*/
export const CanvasFaceLandmarks = {
    params: {
        module_name: "CanvasFaceLandmarks",
        take_photo: false,
        display_landmarks: false,
        display_border: true,
        image_scale: 1.2,
        image_square: false,

        onChanges: {
            take_photo: function (e) {
                if (e) {
                    this.object.data.save_flag = true;
                    this.take_photo = false;
                }
            },
        },
        names: {
            take_photo: "顔領域を画像として保存 (p)",
            display_landmarks: "ランドマーク表示",
            display_border: "顔の枠表示",
            image_scale: "顔枠の拡大率",
            image_square: "顔枠を正方形にする",
        },
        details: {
            take_photo: "認識されている顔の領域のうち最大のものを画像として保存します。認識されている顔が無い場合は、何も保存されません。",
            display_landmarks: "認識結果の顔のランドマークを描画する。",
            display_border: "顔の枠を描画する。",
            image_scale: "元の顔の枠に対してどの程度大きく（または小さく）表示するかを決定します。例えば1.2とすると元の顔の枠に対して120%の大きさの領域で表示されます。",
            image_square: "顔枠の短いほうの辺の長さを長い方と同じにして正方形にします。",
        },
        disables: [
            "module_name",
        ],
    },
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
    on_keydown: function (e) {
        if (e.key === "p") {
            this.data.save_flag = true;
        }else if(e.key === "o"){
            this.data.send_flag = true;
        }
    },
    get_face_canvas: function (ctx, face) {
        console.log("take photo " + face);
        const r = this.bb2rect(face.boundingBox, this.params.image_scale, this.params.image_square);
        const imgData = ctx.getImageData(...r);
        const canvas = [
            document.createElement("canvas"),
            e => e.width = imgData.width,
            e => e.height = imgData.height,
        ].a2e();
        canvas.getContext("2d").putImageData(imgData, 0, 0);
        return canvas;
    },
    download_imageData: function (canvas, filename) {
        [
            document.createElement("a"),
            e => e.href = canvas.toDataURL("image/png"),
            e => e.download = filename,
        ].a2e().click();
    },
    send_face_to_emotion_server: function (canvas) {
        if (this.client.ws === undefined) {
            this.client.ws = new WebSocket(this.client.url);
            this.client.ws.addEventListener("message", e => {
                this.recv_emotions(e);
            });
            this.client.ws.addEventListener("open",e=>{
                this.client.ws.send(canvas.toDataURL("image/png"));
            });
        }else{
            this.client.ws.send(canvas.toDataURL("image/png"));
        }
    },
    recv_emotions: function (emotions) {
        console.log("recv_emotions", emotions);
    },
    init: async function (canvas) {
        if (this.model === undefined) {
            // tensorflow.js の webassembly backend については https://blog.tensorflow.org/2020/03/introducing-webassembly-backend-for-tensorflow-js.html
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js");
            await tf.setBackend("wasm");

            // facemeshを読み込むときに参考にしたサイト https://www.npmjs.com/package/@tensorflow-models/facemesh
            await this.load_script("https://cdn.jsdelivr.net/npm/@tensorflow-models/facemesh");

            this.model = await facemesh.load();
            console.log(this.model);

            ["keydown"].forEach(e => {
                const ef = `on_${e}`;
                const _ef = `_${ef}`;
                this[_ef] ??= (ei) => { this[ef](ei); };
                const elem = (e.includes("key") ? document.body : canvas);
                elem.removeEventListener(e, this[_ef]);
                elem.addEventListener(e, this[_ef]);
            });
        }
    },
    recognize: async function (data) {
        this.data.faces = await this.model.estimateFaces(data.canvas);
        if (this.data.save_flag || this.data.send_flag) {
            // 面積を求める
            const ar = (bb) => {
                if (bb === undefined) {
                    return 0;
                }
                const r = this.bb2rect(bb);
                return r[2] * r[3];
            }
            // 最大面積の顔を求める。顔の認識結果が存在しない場合は、undefinedが返る。
            const face = this.data.faces?.reduce((a, e) => {
                return ar(a?.boundingBox) >= ar(e?.boundingBox) ? a : e;
            }, undefined);
            if (face !== undefined) {
                const canvas = this.get_face_canvas(data.canvas.getContext("2d"), face);
                if(this.data.save_flag){
                    this.download_imageData(canvas, "face.png");
                }else if(this.data.send_flag){
                    this.send_face_to_emotion_server(canvas);
                }
            }
            this.data.save_flag = false;
            this.data.send_flag = false;
        }
    },
    bb2rect: function (bb, scale = 1.0, square = false) {
        const r0 = [...bb.topLeft, bb.bottomRight[0] - bb.topLeft[0], bb.bottomRight[1] - bb.topLeft[1]];
        const s = (scale - 1.0);
        const sp_wh = r0.slice(2).map(e => e * s);
        const r1 = [r0[0] - sp_wh[0] / 2, r0[1] - sp_wh[1] / 2, r0[2] + sp_wh[0], r0[3] + sp_wh[1]];
        if (square) {
            // 大きいほう、小さいほうの順番
            const idcs = r1[2] >= r1[3] ? [0, 1] : [1, 0];
            // 小さいほうに足される数値
            const sp = r1[2 + idcs[0]] - r1[2 + idcs[1]];
            // 大きいほうは変わらず
            r1[idcs[0]] = r1[idcs[0]]
            r1[idcs[0] + 2] = r1[idcs[0] + 2]
            // 小さいほうは大きくする
            r1[idcs[1]] = r1[idcs[1]] - sp / 2;
            r1[idcs[1] + 2] = r1[idcs[1] + 2] + sp;
        }
        return r1;
    },
    output: async function (ctx) {
        ctx.fillStyle = "rgba(0,128,255,0.5)";
        this.data.faces?.forEach(e => {
            if (this.params.display_landmarks) {
                e.scaledMesh.forEach(e => {
                    ctx.beginPath();
                    ctx.arc(...e.slice(0, 2), 3, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
            if (this.params.display_border) {
                ctx.strokeRect(...this.bb2rect(e.boundingBox, this.params.image_scale, this.params.image_square));
            }
        });
    },

    data: {
        faces: undefined,
        save_flag: false,
        send_flag: false,
        saved_face_imageData: undefined,
    },
    client: {
        url: "ws://172.17.133.187:40450",
        ws: undefined,
    },

};
