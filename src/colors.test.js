import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHex, contrastRatio, contrastChecks } from './colors.js';

test('короткий HEX и ввод без решётки', () => {
  assert.equal(normalizeHex(' #AbC '), '#aabbcc');
  assert.equal(normalizeHex('ffffff'), '#ffffff');
  for (const value of ['', '#abcd', '#gggggg', '#12345', 'red']) assert.equal(normalizeHex(value), null);
});

test('граничные значения контраста и симметрия', () => {
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('#fff', '#fff'), 1);
  assert.equal(contrastRatio('#26314d', '#f0bb54'), contrastRatio('#f0bb54', '#26314d'));
});

test('округление не превращает провал в прохождение', () => {
  assert.equal(contrastChecks(4.4999)[0].passed, false);
  assert.equal(contrastChecks(4.5)[0].passed, true);
  assert.equal(contrastChecks(2.9999)[1].passed, false);
  assert.equal(contrastChecks(3)[1].passed, true);
  assert.equal(contrastChecks(6.9999)[2].passed, false);
  assert.equal(contrastChecks(7)[2].passed, true);
});
