interface Point {
  x: number;
  y: number;
}

class Branch {
  length: number;
  private readonly MIN_LENGTH: number = 10;
  private readonly MAX_LENGTH: number = 15;
  private readonly RANDOM_THETA = 0.2;
  constructor(public start: Point, public theta: number) {
    this.length = this.randomLength()
  }
  randomLength(): number {
    return Math.random() * (this.MAX_LENGTH - this.MIN_LENGTH) + this.MIN_LENGTH;
  }
  next(direction: "left" | "right"): Branch {
    const symbol = direction === "left" ? -1 : 1;
    return new Branch(this.end, this.theta + (symbol * Math.random() * this.RANDOM_THETA))
  }
  get end(): Point {
    return {
      x: this.start.x + Math.cos(this.theta) * this.length,
      y: this.start.y + Math.sin(this.theta) * this.length,
    }
  }
}

function draw(branch: Branch, ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.moveTo(branch.start.x, branch.start.y);
  ctx.lineTo(branch.end.x, branch.end.y);
  ctx.stroke();
}

export class Plum {
  private ctx: CanvasRenderingContext2D;
  private frameQueue: (() => void)[] = [];
  private depth: number = 0;
  private readonly MAX_DEPTH = 100;
  private readonly MIN_DEPTH = 5;
  constructor(private el: HTMLCanvasElement) {
    this.ctx = this.el.getContext("2d")!;
    this.init();
  }
  private init(): void {
    this.ctx.strokeStyle = "grey";
    const firstBranch: Branch = new Branch({ x: this.el.width / 2, y: this.el.height }, -Math.PI / 2);
    this.step(firstBranch);
    this.startAnimation();
  }
  private startAnimation(): void {
    if (this.shouldYield()) return;
    const currentFrames = [...this.frameQueue];
    this.frameQueue.length = 0;
    currentFrames.forEach(f => f());
    requestAnimationFrame(() => this.startAnimation());
    this.depth++;
  }
  private shouldYield(): boolean {
    return !this.frameQueue.length || this.depth >= this.MAX_DEPTH
  }
  private checkIsRenderBranch() {
    return this.depth < this.MIN_DEPTH || Math.random() < 0.5;
  }
  private step(b: Branch): void {
    if (!this.checkIsRenderBranch()) return;
    draw(b, this.ctx);
    this.frameQueue.push(this.step.bind(this, b.next("left")));
    this.frameQueue.push(this.step.bind(this, b.next("right")));
  }
  public destroy(): void {
    this.frameQueue = [];
    this.depth = 0;
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  }
}