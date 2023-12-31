/** @format */

import * as path from 'path';
import * as mkdirp from 'mkdirp';
import fsCallback from 'fs';
import fsPromises from 'fs/promises';
import {sanitizeArray} from '../sanitize';

export function replace_extname(pathname: string, new_extname: string) {
  const old_extname = path.extname(pathname);
  const basename = path.basename(pathname, old_extname);
  const dirname = path.dirname(pathname);
  return path.join(dirname, basename + new_extname);
}

export function makePath(
  base: string,
  sub: string,
  filename: string,
  extname?: string
): string {
  if (extname) filename = replace_extname(filename, extname);
  const p = path.resolve(base, sub);
  mkdirp.sync(p);
  return path.resolve(p, filename);
}

export function isDirectory(pathname: string): boolean {
  try {
    return fsCallback.statSync(pathname).isDirectory();
  } catch (e) {
    return false;
  }
}

export async function removeDirRecursive(dirname: string) {
  return fsPromises.rm(dirname, {recursive: true}).catch((e) => {
    if (e.code !== 'ENOENT') throw e; // be silent if dir doesn't exists
  });
}

interface GetFilesRecursiveOptions {
  extnames: string | string[];
  excludeDirs: string | string[];
}

export async function getFilesRecursive(
  startDir: string,
  options: GetFilesRecursiveOptions
): Promise<string[]> {
  // if (extnames && !Array.isArray(extnames)) extnames = [extnames];
  const extnames =
    typeof options.extnames !== 'undefined' && !Array.isArray(options.extnames)
      ? [options.extnames]
      : options.extnames;

  // if (excludeDirs && !Array.isArray(excludeDirs)) excludeDirs = [excludeDirs];
  const excludeDirs =
    typeof options.excludeDirs !== 'undefined' &&
    !Array.isArray(options.excludeDirs)
      ? [options.excludeDirs]
      : options.excludeDirs;

  async function _getFiles(dir: string): Promise<string[]> {
    const dirents = await fsPromises.readdir(dir, {withFileTypes: true});
    const promises = dirents
      .filter((dirent) => {
        return (
          (dirent.isDirectory() &&
            (excludeDirs
              ? excludeDirs.every(
                  (d: string) =>
                    path.resolve(startDir, d) !== path.resolve(dir, dirent.name)
                )
              : true)) ||
          (dirent.isFile() &&
            (extnames
              ? extnames.some((e: string) => dirent.name.endsWith(e))
              : true))
        );
      })
      // .reduce((acc, dirent, currentIndex, array ) => {
      .map((dirent, currentIndex, array) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? _getFiles(res) : [res];
      });
    const files: string[][] = await Promise.all(promises);
    return Array.prototype.concat(...files);
    // return files;
  }
  return _getFiles(startDir);
}

export const cleanup = async (title: string, filenames_: string | string[]) => {
  const filenames = sanitizeArray(filenames_);
  if (filenames.length > 0) process.stdout.write(`\n* ${title} `);
  filenames.forEach((fname) => {
    fsCallback.unlinkSync(fname);
    process.stdout.write(`${fname} `);
  });
  process.stdout.write(`Done.`);
  return await ensureNoFile(filenames);
};

export const iterateFiles = async (
  filenames: string | string[],
  title: string,
  fn: (name: string) => Promise<string | undefined>
) => {
  filenames = sanitizeArray(filenames);
  if (filenames.length > 0) process.stdout.write(title);

  const result: string[] = [];
  for (const fname of filenames) {
    process.stdout.write(`"${fname}" `);
    await fn(fname);
    result.push(fname);
  }
  return result;
};

export const fileCheckError = (fname: string, moreData?: any): undefined => {
  const msg = `Error checking file "${fname}"`;
  if (moreData) console.error(msg, moreData);
  else console.error(msg);
  throw new Error(msg);
};

export async function ensureFile(filenames: string | string[]) {
  if (!Array.isArray(filenames)) filenames = [filenames];
  return iterateFiles(
    filenames,
    `* Checking files exist... `,
    async (fname) => {
      const fd = fsCallback.openSync(fname, 'r');
      const stats = fsCallback.fstatSync(fd);
      if (stats.isFile() && stats.size > 0) {
        console.log(`[${stats.size} bytes] `);
        return fname;
      } else {
        return fileCheckError(fname, stats);
      }
    }
  );
}

export async function ensureNoFile(filenames: string | string[]) {
  if (!Array.isArray(filenames)) filenames = [filenames];
  return iterateFiles(
    filenames,
    `* Checking file doesn't exist... `,
    async (fname) => {
      if (!fsCallback.existsSync(fname)) {
        console.log(`[Not exists]`);
        return fname;
      } else {
        return fileCheckError(fname);
      }
    }
  );
}

export function absPathname(pathname: string) {
  if (!path.isAbsolute(pathname)) {
    const baseDir = process.cwd();
    pathname = path.join(baseDir, pathname);
  }
  return path.resolve(pathname);
}

export function formatFilenameDate(date: Date = new Date()): string {
  return date.toISOString().replace(/[:T]/g, '-').replace(/\..+/, '');
}
