import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { movies } from '../src/data/movies.js';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
assert.equal(movies.length, 8);
assert.equal(new Set(movies.map(m => m.id)).size, 8);
for (const movie of movies) {
  for (const field of ['title','image','synopsis','classification','rating','showtimes']) assert.ok(movie[field],field);
  assert.ok(existsSync('public'+movie.image));
  assert.ok(movie.rating >= 0 && movie.rating <= 5);
  assert.ok(movie.showtimes.length > 0);
}
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
 const { default: App } = await server.ssrLoadModule('/src/App.jsx');
 const html = renderToStaticMarkup(createElement(App));
 assert.equal((html.match(/class="movie-card"/g)||[]).length,8);
 assert.equal((html.match(/class="showtimes"/g)||[]).length,8);
 assert.ok(html.includes('<header') && html.includes('<footer'));
 for (const movie of movies) assert.ok(html.includes(movie.title));
 const result = 'PASS: 8 movies with unique ids and complete fields.\nPASS: 8 local posters exist.\nPASS: App renders 8 MovieCard components, showtimes, Header and Footer.\n';
 mkdirSync('docs',{recursive:true}); writeFileSync('docs/verification.txt',result); console.log(result);
} finally { await server.close(); }
