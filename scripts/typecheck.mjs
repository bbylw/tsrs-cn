// Type-check this project with tsrs.
//
// tsrs publishes a native binary per platform (darwin-arm64, linux-x64/arm64, gnu and musl). Where there is
// no native package — Windows, for one — the same Rust compiler runs from @tsrs/wasm, compiled to
// wasm32-wasip1, single-threaded. Both are tsrs; the checker that reports on this page is the one the page
// is about.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const passthrough = process.argv.slice(2);

function run(command, args) {
  return spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
}

// The native package is optional and missing on unsupported platforms: probe it once, quietly.
const probe = spawnSync('tsrs', ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' });
const hasNative = probe.status === 0;

if (hasNative) process.exit(run('tsrs', passthrough).status ?? 1);

const wasmCli = join('node_modules', '@tsrs', 'wasm', 'bin', 'tsrs-wasm.js');
if (!existsSync(wasmCli)) {
  console.error('tsrs: no native binary for this platform, and @tsrs/wasm is not installed.');
  console.error(String(probe.stderr || probe.stdout || '').trim());
  process.exit(1);
}

console.error('tsrs: native binary unavailable here — checking with @tsrs/wasm (wasm32-wasip1, single-threaded)');
process.exit(run(process.execPath, [wasmCli, ...passthrough]).status ?? 1);
