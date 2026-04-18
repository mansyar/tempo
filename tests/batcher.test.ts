import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReactionBatcher } from '../src/utils/batcher';

describe('ReactionBatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should batch multiple calls within the interval', () => {
    const onFlush = vi.fn();
    const batcher = new ReactionBatcher(onFlush, 1000);

    batcher.add('❤️');
    batcher.add('👏');
    batcher.add('🔥');

    expect(onFlush).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(onFlush).toHaveBeenCalledWith(['❤️', '👏', '🔥']);
  });

  it('should start a new timer after flushing', () => {
    const onFlush = vi.fn();
    const batcher = new ReactionBatcher(onFlush, 1000);

    batcher.add('❤️');
    vi.advanceTimersByTime(1000);
    expect(onFlush).toHaveBeenCalledTimes(1);

    batcher.add('👏');
    vi.advanceTimersByTime(500);
    expect(onFlush).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    expect(onFlush).toHaveBeenCalledTimes(2);
    expect(onFlush).toHaveBeenLastCalledWith(['👏']);
  });
});
