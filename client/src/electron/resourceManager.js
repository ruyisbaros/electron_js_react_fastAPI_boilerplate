import osUtils from "os-utils";
import fs from "fs";
import process from "process";
import os from "os";

// Set up polling interval for resource usage.
const POLLING_INTERVAL = 500;
export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const memoryUsage = getMemoryUsage();
    const storageData = getStorageData();
    const staticData = getStaticData();
    console.log("Used memory: ", memoryUsage, "%");
    console.log("Cpu Usage: ", cpuUsage);
    console.log("Storage Usage: ", storageData);
    console.log("Static Data: ", staticData);
  }, POLLING_INTERVAL);
}

function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getMemoryUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  // requires node 18
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}
