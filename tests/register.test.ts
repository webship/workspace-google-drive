/**
 * `cmd-tools-google-drive-sync.sh -a register` starts the server it registers: the path it names is the
 * package's own built file, the same folder `drive_node` runs cli.js from.
 */
import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const PKG = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
const fun = fs.readFileSync(path.join(PKG, 'scripts/functions/fun-drive-sync.sh'), 'utf8');

test('the server -a register starts is in the package, where drive_node finds cli.js', () => {
  const pkgDir = (fun.match(/local pkg="\$\{WORKSPACE_ROOT\}\/([^"]+)"/) || [])[1];
  const server = (fun.match(/local server="\$\{WORKSPACE_ROOT\}\/([^"]+)"/) || [])[1];
  assert.ok(pkgDir && server, 'both paths are in the functions file');
  assert.strictEqual(server, `${pkgDir}/dist/src/lib/mcp.js`, 'the server is the package\'s built mcp.js');
  assert.doesNotMatch(fun, /workspace-app\/plugins\/google-drive-sync/, 'not the folder the plugin lived in before it was a package');
  assert.ok(fs.existsSync(path.join(PKG, 'dist/src/lib/mcp.js')), 'and the build produces it');
});

test('the name of the server comes before --env, which would otherwise take it as a variable', () => {
  const line = fun.split('\n').find((l) => /^\s*claude mcp add /.test(l)) || '';
  assert.match(line, /claude mcp add --scope user "\$\{DRIVE_MCP_NAME\}" --env /);
  assert.match(line, / -- node "\$\{server\}"/);
});

test('that server answers initialize, which is what -a register checks before it registers', () => {
  const out = spawnSync(process.execPath, [path.join(PKG, 'dist/src/lib/mcp.js')], {
    input: '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n', encoding: 'utf8', timeout: 15000,
    env: { ...process.env, WORKSPACE_ROOT: PKG, WORKSPACE_CONFIG: path.join(PKG, 'config') },
  });
  assert.match(String(out.stdout), /serverInfo/);
});
