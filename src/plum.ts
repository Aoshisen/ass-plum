interface Point {
  x: number;
  y: number;
}

interface Branch {
  start: Point;
  length: number;
  theta: number;
}

export class Plum {
  private ctx: CanvasRenderingContext2D;
  private frameQueue: (() => void)[] = [];
  private depth: number = 0;
  private readonly MAX_DEPTH = 100;
  private readonly MIN_DEPTH = 5;
  constructor(private el: HTMLCanvasElement) {
    this.ctx = el.getContext("2d")!;
    this.init();
  }

  private init(): void {
    this.ctx.strokeStyle = "grey";
    const branch: Branch = Object.freeze({
      start: { x: this.el.width / 2, y: this.el.height },
      length: this.randomLength(),
      theta: -Math.PI / 2,
    });
    this.step(branch);
    this.startAnimation();
  }
  private startAnimation(): void {
    if (this.shouldYield()) return;
    const currentFrames = [...this.frameQueue];
    this.frameQueue = [];
    currentFrames.forEach((frame) => frame());
    requestAnimationFrame(() => this.startAnimation());
    this.depth++;
  }

  private nextPoint(b: Branch): Point {
    return Object.freeze({
      x: b.start.x + Math.cos(b.theta) * b.length,
      y: b.start.y + Math.sin(b.theta) * b.length,
    })
  }

  private shouldYield(): boolean {
    return this.frameQueue.length === 0 || this.depth >= this.MAX_DEPTH
  }

  private line(s: Point, e: Point): Point {
    this.ctx.beginPath();
    this.ctx.moveTo(s.x, s.y);
    this.ctx.lineTo(e.x, e.y);
    this.ctx.stroke();
    return e;
  }
  private branch(b: Branch): Point {
    return this.line(b.start, this.nextPoint(b));
  }
  private random(): number {
    return Math.random();
  }
  private randomLength(): number {
    // 5-15
    return Math.random() * 10 + 5;
  }
  private getNextBranch(b: Branch, end: Point, direction: "left" | "right"): Branch {
    const symbol = direction === "left" ? -1 : 1;
    return Object.freeze({
      theta: b.theta + (symbol * this.random() * 0.2),
      start: end,
      length: this.randomLength(),
    })
  }
  private checkIsRenderBranch() {
    return this.depth < this.MIN_DEPTH || this.random() < 0.5;
  }
  private step(b: Branch): void {
    if (!this.checkIsRenderBranch()) return;
    const endPoint = this.branch(b);
    this.frameQueue.push(() => this.step(this.getNextBranch(b, endPoint, "left")));
    this.frameQueue.push(() => this.step(this.getNextBranch(b, endPoint, "right")));
  }
}
