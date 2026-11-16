// @ts-nocheck — a fake api, shaped like the dashboard's, with only what register() reaches.
/**
 * Which workspaces the Google Drive group and its actions are for.
 *
 * The plugin is for the folders that hold files worth keeping somewhere else (videos, audio, docs, specs, and the
 * test reports of test): the workspaces its manifest places its command in. Installed from npm, no list is
 * written for it in settings.yml, and the dashboard's appliesTo then says yes to every workspace: the group was
 * on dev and projects, and an action for dev was taken. A list in settings.yml still decides when there is one.
 */
import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';

const PKG = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
const manifest = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).workspacePlugin;
const ALL = ['dev', 'test', 'projects', 'videos', 'audio', 'docs', 'specs', 'images'];

// A workspace of its own: settings.yml lists the folders, the plugin's settings file is its template.
const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-drive-scope-'));
const CONFIG = path.join(ROOT, 'core', 'config');
fs.mkdirSync(CONFIG, { recursive: true });
fs.writeFileSync(path.join(CONFIG, 'settings.yml'), `workspaces:\n${ALL.map((w) => `  - ${w}\n`).join('')}`);
fs.copyFileSync(path.join(PKG, manifest.settingsTemplate), path.join(CONFIG, manifest.settingsFile));
for (const w of ALL) fs.mkdirSync(path.join(ROOT, w));
process.env.WORKSPACE_ROOT = ROOT;
process.env.WORKSPACE_CONFIG = CONFIG;
process.on('exit', () => fs.rmSync(ROOT, { recursive: true, force: true }));

/** register() against a fake api; `workspaces` is the list settings.yml gives the plugin, if any. */
function load(workspaces?: string) {
  const pageActions = [];
  const actions = {};
  const listed = String(workspaces || '').split(',').map((w) => w.trim()).filter(Boolean);
  const api = {
    name: 'google-drive-sync',
    config: workspaces === undefined ? { enabled: true } : { enabled: true, workspaces },
    appliesTo: (ws) => listed.length === 0 || listed.includes(ws),
    lib: { esc: (s) => String(s), screenAction: () => undefined, auth: { sessionOf: () => null, googleButton: () => '', BUTTON_CSS: '' } },
    settings: { set: () => undefined, setList: () => undefined },
    addPageActions: (fn) => pageActions.push(fn),
    addFragment: () => undefined,
    addAction: (name, fn) => { actions[name] = fn; },
  };
  delete require.cache[require.resolve('../src/index')];
  require('../src/index').register(api);
  const groups = (key) => pageActions.map((fn) => fn({ view: 'workspace', key, meta: { label: key } })).filter(Boolean);
  const call = (name, workspace, form = {}) => new Promise((resolve) => actions[name]({ form, workspace, send: (html, status = 200) => resolve({ html, status }) }));
  return { groups, call };
}

test('with no list in settings.yml, the group is on the workspaces the manifest places the command in, and on no other', () => {
  assert.deepStrictEqual([...require('../src/index').DRIVE_WORKSPACES].sort(), [...manifest.commands.workspaces].sort(), 'the plugin\'s list is the manifest\'s');
  const { groups } = load();
  const shown = ALL.filter((w) => groups(w).some((g) => g.label === 'Google Drive')).sort();
  assert.deepStrictEqual(shown, [...manifest.commands.workspaces].sort());
  assert.deepStrictEqual(shown, ['audio', 'docs', 'specs', 'test', 'videos']);
});

test('an action for a workspace outside it is refused before it does anything', async () => {
  const { call } = load();
  for (const ws of ['dev', 'projects', 'images']) {
    for (const name of ['targets', 'sync', 'clear', 'disconnect']) {
      const r = await call(name, ws, { targets: '*.md' });
      assert.strictEqual(r.status, 400, `${name} on ${ws}`);
      assert.match(r.html, /not enabled for this workspace/);
    }
  }
  const saved = fs.readFileSync(path.join(CONFIG, manifest.settingsFile), 'utf8');
  assert.doesNotMatch(saved, /^ {2}dev:/m, 'nothing was written for dev');
});

test('a list in settings.yml still decides, wider or narrower', () => {
  const wide = load('dev,videos');
  assert.ok(wide.groups('dev').length, 'dev, because the list names it');
  assert.ok(!wide.groups('docs').length, 'not docs, which the list leaves out');
});
