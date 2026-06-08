const { src, dest, parallel } = require('gulp');

function copyIcons() {
  return src(['nodes/**/*.svg', 'nodes/**/*.SVG', 'nodes/**/*.png', 'nodes/**/*.PNG'])
    .pipe(dest('dist/nodes/'));
}

function copyCodex() {
  return src('nodes/**/*.node.json').pipe(dest('dist/nodes/'));
}

exports['build:icons'] = parallel(copyIcons, copyCodex);
