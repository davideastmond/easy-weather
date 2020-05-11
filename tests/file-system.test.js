import { getRelevantOSPath, getPhotoBackgroundResourcePaths } from "../electron/scripts/file-system";
import regeneratorRuntime from "regenerator-runtime";

describe("file system tests", ()=> {
  test("returns the correctly-formatted path for win32", ()=> {
    const os = "win32";
    const path = "/test/test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe("\\test\\test.path");
  });

  test("returns correctly-formatted path for darwin", ()=> {
    const os = "darwin";
    const path = "\\test\\test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe("/test/test.path");
  });

  test("already valid win32 path - should return same valid win32 path", ()=> {
    const os = "win32";
    const path = "\\test\\test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe(path);
  });

  test("already valid darwin path - should return same valid darwin path", ()=> {
    const os = "darwin";
    const path = "/test/test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe(path);
  });

  test("invalid os - should throw", ()=> {
    const os = "solaris"; // sorry Solaris fans :(
    const path = "\\test\\test.path";
    expect(()=> getRelevantOSPath(os, path)).toThrow();
  });

  test("Invalid path formatting, should throw", ()=> {
    const os = "darwin";
    const path = "\/test\\test.path";
    expect(()=> getRelevantOSPath(os, path)).toThrow();
  });

  test("path string has no slashes - just return original path string with no formatting", ()=> {
    const os = "win32";
    const path = "my_path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe(path);
  });

  test("photoResourcePaths return valid data and throws / rejects as expected", async()=> {
    await expect(getPhotoBackgroundResourcePaths()).resolves.not.toHaveLength(0);
    await expect(getPhotoBackgroundResourcePaths("/invalid/path")).rejects;
  });
});