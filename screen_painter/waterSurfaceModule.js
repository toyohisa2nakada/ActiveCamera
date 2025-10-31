// water-surface-canvas.js
class WaterSurfaceCanvas extends HTMLElement {
    constructor() {
        super();
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });

        // 波紋データ（2つのバッファ）
        this._rippleMap = null;
        this._currentBuffer = 0;


        // マウス位置
        this._mouseX = -1;
        this._mouseY = -1;

        // 元画像のピクセルデータ
        this._originalImageData = null;

        // アニメーションフレームID
        this._animationId = null;

        // 描画用の内部キャンバス
        this._internalCanvas = document.createElement('canvas');
        this._internalCtx = this._internalCanvas.getContext('2d', { willReadFrequently: true });

        // this._init();
    }

    connectedCallback() {
        // this.appendChild(this._canvas);
        // this._setupEventListeners();
        // this._startAnimation();
    }

    disconnectedCallback() {
        this._stopAnimation();
    }

    init({ width = 600, height = 400, damping = 0.85 } = {}) {
        this._width = width;
        this._height = height;

        // 減衰率（粘性を高めて早く落ち着くように）
        this._damping = damping;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._internalCanvas.width = this._width;
        this._internalCanvas.height = this._height;

        // カーソルスタイル
        this._canvas.style.cursor = 'crosshair';

        // 波紋バッファの初期化
        this._rippleMap = Array(2).fill(0).map(() =>
            new Float32Array(this._width * this._height)
        );

        // 初期画像データを作成
        this._updateOriginalImageData();

        // start
        this.appendChild(this._canvas);
        this._setupEventListeners();
        this._startAnimation();
    }

    _updateOriginalImageData() {
        // 内部キャンバスから画像データを取得
        this._originalImageData = this._internalCtx.getImageData(
            0, 0, this._width, this._height
        );
    }

    _setupEventListeners() {
        this._canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
        this._canvas.addEventListener('mouseleave', this._onMouseLeave.bind(this));
        this._canvas.addEventListener('click', this._onClick.bind(this));
    }

    _onMouseMove(e) {
        const rect = this._canvas.getBoundingClientRect();
        this._mouseX = Math.floor(e.clientX - rect.left);
        this._mouseY = Math.floor(e.clientY - rect.top);

        // マウス移動中は波紋を追加（強度を下げて穏やかに）
        this._addRipple(this._mouseX, this._mouseY, 512);
    }

    _onMouseLeave() {
        this._mouseX = -1;
        this._mouseY = -1;
    }

    _onClick(e) {
        const rect = this._canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        this._addRipple(x, y, 768);
    }

    _addRipple(x, y, strength) {
        if (this.userData?.params?.enabled === false) {
            return;
        }
        if (x < 1 || x >= this._width - 1 || y < 1 || y >= this._height - 1) {
            return;
        }

        const current = this._rippleMap[this._currentBuffer];
        const radius = 15;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < this._width && ny >= 0 && ny < this._height) {
                        const index = ny * this._width + nx;
                        const factor = 1 - (dist / radius);
                        current[index] += strength * factor;
                    }
                }
            }
        }
    }

    _updateRipple() {
        const current = this._rippleMap[this._currentBuffer];
        const previous = this._rippleMap[1 - this._currentBuffer];

        for (let y = 1; y < this._height - 1; y++) {
            for (let x = 1; x < this._width - 1; x++) {
                const index = y * this._width + x;

                // 周囲4点の平均から現在値を引いて波を伝播
                const avg = (
                    previous[index - 1] +
                    previous[index + 1] +
                    previous[index - this._width] +
                    previous[index + this._width]
                ) / 2 - current[index];

                current[index] = avg * this._damping;

                if (Math.abs(current[index]) < 0.1) {
                    current[index] = 0;
                }
            }
        }

        this._currentBuffer = 1 - this._currentBuffer;
    }

    _render() {
        if (!this._originalImageData) return;

        const imageData = this._ctx.createImageData(this._width, this._height);
        const current = this._rippleMap[this._currentBuffer];

        for (let y = 1; y < this._height - 1; y++) {
            for (let x = 1; x < this._width - 1; x++) {
                const index = y * this._width + x;

                // 波の勾配を計算
                const dx = current[index + 1] - current[index - 1];
                const dy = current[index + this._width] - current[index - this._width];

                // オフセット量を計算
                const offsetX = Math.floor(dx * 0.5);
                const offsetY = Math.floor(dy * 0.5);

                // 元画像からオフセットした位置のピクセルを取得
                let srcX = x + offsetX;
                let srcY = y + offsetY;

                // 範囲チェック
                srcX = Math.max(0, Math.min(this._width - 1, srcX));
                srcY = Math.max(0, Math.min(this._height - 1, srcY));

                const srcIndex = (srcY * this._width + srcX) * 4;
                const dstIndex = index * 4;

                imageData.data[dstIndex] = this._originalImageData.data[srcIndex];
                imageData.data[dstIndex + 1] = this._originalImageData.data[srcIndex + 1];
                imageData.data[dstIndex + 2] = this._originalImageData.data[srcIndex + 2];
                imageData.data[dstIndex + 3] = 255;
            }
        }

        this._ctx.putImageData(imageData, 0, 0);
    }

    _animate() {
        this._updateRipple();
        this._render();
        this._animationId = requestAnimationFrame(this._animate.bind(this));
    }

    _startAnimation() {
        if (!this._animationId) {
            this._animate();
        }
    }

    _stopAnimation() {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
    }

    set pos(value) {
        if (value.left !== undefined && value.top !== undefined) {
            Object.assign(this._canvas.style,
                { position: "absolute", left: value.left + "px", top: value.top + "px" });
        }
    }
    get pos() {
        const rect = this._canvas.getBoundingClientRect();
        return [rect.left + window.scrollX, rect.top + window.scrollY];
    }

    // パブリックAPI
    set size(value) {
        if (value.width !== undefined) {
            this._width = value.width;
            this._canvas.width = this._width;
            this._internalCanvas.width = this._width;
        }
        if (value.height !== undefined) {
            this._height = value.height;
            this._canvas.height = this._height;
            this._internalCanvas.height = this._height;
        }

        // バッファを再初期化
        this._rippleMap = Array(2).fill(0).map(() =>
            new Float32Array(this._width * this._height)
        );
        this._currentBuffer = 0;

        // 画像データを更新
        this._updateOriginalImageData();
    }

    get size() {
        return {
            width: this._width,
            height: this._height
        };
    }

    // Canvas 2D Contextを返す（描画用）
    getContext(contextType = '2d') {
        if (contextType === '2d') {
            // 描画完了後に自動的に元画像データを更新するラッパーを返す
            const originalCtx = this._internalCtx;
            const self = this;

            return new Proxy(originalCtx, {
                get(target, prop) {
                    const value = target[prop];

                    // 描画メソッドの場合、実行後に画像データを更新
                    if (typeof value === 'function' &&
                        ['drawImage', 'fillRect', 'strokeRect', 'clearRect',
                            'fillText', 'strokeText', 'putImageData',
                            'beginPath', 'moveTo', 'lineTo', 'stroke',
                            'save', 'restore'].includes(prop)) {
                        return function (...args) {
                            const result = value.apply(target, args);
                            self._updateOriginalImageData();
                            return result;
                        };
                    }

                    return value;
                },
                set(target, prop, value) {
                    target[prop] = value;
                    return true;
                }
            });
        }
        return null;
    }

    // 直接キャンバスを取得したい場合
    get canvas() {
        return this._canvas;
    }

    // 減衰率を設定
    set damping(value) {
        this._damping = value;
    }

    get damping() {
        return this._damping;
    }
}

// カスタムエレメントとして登録
customElements.define('water-surface-canvas', WaterSurfaceCanvas);
export default WaterSurfaceCanvas;