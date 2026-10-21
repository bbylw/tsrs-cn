// Preview the production build on the port the host hands us (portless injects PORT), so the site is
// reachable at https://tsrs.localhost instead of a bare localhost:port.
import { spawn } from 'node:child_process';

const port = process.env.PORT || '4173';
const host = process.env.HOST || '127.0.0.1';

const child = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--port', port, '--strictPort', '--host', host],
  { stdio: 'inherit' },
);
child.on('exit', (code) => process.exit(code ?? 0));
