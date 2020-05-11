const assert = require("assert");
const path = require("path");
const rootPath = require('electron-root-path').rootPath;
const fs = require('fs');

/**
 * @returns { Promise<string[]> } the paths to the built-in photos
 */
export function getPhotoBackgroundResourcePaths(resourcePath = "electron/img/backgrounds" ) {
  return new Promise((resolve, reject) => {
    const dir_path = path.join(rootPath, getRelevantOSPath(process.platform, resourcePath));
    fs.readdir(dir_path, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

/**
 * Supply a path and os and it will return the correct version with correct slashes
 * @param {string} os 
 * @param {string} pathString 
 */
export function getRelevantOSPath(os, pathString) {
  assert(os && pathString, "provide valid os (win32 || darwin || linux ) and a path string");
  assert(!(pathString.includes("/") && pathString.includes("\\")), "invalid path string");
  assert(os === "win32" || os === "darwin" || os === "linux", `Invalid OS ${os}`);

  // If there are no slashes in the path, return the path itself (no need to modify it)
  if (!(pathString.includes("/")) && !(pathString.includes("\\"))) {
    return pathString;
  }

  let splitPath;
  // Forward slashes for darwin / linux, backslashes for win32
  if (pathString.includes("/")) {
    splitPath = pathString.split("/");
  } else if ( pathString.includes("\\")) {
    splitPath = pathString.split("\\");
  }

  switch(os) {
    case "darwin":
      return splitPath.join("/");
    case "linux":
      return splitPath.join("/");
    case "win32":
      return splitPath.join("\\");
  }
}