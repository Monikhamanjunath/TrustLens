// Stable, lightweight local encryption cipher for securing offline scans and session storage in sandboxed contexts
const FALLBACK_KEY = "TrustLens-Forensic-Lab-Secret-256";

export function encryptData(data: any, key: string = FALLBACK_KEY): string {
  try {
    const jsonStr = JSON.stringify(data);
    let result = "";
    for (let i = 0; i < jsonStr.length; i++) {
      const charCode = jsonStr.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    // Safe unicode btoa conversion
    return btoa(encodeURIComponent(result));
  } catch (err) {
    console.error("Encryption failed:", err);
    return "";
  }
}

export function decryptData(cipherText: string, key: string = FALLBACK_KEY): any {
  try {
    if (!cipherText) return null;
    const rawBase64 = decodeURIComponent(atob(cipherText));
    let result = "";
    for (let i = 0; i < rawBase64.length; i++) {
      const charCode = rawBase64.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return JSON.parse(result);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}

// Encrypted browser localstorage driver
export const encryptedStorage = {
  setItem(key: string, value: any, secretKey?: string) {
    const cipher = encryptData(value, secretKey);
    localStorage.setItem(key, cipher);
  },
  getItem(key: string, secretKey?: string): any {
    const cipher = localStorage.getItem(key);
    if (!cipher) return null;
    return decryptData(cipher, secretKey);
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};
