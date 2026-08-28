import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['next', 'dev', '-p', '4000'],
  { stdio: 'inherit', shell: true, cwd: root },
)
child.on('exit', (code) => process.exit(code ?? 0))
