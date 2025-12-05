import Fernet from "fernet-web";

/**
 * Decrypts a Fernet-encrypted PNG into a data URL
 */
export async function decryptImage(encrypted: string, tokenKey: string): Promise<string | null> {
  try {
    const f = await Fernet.create(tokenKey);

    // Decrypt returns a string — may have high-byte chars
    const decryptedStr = await f.decrypt(encrypted);

    // Convert to bytes safely using Uint8Array
    const bytes = new Uint8Array(decryptedStr.length);
    for (let i = 0; i < decryptedStr.length; i++) {
      // This ensures all bytes [0,255] are preserved
      bytes[i] = decryptedStr.charCodeAt(i) & 0xff;
    }

    // Convert Uint8Array to base64 using modern Blob + FileReader
    const blob = new Blob([bytes], { type: "image/png" });
    const base64 = await blobToBase64(blob);

    return "data:image/png;base64," + base64;

  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}

/**
 * Convert Blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // remove data: prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
