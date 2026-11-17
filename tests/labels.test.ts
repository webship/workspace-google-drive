/**
 * The settings form names every key of the plugin's file in words (#11).
 *
 * The plugin shipped no labels, so its Settings page showed the raw keys (refresh_token, redirect_uri,
 * root_folder, videos, test, targets…), and with the Azure or Jira plugin on, client_id, client_secret
 * and account borrowed their labels ("Service principal client id", "My Jira account").
 */
import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const PKG = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
const pkg = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8'));
const manifest = pkg.workspacePlugin;

/** Every key of the settings template, dotted the way the Settings page reads them: maps walked, lists and empty maps kept whole. */
function keysOf(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(value as object).length) return prefix ? [prefix] : [];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => keysOf(v, prefix ? `${prefix}.${k}` : k));
}

test('the manifest names its labels file, and the package ships it', () => {
  assert.strictEqual(manifest.labels, 'config/settings.labels.yml');
  assert.ok(fs.existsSync(path.join(PKG, manifest.labels)), 'the file is there');
  assert.ok((pkg.files as string[]).some((f) => manifest.labels.startsWith(`${f}/`)), 'and inside a folder the package publishes');
});

test('every key of the settings file has a label and a hint, and every label is the plugin\'s own', () => {
  const template = yaml.load(fs.readFileSync(path.join(PKG, manifest.settingsTemplate), 'utf8'));
  const labels = yaml.load(fs.readFileSync(path.join(PKG, manifest.labels), 'utf8')) as Record<string, { label?: string; info?: string }>;
  const keys = keysOf(template);
  for (const k of ['client_id', 'client_secret', 'refresh_token', 'account', 'redirect_uri', 'root_folder', 'locations', 'exclude', 'targets', 'destinations.videos', 'sources.test']) {
    assert.ok(keys.includes(k), `the walk finds ${k}`);
  }
  for (const k of keys) {
    assert.ok(labels[k] && labels[k].label && labels[k].label.trim(), `${k} has a label`);
    assert.ok(labels[k].info && labels[k].info.trim().length > 20, `${k} has a hint`);
  }
  // Only keys the file has, and the one switch its comments describe (scan_for_secrets).
  for (const k of Object.keys(labels)) assert.ok(keys.includes(k) || k === 'scan_for_secrets', `${k} is a key of the settings file`);
  const names = Object.values(labels).map((l) => String(l.label));
  assert.strictEqual(new Set(names).size, names.length, 'no two keys share a label');
  for (const l of Object.values(labels)) {
    assert.doesNotMatch(`${l.label} ${l.info}`, /service principal|azure|jira|acquia|AZURE_CLIENT/i, 'nothing borrowed from another plugin');
  }
});
