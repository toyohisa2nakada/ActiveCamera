/*

絵を描きたいスクリーンまたはディスプレイに
基準になる画像を用意しておく。

パソコン上で例えば回転させた画像
カメラで撮影した画像

Qiita: 2つの画像の特徴点を抽出してマッチングする。
https://qiita.com/Quramy/items/5edf1318979b1f165a5a

*/
export const CanvasScreenPainter_akaze = {
    params: {
        module_name: "CanvasScreenPainter_akaze",

        distance_ratio: 0.9,
        image_width: 640,

        // paramsの値はlil guiから変更されるので、とくに変更時に行う特別の処理はここでは要らない。
        // onChanges: {
        //     distance_ratio: function(e){
        //     },
        // },
        names: {
            distance_ratio: "2つの画像の特徴点類似性の距離",
            image_width: "特徴点抽出のための画像横幅",
        },
        details: {
            distance_ratio: "distanceのratioをよく分かっていないので、この詳細説明は後で記述する",
            image_width: "特徴点を抽出する画像をこの横幅に統一して変換する。縦は元画像のアスペクト比を保つ",
        },

        disables: [
            "module_name",
        ],
        hiddens: [
            "module_name",
        ],
    },

    _VideoImage: undefined,
    _akaze_ret0: undefined,
    _akaze_ret: undefined,
    _matcher_ret: undefined,
    recognize_canvas_wh: undefined,

    _load_script: function (fname) {
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
        const webcamera_path = "../../webcamera/";
        if (typeof cv === "undefined") {
            await this._load_script(`${webcamera_path}opencv.4.9.0.js`);
            await new Promise(resolve => {
                cv["onRuntimeInitialized"] = () => { resolve(); };
            });
        }
        this._VideoImage = (await import(`${webcamera_path}VideoImage.mjs`)).VideoImage;
        
        const blob = await (await fetch("tried/screen_painter/QRパターン01.png")).blob();
        // const blob = await (await fetch("tried/screen_painter/akaze_fruits.jpg")).blob();
        // const blob = await (await fetch("tried/screen_painter/akaze_sample_photo_by_rogphone.jpg")).blob();
        const img = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
        this._akaze_ret0 = this._akaze({ image: img });
        console.log(cv);

        // スマホでこのアプリを起動したときに、スマホ撮影画像の中心位置を固定画像の同じ位置にアフィン変換した
        // ものをwebsocketで送り続ける。コメントアウトするとwebsocket通信は行わない。
        //
        // this._comm_client = (await import("../../CommClient.mjs")).CommClient;
        // this._comm_client.params.avaiable = true;
        // this._comm_client.init(`CanvasScreenPainter_akaze`, {
        //     server_cmd: e => {
        //         if (e.type === "opened") {
        //             this._comm_client.send({ cmd: "set_type", type: "camera", data: "opened" });
        //         }
        //     },
        //     text: e => { },
        // });
    },
    _akaze: function ({ imageData, image, output_mat, mask }) {
        if (imageData === undefined && image === undefined) {
            return;
        }
        const to_delete = [];

        const raw = imageData !== undefined ? cv.matFromImageData(imageData)
            : cv.imread(image);
        to_delete.push(raw);
        const aspect_ratio = raw.rows / raw.cols;
        const raw0 = new cv.Mat();
        cv.resize(raw, raw0, new cv.Size(this.params.image_width, this.params.image_width * aspect_ratio)
            , 0, 0, cv.INTER_AREA);
        to_delete.push(raw0);

        const raw1 = new cv.Mat();
        to_delete.push(raw1);

        cv.cvtColor(raw0, raw1, cv.COLOR_RGBA2RGB, 0);

        mask = mask === undefined
            ? (to_delete.push(new cv.Mat()) && to_delete[to_delete.length - 1])
            : mask;

        const [kp, dst] = [new cv.KeyPointVector(), new cv.Mat()];
        to_delete.push(kp, dst);
        const akaze = new cv.AKAZE();
        to_delete.push(akaze);
        // 入力画像、入力のマスク、特徴点を格納するMat、特徴量(記述子)を格納するMat、
        // 最後の引数はfalseだとスケールと方向を考慮しない、らしいがtrueだと特徴点を全然検出しない。
        akaze.detectAndCompute(raw1, mask, kp, dst, false);

        output_mat ??= new cv.Mat();
        cv.drawKeypoints(raw0, kp, output_mat);

        return {
            output_mat, raw0, kp, dst, mask
            , to_delete: () => to_delete.forEach(e => e.delete())
        };
    },
    _matcher: function ({ img1, kp1, dst1, img2, kp2, dst2, mask }) {
        const to_delete = [];

        const matches = new cv.DMatchVectorVector();
        to_delete.push(matches);
        const bf = new cv.BFMatcher(2, false);
        to_delete.push(bf);
        bf.knnMatch(dst1, dst2, matches, 2, mask, false);

        const good_matches = new cv.DMatchVectorVector();
        to_delete.push(good_matches);
        for (let i = 0; i < matches.size(); i += 1) {
            const [m, n] = [matches.get(i).get(0), matches.get(i).get(1)];
            if (m?.distance < this.params.distance_ratio * n?.distance) {
                const v = new cv.DMatchVector();
                v.push_back(m);
                good_matches.push_back(v);
            }
        }

        // drawMatchesKnnの前に出力を保存するMatを固定値で初期化してから関数に渡すテスト
        // ただこれでも、出力画像の右下の画像がない部分はなぜか前のCanvasに描画したデータが残ってしまう。
        // 何かしらのキャッシュが効いている？
        // const matching_image = new cv.Mat(Math.max(img1.rows, img2.rows), img1.cols + img2.cols, img1.type(), new cv.Scalar(127, 0, 0, 255));
        const matching_image = new cv.Mat();
        to_delete.push(matching_image);
        cv.drawMatchesKnn(img1, kp1, img2, kp2, good_matches, matching_image);

        // アフィン変換行列を求める。
        let affine_matrix = undefined;
        if (good_matches.size() >= 3) {
            const src_points = new cv.Mat(good_matches.size(), 2, cv.CV_32FC1);
            const dst_points = new cv.Mat(good_matches.size(), 2, cv.CV_32FC1);
            to_delete.push(src_points, dst_points);
            for (let i = 0; i < good_matches.size(); i += 1) {
                const src_index = good_matches.get(i).get(0).trainIdx;
                const dst_index = good_matches.get(i).get(0).queryIdx;
                src_points.data32F[i * 2] = kp2.get(src_index).pt.x;
                src_points.data32F[i * 2 + 1] = kp2.get(src_index).pt.y;
                dst_points.data32F[i * 2] = kp1.get(dst_index).pt.x;
                dst_points.data32F[i * 2 + 1] = kp1.get(dst_index).pt.y;
            }
            affine_matrix = cv.estimateAffine2D(src_points, dst_points);
            to_delete.push(affine_matrix);
        }

        return {
            matching_image
            , affine_matrix
            , to_delete: () => to_delete.forEach(e => e.delete())
        }

    },
    recognize: async function (data) {
        this.recognize_canvas_wh = data.canvas_wh;

        this._akaze_ret = this._akaze({
            imageData: data.imageData
            , output_mat: this._akaze_ret?.output_mat
            , mask: this._akaze_ret0.mask
        });
        this._matcher_ret = this._matcher({
            img1: this._akaze_ret0.raw0
            , kp1: this._akaze_ret0.kp
            , dst1: this._akaze_ret0.dst

            , img2: this._akaze_ret.raw0
            , kp2: this._akaze_ret.kp
            , dst2: this._akaze_ret.dst

            , mask: this._akaze_ret0.mask
        });

    },
    output: async function (ctx) {
        const { output_mat } = this._akaze_ret;
        const { matching_image, affine_matrix } = this._matcher_ret;
        const { recognize_canvas_wh } = this;

        const drawing_ratio = Math.min(recognize_canvas_wh[0] / matching_image.cols, recognize_canvas_wh[1] / matching_image.rows);

        ctx.putImageData(
            this._VideoImage.resize(
                new ImageData(
                    new Uint8ClampedArray(matching_image.data)
                    , matching_image.cols
                    , matching_image.rows
                )
                , [matching_image.cols, matching_image.rows].map(e => e * drawing_ratio)
            )
            , 0, 0);

        const circles = [recognize_canvas_wh.map(e => e / 2)];
        const circle_radius = 10;
        ctx.fillStyle = "red";

        circles.map(c => [c[0] + this._akaze_ret0.raw0.cols, c[1]].map(e => e * drawing_ratio)).forEach(c => {
            ctx.beginPath();
            ctx.arc(...c, circle_radius, 0, 2 * Math.PI);
            ctx.fill();
        });

        const to_delete = [];
        if (affine_matrix !== undefined) {
            const circles1 = circles.map(e => {
                const m = new cv.matFromArray(3, 1, cv.CV_64FC1, [...e, 1]);
                to_delete.push(m);
                const x = affine_matrix.data64F[0] * m.data64F[0]
                    + affine_matrix.data64F[1] * m.data64F[1]
                    + affine_matrix.data64F[2] * m.data64F[2];
                const y = affine_matrix.data64F[3] * m.data64F[0]
                    + affine_matrix.data64F[4] * m.data64F[1]
                    + affine_matrix.data64F[5] * m.data64F[2];
                return [x, y].map(Math.round);
            });
            circles1.map(c => c.map(e => e * drawing_ratio)).forEach(c => {
                ctx.beginPath();
                ctx.arc(...c, circle_radius, 0, 2 * Math.PI);
                ctx.fill();
            });

            this._comm_client?.send({
                cmd: "text",
                to_id: "akaze_receiver",
                data: `[${circles1[0][0]},${circles1[0][1]}]`,
            });
        }

        this._akaze_ret.to_delete();
        this._matcher_ret.to_delete();
        to_delete.forEach(e => e.delete());

    },
};
