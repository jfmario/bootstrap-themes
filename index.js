
const child_process = require('child_process');
const path = require('path');

const fs = require('fs-extra');
const nunjucks = require('nunjucks')

function main() {
  
  // get a list of themes from the themes folder
  let themeDirectories = fs.readdirSync(path.resolve(__dirname, 'themes'));
  
  let themes = [];
  
  // gather all theme configurations
  for (let i = 0; i < themeDirectories.length; ++i) {
    themes.push(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'themes',
      themeDirectories[i], 'config.json'))));
  }
  // make output directories
  for (let i = 0; i < themes.length; ++i) {
    
    let currentTheme = themes[i];
    console.log(`Building theme: ${currentTheme.name}`);
    // ensure output directory exists
    fs.ensureDirSync(path.resolve(__dirname, 'dist', currentTheme.slug));
    // create template
    fs.writeFileSync(
      path.resolve(__dirname, 'dist', currentTheme.slug, 'index.html'),
      nunjucks.renderString(
        fs.readFileSync(path.resolve(__dirname, 'templates', 'theme.html')).toString(),
        { theme: currentTheme, themes: themes }
      )
    );
    // sass
    child_process.execSync(
      `sass themes/${currentTheme.slug}/theme.scss dist/${currentTheme.slug}/${currentTheme.slug}.css`
    );
  }
  
  console.log(themes);
}

main();