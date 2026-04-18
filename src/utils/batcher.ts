export class ReactionBatcher {
  private queue: string[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private onFlush: (emojis: string[]) => void,
    private interval: number = 1000
  ) {}

  add(emoji: string) {
    this.queue.push(emoji);
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.interval);
    }
  }

  private flush() {
    if (this.queue.length > 0) {
      this.onFlush([...this.queue]);
      this.queue = [];
    }
    this.timer = null;
  }
}
