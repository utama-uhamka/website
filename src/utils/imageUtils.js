/**
 * Convert image file to WebP format
 * @param {File} file - Image file to convert
 * @param {number} quality - Quality of WebP (0-1), default 0.8
 * @returns {Promise<Blob>} - WebP blob
 */
export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Gagal mengkonversi gambar ke WebP'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Convert image file to base64 WebP string
 * @param {File} file - Image file to convert
 * @param {number} quality - Quality of WebP (0-1), default 0.8
 * @returns {Promise<string>} - Base64 string of WebP image
 */
export const convertToWebPBase64 = async (file, quality = 0.8) => {
  const webpBlob = await convertToWebP(file, quality);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal mengkonversi ke base64'));
    reader.readAsDataURL(webpBlob);
  });
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.' };
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  if (file.size > maxSize) {
    return { valid: false, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  return { valid: true };
};
