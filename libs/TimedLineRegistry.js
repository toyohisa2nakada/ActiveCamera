export class TimedLineRegistry {
    constructor({ ctx, life_ms = 1000, lineWidth = 4 } = {}) {
        this._ctx = ctx;
        this.lineWidth = lineWidth;
        this.life_ms = life_ms;
        this._linesByColor = new Map();
        this._active = new Map();
    }

    begin(x, y, color, timestamp = Date.now()) {
        if (!color) {
            throw new Error("color is required");
        }
        const line = { points: [{ x, y, t: timestamp }] };
        if (!this._linesByColor.has(color)) {
            this._linesByColor.set(color, []);
        }
        this._linesByColor.get(color).push(line);
        this._active.set(color, line);
        this._removeExpired(timestamp);
    }

    add(x, y, color, timestamp = Date.now()) {
        if (!color) {
            throw new Error("color is required");
        }
        let line = this._active.get(color);
        if (!line) {
            this.begin(x, y, color, timestamp);
            return;
        }
        const last = line.points[line.points.length - 1];
        if (!last || last.x !== x || last.y !== y) {
            line.points.push({ x, y, t: timestamp });
        } else {
            last.t = timestamp;
        }
        this._removeExpired(timestamp);
    }

    end(color, timestamp = Date.now()) {
        if (!color) {
            throw new Error("color is required");
        }
        this._active.delete(color);
        this._removeExpired(timestamp);
    }

    draw(ctx = this._ctx, timestamp = Date.now()) {
        if (!ctx) {
            throw new Error("A CanvasRenderingContext2D is required for drawing");
        }
        this._removeExpired(timestamp);
        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = this.lineWidth;
        for (const [color, lines] of this._linesByColor.entries()) {
            ctx.strokeStyle = color;
            for (const line of lines) {
                if (line.points.length < 2) {
                    continue;
                }
                ctx.beginPath();
                ctx.moveTo(line.points[0].x, line.points[0].y);
                for (let i = 1; i < line.points.length; i++) {
                    ctx.lineTo(line.points[i].x, line.points[i].y);
                }
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    countLines() {
        let count = 0;
        this._linesByColor.entries().forEach(([_, lines]) => count += lines.length);
        return count;
    }

    _removeExpired(timestamp = Date.now()) {
        const life = this.life_ms;
        if (life === Infinity) {
            return;
        }
        for (const [color, lines] of this._linesByColor.entries()) {
            for (let i = lines.length - 1; i >= 0; i--) {
                const line = lines[i];
                while (line.points.length && timestamp - line.points[0].t > life) {
                    line.points.shift();
                }
                if (line.points.length === 0) {
                    lines.splice(i, 1);
                }
            }
            if (lines.length === 0) {
                this._linesByColor.delete(color);
                this._active.delete(color);
            }
        }
    }
}