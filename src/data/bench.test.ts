import { describe, expect, it } from 'vitest';
import {
  CONFORMANCE,
  LINT_ROWS,
  PROJECTS,
  RELEASES,
  WATCH,
  fmtMem,
  fmtRatio,
  fmtTime,
} from './bench';

describe('bench data', () => {
  it('has 19 projects with three compiler cells each', () => {
    expect(PROJECTS).toHaveLength(19);
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(19);
    for (const p of PROJECTS) {
      for (const cell of [p.ts, p.rs, p.fast]) {
        expect(cell.t).toBeGreaterThan(0);
        expect(cell.m).toBeGreaterThan(0);
      }
      expect(p.errors).toBeGreaterThanOrEqual(0);
    }
  });

  it('keeps tsrs faster than TypeScript in both modes on every project', () => {
    for (const p of PROJECTS) {
      expect(p.rs.t).toBeLessThan(p.ts.t);
      expect(p.fast.t).toBeLessThanOrEqual(p.rs.t);
      expect(p.rt).toBeGreaterThan(1);
      expect(p.rtf).toBeGreaterThan(1);
      expect(p.rm).toBeGreaterThan(1);
      expect(p.rmf).toBeGreaterThan(1);
    }
  });

  it('matches the published headline numbers', () => {
    const mikro = PROJECTS.find((p) => p.id === 'mikro-orm')!;
    expect(mikro.rtf).toBe(6.62);
    const vscode = PROJECTS.find((p) => p.id === 'vscode')!;
    expect(vscode.rmf).toBe(2.75);
    expect(vscode.errors).toBe(371);
    const t3 = PROJECTS.find((p) => p.id === 't3code-server')!;
    expect(t3.rt).toBe(4.17);
  });

  it('has five numeric watch scenarios with -b columns', () => {
    expect(WATCH).toHaveLength(5);
    for (const w of WATCH) {
      expect(w.tsrs).toBeGreaterThan(0);
      expect(w.tsgo).toBeGreaterThan(0);
      expect(w.tsrs!).toBeLessThan(w.tsgo!);
      expect(w.buildTsrs).toMatch(/\d/);
      expect(w.buildTsgo).toMatch(/\d/);
    }
  });

  it('has three lint rows where one run beats both alternatives', () => {
    expect(LINT_ROWS).toHaveLength(3);
    for (const r of LINT_ROWS) {
      expect(r.one).toBeLessThan(r.go);
      expect(r.go).toBeLessThan(r.eslint);
      expect(r.oneMem).toBeLessThan(r.goMem);
    }
  });

  it('carries six conformance evidence cards and nine releases', () => {
    expect(CONFORMANCE).toHaveLength(6);
    expect(RELEASES).toHaveLength(9);
    expect(RELEASES[0].v).toBe('7.1.0-beta.tsrs5');
    expect(RELEASES[1].v).toBe('7.1.0-beta.tsrs4');
  });
});

describe('formatters', () => {
  it('formats seconds and sub-second values as milliseconds', () => {
    expect(fmtTime(12.66)).toBe('12.66 s');
    expect(fmtTime(1.19)).toBe('1.19 s');
    expect(fmtTime(0.7)).toBe('700 ms');
    expect(fmtTime(0.048)).toBe('48 ms');
  });

  it('formats memory with a MiB fallback below 1 GiB', () => {
    expect(fmtMem(5.46)).toBe('5.46 GiB');
    expect(fmtMem(0.5068)).toBe('519 MiB');
  });

  it('formats ratios', () => {
    expect(fmtRatio(6.62)).toBe('6.62×');
    expect(fmtRatio(3.7)).toBe('3.70×');
  });
});
