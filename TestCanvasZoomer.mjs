/*
 認識画面をクリックすると、その位置をviewpoint factorとして出力する。
*/
export const TestCanvasZoomer = {
    params: {
        module_name: "TestCanvasZoomer",

        names: {
        },
        details: {
        },

        disables: [
            "module_name",
        ],
        hiddens: [
            "module_name",
        ],
    },
    _ev_remover: undefined,
    _viewpoint_element: undefined,

    _wheel_handler: function (ev) {
        const params = {
            pin: [ev.offsetX, ev.offsetY],
            d_magnifications: [...Array(2).keys()].map(_ => (-ev.deltaY+1000)/1000),
        };
        // console.log("wheel", ev.offsetY, ev.deltaY, params);
        this._viewpoint_element.elem.userData.wrapped_canvas_info.set_zoom(params);
        ev.preventDefault();
    },

    init: async function () {
    },
    // 登録済みのリスナーを登録解除するためのメソッド
    // この関数を使ってイベントリスナーを登録すると、イベントは
    // recognition canvasの上で発生したように見える。
    get_ev_handlers: function (remover) {
// return undefined;
        this._ev_remover = remover;
        let prev_delta = undefined;
        const handler = (name, ev) => {
            if (name === "tap") {
                // console.log(name, ev)
                this._viewpoint_element.elem.userData.wrapped_canvas_info.set_zoom({
                    pin: ev.userData.center0,
                    d_magnifications: [2, 2],
                });
                prev_delta = undefined;
            } else if (name === "panstart") {
                prev_delta = undefined;
            } else if (name === "panmove") {
                this._viewpoint_element.elem.userData.wrapped_canvas_info.set_lt({
                    d_lt: ev.userData.delta0.map((e, i) => e - (prev_delta?.[i] ?? 0)),
                });
                prev_delta = ev.userData.delta0;
            }
        };
        return ["tap", "panstart", "panmove", "panend"].map(
            evname => [evname, ev => handler(evname, ev)]
        );
    },
    set_viewpoint_element: function (canvas, ctx, wh) {
        // 描画用canvasの諸データ保存
        this._viewpoint_element = {
            elem: canvas, ctx,
            wh,
        };
        // 既に登録済みのhanlderを削除して新たにイベントリスナーを登録する。
        this._ev_remover?.({ reset: false });

        canvas.removeEventListener("wheel", this._wheel_handler);
        canvas.addEventListener("wheel", this._wheel_handler.bind(this));
    },
    update_viewpoint: function (factors, dt, effective_pixels) {
    },
};
