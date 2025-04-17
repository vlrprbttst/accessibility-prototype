
# Project Name

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project folder:
   ```bash
   cd <project-folder>
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

4. Make sure you have `Node.js` installed. If not, download and install it from [here](https://nodejs.org/).

---

## Available Grunt Commands

Here are the available Grunt commands you can use in this project:

### `grunt default`
Starts the development server with live reloading and watches for changes in files.
- Runs: `browserSync`, `watch`
- Automatically opens the browser and watches changes in source files.

### `grunt build`
Prepares the `_dev` folder with optimized assets and other necessary files for production.
- Runs:
  - `clean`: Removes the `_dev` folder.
  - `processhtml:dev`: Processes HTML files and handles includes.
  - `imagemin`: Compresses images.
  - `copy:unoptimizedImage`: Copies unoptimized images.
  - `copy:js`: Copies JavaScript files.
  - `sass:dist`: Compiles SCSS files.
  - `postcss:dev`: Runs autoprefixer to add vendor prefixes.
  - `copy:the_fonts`: Copies font files.
  - `copy:favicons`: Copies favicon files.

### `grunt a`
Quickly checks accessibility for all pages and outputs a summary of errors in the terminal.
- Uses the `pa11y` tool with a JSON reporter to check accessibility issues based on the URLs defined in the `pa11yci.config.js` configuration file.

### `grunt b`
Runs the old `pa11y-ci` command to generate accessibility reports.
- Executes: `exec:pa11y_ci`
- Generates an accessibility report for the pages defined in the `pa11yci.config.js` configuration file.

### `grunt c`
Generates detailed HTML accessibility reports only for pages with accessibility issues.
- Uses `pa11y` to generate HTML reports for pages that have one or more issues.
- The reports are saved in the `accessibility-reports` folder.

### `grunt watch`
Monitors changes in source files and runs specific tasks when files are updated.
- Watches for changes in:
  - HTML files: Runs `processhtml:dev`.
  - SCSS files: Runs `sass:dist` and `postcss:dev`.
  - JavaScript files: Runs `copy:js`.
  - Image files: Runs `imagemin` and copies unoptimized images.
  - Font files: Runs `copy:the_fonts`.
  - Gruntfile: Triggers grunt tasks.

### `grunt clean`
Removes the `_dev` folder.
- Prepares the project for a fresh build.

---

## File Structure

Here’s a brief overview of the file structure:

```
src/                  # Source files (HTML, SCSS, JS, Images)
  |_ scss/             # SCSS files
  |_ js/               # JavaScript files
  |_ images/           # Images
  |_ fonts/            # Fonts
  |_ favicons/         # Favicon files
  |_ _includes/        # Includes for HTML templates
dev/                  # Compiled files for development
accessibility-reports/  # Pa11y HTML accessibility reports
package.json          # NPM dependencies and scripts
Gruntfile.js          # Grunt tasks configuration
pa11yci.config.js     # Pa11y CI configuration
```

---

## Notes

- The `pa11yci.config.js` file contains the configuration for accessibility checks, including URLs to be tested.
- The build tasks automatically optimize assets (images, CSS, JS, etc.) and prepare everything for deployment.

For more information on Grunt, visit the [Grunt website](https://gruntjs.com/).
