const Misc = {
  Browser: {}
};

Misc.Browser = (function () {
  // MIME type mapping for common documents
  const MIME_TYPES = {
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    zip: 'application/zip',
    bin: 'application/octet-stream'
  };

  // Get MIME type from file extension
  function getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
  }

  // Normalize any input to consumable chunks
  async function toChunk(data) {
    if (data instanceof Blob) return data;
    if (data instanceof Uint8Array || data instanceof ArrayBuffer) return new Blob([data]);
    if (typeof data === 'string') return new Blob([data]);
    if (typeof data === 'function') {
      const res = data();
      return res instanceof Promise ? await res : res;
    }
    return new Blob([String(data)]);
  }

  // Trigger file download via blob
  function downloadBlob(filename, blob) {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    /**
     * Direct download with progress
     * @param {string} filename
     * @param {Blob|Uint8Array|ArrayBuffer|string|Function} data
     * @param {string} [mimeType]
     * @param {Function} [onProgress] - (percent: number) => void
     * @returns {Promise<boolean>}
     */
    downloadFile: async function (filename, data, mimeType, onProgress) {
      try {
        const mime = mimeType || getMimeType(filename);
        const chunk = await toChunk(data);
        const total = chunk.size;

        // Simulate real progress for in-memory files
        let loaded = 0;
        const step = Math.max(1, Math.floor(total / 20));

        return new Promise((resolve) => {
          const push = () => {
            loaded += step;
            if (loaded > total) loaded = total;
            if (onProgress) onProgress(Math.round((loaded / total) * 100));

            if (loaded >= total) {
              downloadBlob(filename, new Blob([chunk], { type: mime }));
              resolve(true);
            } else {
              requestAnimationFrame(push);
            }
          };
          push();
        });
      } catch (err) {
        console.error('downloadFile failed', err);
        return false;
      }
    },

    /**
     * Streaming download with REAL progress
     * @param {string} filename
     * @param {string} [mimeType]
     * @param {AsyncGenerator|ReadableStream|Blob|null} data
     * @param {Function} [onProgress] - (percent: number) => void
     * @returns {Promise<boolean>|object} controller { write, close }
     */
    downloadStream: function (filename, mimeType = null, data = null, onProgress = null) {
      const mime = mimeType || getMimeType(filename);

      // Manual streaming mode: write() / close()
      if (data === null) {
        let chunks = [];
        let totalSize = 0;
        let expectedSize = 0;

        return {
          setExpectedSize(size) {
            expectedSize = size;
          },
          write(chunk) {
            chunks.push(chunk);
            totalSize += chunk.size || chunk.length || 0;
            if (onProgress && expectedSize > 0) {
              onProgress(Math.min(100, Math.round((totalSize / expectedSize) * 100)));
            }
          },
          close() {
            const blob = new Blob(chunks, { type: mime });
            downloadBlob(filename, blob);
            chunks = null;
            if (onProgress) onProgress(100);
          }
        };
      }

      // Auto streaming with progress
      return (async () => {
        try {
          const chunks = [];
          let totalLoaded = 0;
          let totalSize = 0;

          // Get full size first for progress
          if (data instanceof Blob) {
            totalSize = data.size;
          }

          // ReadableStream
          if (data instanceof ReadableStream) {
            const reader = data.getReader();
            const contentLength = data._readableState?.length || 0;
            totalSize = contentLength;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
              totalLoaded += value.length;
              if (onProgress && totalSize > 0) {
                onProgress(Math.min(100, Math.round((totalLoaded / totalSize) * 100)));
              }
            }
          }
          // Async generator
          else if (data[Symbol.asyncIterator]) {
            for await (const chunk of data) {
              chunks.push(chunk);
              totalLoaded += chunk.size || chunk.length || 0;
              if (onProgress && totalSize > 0) {
                onProgress(Math.min(100, Math.round((totalLoaded / totalSize) * 100)));
              }
            }
          }
          // Regular blob/data
          else {
            const blob = await toChunk(data);
            chunks.push(blob);
            totalSize = blob.size;
            totalLoaded = blob.size;
            if (onProgress) onProgress(100);
          }

          const finalBlob = new Blob(chunks, { type: mime });
          downloadBlob(filename, finalBlob);
          return true;
        } catch (err) {
          console.error('downloadStream failed', err);
          return false;
        }
      })();
    }
  };
})();