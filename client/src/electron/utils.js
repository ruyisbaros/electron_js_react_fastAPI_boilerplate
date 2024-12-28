import path from "path";
import { app } from "electron";
import process from "process";

const isDev = process.env.NODE_ENV === "development";
export function getPreloadPath() {
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/dist/preload.cjs");
}

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev ? "." : "..", "/src/assets");
}
