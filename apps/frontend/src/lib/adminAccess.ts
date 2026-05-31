// apps\frontend\src\lib\adminAccess.ts
let adminAccessCache: boolean | null = null;

export function getAdminAccessCache() {
  return adminAccessCache;
}

export function setAdminAccessCache(value: boolean | null) {
  adminAccessCache = value;
}
