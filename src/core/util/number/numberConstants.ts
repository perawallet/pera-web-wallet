const DEFAULT_DECIMAL_SEPARATOR = ".";

const MEMORY_UNITS = ["bytes", "KB", "MB"] as const;

// eslint-disable-next-line no-magic-numbers
const MEMORY_CONVERSION_UNIT = 1000;

export {MEMORY_UNITS, MEMORY_CONVERSION_UNIT, DEFAULT_DECIMAL_SEPARATOR};
