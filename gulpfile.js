const { src, dest } = require('gulp');

function copyIcons() {
  return src(['nodes/**/*.svg', 'nodes/**/*.SVG', 'nodes/**/*.png', 'nodes/**/*.PNG'])
    .pipe(dest('dist/nodes/'));
}

exports['build:icons'] = copyIcons;
