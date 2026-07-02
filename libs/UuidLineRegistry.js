export class UuidLineRegistry {
    constructor({ ctx, lineWidth = 1 } = {}) {
        if (!ctx) {
            throw new Error("ctx is required");
        }
        this._ctx = ctx;
        this._lineWidth = lineWidth;
        this._activePoints = new Map();
    }

    add({ uuid, x, y, color }) {
        if (!uuid) {
            throw new Error("uuid is required");
        }
        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("x and y must be numbers");
        }
        if (!color) {
            throw new Error("color is required");
        }

        const ctx = this._ctx;
        const previous = this._activePoints.get(uuid);
        if (!previous) {
            this._activePoints.set(uuid, { x, y });
            return;
        }

        ctx.save();
        ctx.lineWidth = this._lineWidth;
        ctx.strokeStyle = color;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();

        this._activePoints.set(uuid, { x, y });
    }

    end({ uuid }) {
        if (!uuid) {
            throw new Error("uuid is required");
        }
        this._activePoints.delete(uuid);
    }
}
