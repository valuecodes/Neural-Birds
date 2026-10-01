// The scrolling backdrop behind the birds.
class Background {
  pos: number;

  constructor(pos: number) {
    this.pos = pos;
  }

  update() {
    this.pos -= 0.3;
    if (this.pos < -6000) {
      this.pos = -60;
    }
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    ctx.drawImage(image, this.pos, -200);
  }
}

export { Background };
