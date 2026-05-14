// Define global namespace to avoid duplicate declaration
const Libs = window.Libs || {};

// General utility library for parsing and formatting various input data types
Libs.Format = (function () {
  // Internal helper utility methods
  const util = {
    // Get the precise native type of any value
    getType: function (val) {
      return Object.prototype.toString.call(val).slice(8, -1);
    },
    // Judge whether the value is null, undefined or empty string
    isEmpty: function (val) {
      return val === null || val === undefined || val === '';
    }
  };

  // ====================== Binary Units Parsing & Formatting ======================
  const BinaryUnits = {
    // 单位映射：支持 B, KB, MB, GB, TB, PB, EB, KiB, MiB, b, Kb, Bps, KBps 等
    unitMap: {
      // 二进制 1024
      B: { base: 1024, bytes: 1, bits: 8 },
      KB: { base: 1024, bytes: 1 << 10, bits: 8 << 10 },
      MB: { base: 1024, bytes: 1 << 20, bits: 8 << 20 },
      GB: { base: 1024, bytes: 1 << 30, bits: 8 << 30 },
      TB: { base: 1024, bytes: 1 << 40, bits: 8 << 40 },
      PB: { base: 1024, bytes: 1 << 50, bits: 8 << 50 },
      EB: { base: 1024, bytes: 1 << 60, bits: 8 << 60 },

      // 十进制 1000
      KiB: { base: 1000, bytes: 1e3, bits: 8e3 },
      MiB: { base: 1000, bytes: 1e6, bits: 8e6 },
      GiB: { base: 1000, bytes: 1e9, bits: 8e9 },
      TiB: { base: 1000, bytes: 1e12, bits: 8e12 },
      PiB: { base: 1000, bytes: 1e15, bits: 8e15 },
      EiB: { base: 1000, bytes: 1e18, bits: 8e18 },

      // 比特单位
      b: { base: 1024, bytes: 0.125, bits: 1 },
      kb: { base: 1024, bytes: 128, bits: 1024 },
      mb: { base: 1024, bytes: 131072, bits: 1048576 },
      gb: { base: 1024, bytes: 134217728, bits: 1073741824 },

      // 速率单位 Bps KBps MBps GBps
      Bs: { base: 1024, bytes: 1, bits: 8 },
      Bps: { base: 1024, bytes: 1, bits: 8 },
      KBs: { base: 1024, bytes: 1 << 10, bits: 8 << 10 },
      KBps: { base: 1024, bytes: 1 << 10, bits: 8 << 10 },
      MBs: { base: 1024, bytes: 1 << 20, bits: 8 << 20 },
      MBps: { base: 1024, bytes: 1 << 20, bits: 8 << 20 },
      GBs: { base: 1024, bytes: 1 << 30, bits: 8 << 30 },
      GBps: { base: 1024, bytes: 1 << 30, bits: 8 << 30 },

      // 大写速率
      BS: { base: 1024, bytes: 1, bits: 8 },
      BPS: { base: 1024, bytes: 1, bits: 8 },
      KBS: { base: 1024, bytes: 1 << 10, bits: 8 << 10 },
      KBPS: { base: 1024, bytes: 1 << 10, bits: 8 << 10 },
      MBS: { base: 1024, bytes: 1 << 20, bits: 8 << 20 },
      MBPS: { base: 1024, bytes: 1 << 20, bits: 8 << 20 },
      GBS: { base: 1024, bytes: 1 << 30, bits: 8 << 30 },
      GBPS: { base: 1024, bytes: 1 << 30, bits: 8 << 30 }
    },

    // 可用单位列表（用于自动匹配）
    unitList: [
      { unit: 'B', base: 1024, bytes: 1 },
      { unit: 'KB', base: 1024, bytes: 1 << 10 },
      { unit: 'MB', base: 1024, bytes: 1 << 20 },
      { unit: 'GB', base: 1024, bytes: 1 << 30 },
      { unit: 'TB', base: 1024, bytes: 1 << 40 },
      { unit: 'PB', base: 1024, bytes: 1 << 50 },
      { unit: 'EB', base: 1024, bytes: 1 << 60 }
    ],

    /**
     * 解析带单位的字符串，返回字节数（或比特数）
     * @param {string} str
     * @param {boolean} retBits
     * @returns {number}
     */
    parseBinaryUnits: function (str, retBits = false) {
      if (util.isEmpty(str)) return 0;
      const match = str.trim().match(/^([\d.]+)\s*([a-zA-Z]+)$/);
      if (!match) return 0;

      const num = parseFloat(match[1]);
      const unit = match[2];
      const def = this.unitMap[unit];
      if (!def) return 0;

      return retBits ? Math.round(num * def.bits) : Math.round(num * def.bytes);
    },

    /**
     * 格式化字节数为友好单位字符串
     * 支持两种调用：formatBinaryUnits(1500) 或 formatBinaryUnits(1500, { round:4 })
     * @param {number} bytes
     * @param {number|object} roundOrOpts
     * @param {string|null} forceUnits
     * @param {number|null} forceBase
     * @returns {string}
     */
    formatBinaryUnits: function (bytes, roundOrOpts = 2, forceUnits = null, forceBase = null) {
      let val = Number(bytes);
      if (isNaN(val) || val < 0) val = 0;

      let round = 2;
      let opts = {};

      if (typeof roundOrOpts === 'object' && roundOrOpts !== null) {
        opts = roundOrOpts;
        round = opts.round ?? 2;
        forceUnits = opts.forceUnits ?? null;
        forceBase = opts.forceBase ?? null;
      } else {
        round = Number(roundOrOpts) || 2;
      }

      let base = forceBase || 1024;
      let unit = 'B';
      let displayVal = val;

      if (forceUnits) {
        const def = this.unitMap[forceUnits];
        if (def) {
          displayVal = val / def.bytes;
          unit = forceUnits;
        }
      } else {
        for (let i = this.unitList.length - 1; i >= 0; i--) {
          const item = this.unitList[i];
          if (val >= item.bytes) {
            displayVal = val / item.bytes;
            unit = item.unit;
            break;
          }
        }
      }

      return displayVal.toFixed(round) + ' ' + unit;
    }
  };

  return {
    // Convert number / numeric string to binary string
    Binary: function (val) {
      if (util.isEmpty(val)) return '';
      const num = Number(val);
      if (isNaN(num)) return '';
      return num.toString(2);
    },

    // Convert number / numeric string to uppercase hexadecimal string
    Hex: function (val) {
      if (util.isEmpty(val)) return '';
      const num = Number(val);
      if (isNaN(num)) return '';
      return num.toString(16).toUpperCase();
    },

    // Format date support: Date object / timestamp / date string
    Date: function (val, fmt = 'YYYY-MM-DD') {
      if (util.isEmpty(val)) return '';
      let date = new Date(val);
      if (isNaN(date.getTime())) return '';

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');

      return fmt
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', h)
        .replace('mm', m)
        .replace('ss', s);
    },

    // Format money with thousand separator
    Money: function (val, fixed = 2) {
      if (util.isEmpty(val)) return '0.00';
      const num = parseFloat(val);
      if (isNaN(num)) return '0.00';
      return num.toFixed(fixed).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Format file size
    FileSize: function (val) {
      if (util.isEmpty(val)) return '0 B';
      let size = Number(val);
      if (isNaN(size)) return '0 B';
      const unit = ['B', 'KB', 'MB', 'GB', 'TB'];
      let idx = 0;
      while (size >= 1024 && idx < unit.length - 1) {
        size /= 1024;
        idx++;
      }
      return size.toFixed(2) + ' ' + unit[idx];
    },

    // Format phone number
    Phone: function (val) {
      if (util.isEmpty(val)) return '';
      const str = String(val).replace(/\D/g, '');
      if (str.length !== 11) return val;
      return str.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3');
    },

    // Format JSON
    Json: function (val) {
      try {
        let data = typeof val === 'string' ? JSON.parse(val) : val;
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return String(val);
      }
    },

    // Convert to Yes/No
    Boolean: function (val) {
      if (util.isEmpty(val)) return 'No';
      return !!val ? 'Yes' : 'No';
    },

    // Pad leading zero
    PadZero: function (val, len = 2) {
      if (util.isEmpty(val)) return '0'.repeat(len);
      return String(val).padStart(len, '0');
    },

    // Truncate long string
    Truncate: function (val, len = 10) {
      if (util.isEmpty(val)) return '';
      const str = String(val);
      return str.length > len ? str.slice(0, len) + '...' : str;
    },

    // Get value type
    Type: util.getType,

    BinaryUnits: {
      parse: BinaryUnits.parseBinaryUnits.bind(BinaryUnits),
      format: BinaryUnits.formatBinaryUnits.bind(BinaryUnits),
      parseBinaryUnits: BinaryUnits.parseBinaryUnits.bind(BinaryUnits),
      formatBinaryUnits: BinaryUnits.formatBinaryUnits.bind(BinaryUnits)
    }
  };
})();

/*
// ====================== New Binary Unit Methods ======================
// Official API
Libs.Format.BinaryUnits.parseBinaryUnits
Libs.Format.BinaryUnits.formatBinaryUnits

// Aliases (shortened version)
Libs.Format.BinaryUnits.parse
Libs.Format.BinaryUnits.format
*/