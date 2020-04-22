const path = require("path");

const rootPath = require('electron-root-path').rootPath;
const fs = require('fs');
let b_path;

if (process.platform === "win32") {
  b_path = "electron\\img\\backgrounds"
} else {
  b_path = "electron/img/backgrounds"
}

/**
 * @returns { Promise<string[]> } the paths to the built in photos
 */
export function getPhotoBackgroundResourcePaths() {
  return new Promise((resolve, reject) => {
    const dir_path = path.join(rootPath, b_path);
    fs.readdir(dir_path, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}