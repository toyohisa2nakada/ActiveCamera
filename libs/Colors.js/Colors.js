// color変換チェック用に使用したサイト
// https://syncer.jp/color-converter
//
// lab変換で参考にしたサイト
// https://qiita.com/lookman/items/a0df0833d2ee07b8eccc

const Colors = {
    // labからrgbへの変換、入力は 0<=l<=1, -0.86<=a<=0.98, -1.07 <= b <= 0.94、出力はrgbの割合の値
    lab2rgb: function (l, a, b) {
        return this.xyz2rgb(...this.lab2xyz(l, a, b));
    },
    lab2xyz: function (l, a, b) {
        [l, a, b] = [l, a, b].map(e => e * 100);
        const y = (l + 16) / 116;
        const x = y + a / 500;
        const z = y - b / 200;

        // d65光源
        const wp = [95.047, 100, 108.883];

        return [x, y, z].map((v, i) => v > 0.206897 ? Math.pow(v, 3) : (v - 0.206897) / 7.787037).map((v, i) => v * wp[i] / 100);
    },
    xyz2rgb: function (x, y, z) {
        const pr = 3.240970 * x - 1.537383 * y - z * 0.498611;
        const pg = -0.969244 * x + 1.875968 * y + z * 0.041555;
        const pb = 0.055630 * x - 0.203977 * y + z * 1.056972;
        return [pr, pg, pb].map(v => (v <= 0.0031308) ? (v * 12.92) : (1.055 * Math.pow(v, 1 / 2.4) - 0.055));
    },
    // rgbからlabへの変換、入力は割合の値、出力は 0<=l<=1, -0.86<=a<=0.98, -1.07 <= b <= 0.94
    rgb2lab: function (pr, pg, pb) {
        return this.xyz2lab(...this.rgb2xyz(pr, pg, pb));
    },
    rgb2xyz: function (pr, pg, pb) {
        // sRGB to linear RGB
        [pr, pg, pb] = [pr, pg, pb].map(v => (v <= 0.040450) ? (v / 12.92) : Math.pow((v + 0.055) / 1.055, 2.4));
        const x = 0.412391 * pr + 0.357584 * pg + 0.180481 * pb;
        const y = 0.212639 * pr + 0.715169 * pg + 0.072192 * pb;
        const z = 0.019331 * pr + 0.119195 * pg + 0.950532 * pb;
        return [x, y, z];
    },
    xyz2lab: function (x, y, z) {
        const wp = [95.047, 100, 108.883];
        [x, y, z] = [x, y, z].map((v, i) => v * 100 / wp[i]).map((v, i) => v > 0.008856 ? Math.pow(v, 1 / 3) : (7.787037 * v) + 0.008856);
        const l = (116 * y) - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b].map(v => v / 100);
    },



    // hsvからrgbへの変換、入力は割合の値
    // 0 <= h,s,v <= 1.0
    hsv2rgb: function (ph, ps, pv) {
        //https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

        const c = pv * ps;
        const hp = Math.min(6, Math.max(0, ph * 6));
        const x = c * (1 - Math.abs(hp % 2 - 1));

        const rgb0 = [
            [c, x, 0],
            [x, c, 0],
            [0, c, x],
            [0, x, c],
            [x, 0, c],
            [c, 0, x],
        ][Math.floor(hp) % 6];

        let m = pv - c;
        return rgb0.map(e => e + m);
    },
    // hsv用の割合値から値への変換
    hsv_p2v: function (ph, ps, pv) {
        return [360 * ph, ps * 100, ps * 100];
    },
    // hsv用の値から割合値への変換
    hsv_v2p: function (h, s, v) {
        return [h / 360, s / 100, v / 100];
    },

    // rgbからhsvへの変換、入力は割合の値
    // 0 <= r,g,v <= 1.0
    rgb2hsv: function (pr, pg, pb) {
        const p_rgb = [pr, pg, pb].map((e, i) => ({ i: i, v: e }));
        const max = p_rgb.reduce((a, e) => a.v >= e.v ? a : e);
        const min = p_rgb.reduce((a, e) => a.v <= e.v ? a : e);
        const diff = max.v - min.v;


        const h = max.v === min.v ? 0 :
            [
                // (60 * ((pb - pg) / diff)) + 180,
                // (60 * ((pr - pb) / diff)) + 300,
                // (60 * ((pg - pr) / diff)) + 60,
                ((pb - pg) / (diff * 6)) + 180 / 360,
                ((pr - pb) / (diff * 6)) + 300 / 360,
                ((pg - pr) / (diff * 6)) + 60 / 360,
            ][min.i];
        // console.log(rgb, max, min, diff, h);
        const s = max.v === 0 ? 0 : diff / max.v;
        const v = max.v;
        return [h, s, v];
    },
    // rgb用の割合値から値への変換
    rgb_p2v: function (pr, pg, pb) {
        return [pr, pg, pb].map(e => e * 255);
    },
    // rgb用の割合値から値の文字列へ変換
    rgb_p2s: function (pr, pg, pb) {
        return "rgb(" + this.rgb_p2v(pr, pg, pb).join(",") + ")";
    },
    // rgb用の割合値から値の文字列へ変換
    rgb_p2sa: function (pr, pg, pb, a) {
        return "rgba(" + [...this.rgb_p2v(pr, pg, pb), a].join(",") + ")";
    },
    // rgb用の値から割合値への変換
    rgb_v2p: function (r, g, b) {
        return [r, g, b].map(e => e / 255);
    },

    // できるだけ識別し易い色セットの取得
    getColors: function (n, pstart = 0, pend = 2 * Math.PI) {
        const d = (pend - pstart) / Math.PI / 2 / n;
        return Array.from(Array(n), (e, i) => this.rgb_p2v(...this.hsv2rgb(pstart + d * i, 1 - (i % 3) * 0.1, 1 - (i % 2) * 0.3)));
    },
};
