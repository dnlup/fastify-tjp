module.exports = {
  /**
   * Benchmarks payload number of keys in the body
   * @type {Number}
   */
  keys: parseInt(process.env.BENCH_KEYS_NUM) || 500
}
