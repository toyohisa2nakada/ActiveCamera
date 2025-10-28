/*
 認識画面をクリックすると、その位置をviewpoint factorとして出力する。
*/
export const TestCanvasViewpoint = {

    pt: undefined,
    wh: undefined,

    init: async function (canvas) {
        canvas.addEventListener("click",e => {
            this.pt = [e.offsetX, e.offsetY];
        })
        this.pt = [canvas.width/2,canvas.height/2];
        this.wh = [canvas.width,canvas.height];
    },
    output: async function (ctx) {
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.beginPath();
        ctx.ellipse(...this.pt, 10, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
    },
    recognize: async function (data) {
    },
    get_viewpoint_factors: async function () {
        // return [this.pt,[0,0],this.wh].map(e=>[...e,1]);
        // console.log(`TestCanvasViewpoint:${this.pt}`);
        const weight = 100;
        return [this.pt,this.pt.map(e=>e+10),this.pt.map(e=>e-10)].map(e=>[...e,weight]);
    }
};
