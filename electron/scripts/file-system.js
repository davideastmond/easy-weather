const path = require("path");

import { rootPath } from 'electron-root-path';
const fs = require('fs');

/**
 * @returns { Promise<string[]> } the paths to the built in photos
 */
export function getPhotoBackgroundResourcePaths() {
  return new Promise((resolve, reject) => {
    const dir_path =  path.join(rootPath, "electron\\img\\backgrounds");
    fs.readdir(dir_path, (err, res) => {
      if (err) reject(err);
      resolve(res.map((photoURL) => { return path.join(dir_path, photoURL) ;}));
    });
  });
}