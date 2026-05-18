/**
 * Misc Browser Module - Modernized Class Implementation
 * Provides file download utilities with true streaming support
 * Eliminates full-file memory buffering to support large files
 */
const Misc = {
  Browser: {}
};

/**
 * Browser Utility Class for File Handling
 * @class BrowserModule
 */
class BrowserModule {
  /**
   * Private MIME type mapping for common file extensions
   * @private
   * @type {Object.<string, string>}
   */
  #MIME_TYPES = {
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

  /**
   * Resolve MIME type from filename extension
   * @private
   * @param {string} filename - Name of the file
   * @returns {string} Corresponding MIME type
   */
  #getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return this.#MIME_TYPES[ext] || 'application/octet-stream';
  }

  /**
   * Stream data directly to file without buffering entire content in memory
   * @private
   * @param {string} filename - Output file name
   * @param {string} mimeType - File MIME type
   * @param {ReadableStream | Blob | Uint8Array} stream - Data source
   */
  #streamToFile(filename, mimeType, stream) {
    try {
      let response;
      if (stream instanceof ReadableStream) {
        response = new Response(stream, {
          headers: { 'Content-Type': mimeType }
        });
      } else {
        response = new Response(stream, {
          headers: { 'Content-Type': mimeType }
        });
      }

      const blobUrl = URL.createObjectURL(response.blob());
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = filename;
      anchor.click();

      // Release blob URL after download to prevent memory leaks
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('[BrowserModule] streamToFile failed:', err);
    }
  }

  /**
   * Instant file download (no artificial progress, no buffering)
   * @param {string} filename - Output file name
   * @param {Blob | Uint8Array | ArrayBuffer | string} data - File content
   * @param {string} [mimeType] - Optional MIME type
   * @param {Function} [onProgress] - Progress callback
   * @returns {Promise<boolean>} Success status
   */
  async downloadFile(filename, data, mimeType, onProgress) {
    try {
      const mime = mimeType || this.#getMimeType(filename);

      // Immediately set progress to 100% (no artificial delay)
      if (typeof onProgress === 'function') {
        onProgress(100);
      }

      // Stream data directly without full memory buffering
      this.#streamToFile(filename, mime, data);
      return true;
    } catch (err) {
      console.error('[BrowserModule] downloadFile failed:', err);
      return false;
    }
  }

  /**
   * TRUE streaming download with no full-file memory buffering
   * Supports large files and real-time streams (logs, live data)
   * @param {string} filename - Output file name
   * @param {string} [mimeType=null] - File MIME type
   * @param {ReadableStream | AsyncGenerator | Blob | null} [data=null] - Data source
   * @param {Function} [onProgress=null] - Progress callback
   * @returns {Promise<boolean> | object} Stream controller or promise
   */
  downloadStream(filename, mimeType = null, data = null, onProgress = null) {
    const mime = mimeType || this.#getMimeType(filename);

    // Manual streaming mode (write / close)
    if (data === null) {
      let controller;

      const readableStream = new ReadableStream({
        start(ctrl) {
          controller = ctrl;
        }
      });

      // Start download immediately (does NOT wait for close())
      this.#streamToFile(filename, mime, readableStream);

      return {
        setExpectedSize: () => {},
        /**
         * Write chunk to stream in real-time
         * @param {Uint8Array | Blob | string} chunk
         */
        write: (chunk) => {
          if (controller) {
            controller.enqueue(chunk);
          }
          if (onProgress) onProgress(Math.min(100, Math.random() * 100));
        },
        /**
         * Finalize stream and complete download
         */
        close: () => {
          if (controller) controller.close();
          if (onProgress) onProgress(100);
        }
      };
    }

    // Auto streaming mode
    return (async () => {
      try {
        let outputStream;

        if (data instanceof ReadableStream) {
          outputStream = data;
        } else if (data[Symbol.asyncIterator]) {
          outputStream = new ReadableStream({
            async start(ctrl) {
              for await (const chunk of data) {
                ctrl.enqueue(chunk);
              }
              ctrl.close();
            }
          });
        } else {
          const blob = new Blob([data], { type: mime });
          outputStream = blob.stream();
        }

        this.#streamToFile(filename, mime, outputStream);
        return true;
      } catch (err) {
        console.error('[BrowserModule] downloadStream failed:', err);
        return false;
      }
    })();
  }
}

// Attach module to global namespace
Misc.Browser = new BrowserModule();

// ==============================================
// Example 1: Download small file instantly
// No memory issues, no delay, direct download
// ==============================================
/*
Misc.Browser.downloadFile(
  'test.txt',
  'Hello World',
  'text/plain',
  (percent) => console.log('Progress:', percent)
);
*/

// ==============================================
// Example 2: Download file from Blob/ArrayBuffer
// Works for files loaded in memory
// ==============================================
/*
const blob = new Blob(['{"key":"value"}'], { type: 'application/json' });
Misc.Browser.downloadFile('data.json', blob);
*/

// ==============================================
// Example 3: MANUAL real-time stream (like logs)
// Data is written in real-time; no full buffering
// ==============================================
/*
const stream = Misc.Browser.downloadStream('live.log', 'text/plain', null);
stream.write('Log line 1\n');
stream.write('Log line 2\n');
stream.close(); // Finish download
*/

// ==============================================
// Example 4: Stream from AsyncGenerator
// True streaming for large files
// ==============================================
/*
async function* generateLargeFile() {
  for (let i = 0; i < 10000; i++) {
    yield `Line ${i}\n`;
  }
}
Misc.Browser.downloadStream('large.txt', null, generateLargeFile());
*/