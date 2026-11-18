import { describe, expect, it } from 'vitest';
import { ERROR_DIFFS, PROJECTS, SETTINGS, WATCH, fmtMem, fmtRatio, fmtTime } from './bench';

describe('bench data', () => {
  it('has 17 projects, each with all four settings', () => {
    expect(PROJECTS).toHaveLength(17);
    for (const p of PROJECTS) {
      for (const s of SETTINGS) {
        const run = p.runs[s.id];
        expect(run.tsgo.t).toBeGreaterThan(0);
        expect(run.tsrs.t).toBeGreaterThan(0);
        expect(run.tsrs.t).toBeLessThan(run.tsgo.t);
        expect(run.tsrs.m).toBeLessThan(run.tsgo.m);
      }
    }
  });

  it('keeps published ratios consistent between the two cells of a run', () => {
    for (const p of PROJECTS) {
      for (const s of SETTINGS) {
        const { tsgo, tsrs } = p.runs[s.id];
        expect(tsgo.rt).toBe(tsrs.rt);
        expect(tsgo.rm).toBe(tsrs.rm);
      }
    }
  });

  it('marks the single known bug at 16 threads on drizzle-orm', () => {
    const bugs = Object.values(ERROR_DIFFS)
      .flat()
      .filter((d) => d.kind === 'bug');
    expect(bugs).toHaveLength(1);
    expect(bugs[0].project).toBe('drizzle-orm');
    expect(ERROR_DIFFS.t16.find((d) => d.project === 'drizzle-orm')?.kind).toBe('bug');
  });

  it('has six watch readings', () => {
    expect(WATCH).toHaveLength(6);
  });
});

describe('formatters', () => {
  it('formats seconds', () => {
    expect(fmtTime(12.66)).toBe('12.66 s');
    expect(fmtTime(0.75)).toBe('0.75 s');
  });

  it('formats memory with a MiB fallback below 1 GiB', () => {
    expect(fmtMem(7.39)).toBe('7.39 GiB');
    expect(fmtMem(0.5068)).toBe('519 MiB');
  });

  it('formats ratios', () => {
    expect(fmtRatio(16.87)).toBe('16.87×');
    expect(fmtRatio(3.7)).toBe('3.70×');
  });
});
