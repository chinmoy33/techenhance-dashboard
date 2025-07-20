export const isDateString = (val: string): boolean => {
  if (typeof val !== "string") return false;

  // Trim whitespace
  const trimmedVal = val.trim();
  if (trimmedVal === "") return false;

  // Common date patterns
  const datePatterns = [
    /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/, // dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy
    /^\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}$/, // yyyy/mm/dd, yyyy-mm-dd, yyyy.mm.dd
    /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2}$/, // dd/mm/yy, dd-mm-yy, dd.mm.yy
    /^\d{1,2}\s+\w{3,9}\s+\d{4}$/, // dd Month yyyy (e.g., 15 January 2021)
    /^\w{3,9}\s+\d{1,2},?\s+\d{4}$/, // Month dd, yyyy (e.g., January 15, 2021)
    /^\d{4}$/, // yyyy (year only)
    /^\d{1,2}\/\d{4}$/, // mm/yyyy
    /^\d{4}-\d{2}$/, // yyyy-mm
  ];

  // Check if it matches any date pattern
  const matchesPattern = datePatterns.some((pattern) =>
    pattern.test(trimmedVal)
  );

  if (!matchesPattern) return false;

  // Additional validation: try to parse as date
  // Handle different date formats more robustly
  let dateToTest = trimmedVal;

  // Convert dd/mm/yyyy to mm/dd/yyyy for Date.parse (US format)
  if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/.test(trimmedVal)) {
    const parts = trimmedVal.split(/[\/\-\.]/);
    if (parts.length === 3) {
      // Assume dd/mm/yyyy format and convert to mm/dd/yyyy for parsing
      dateToTest = `${parts[1]}/${parts[0]}/${parts[2]}`;
    }
  }

  const parsed = Date.parse(dateToTest);
  if (isNaN(parsed)) {
    // Try alternative parsing for dd/mm/yyyy format
    if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/.test(trimmedVal)) {
      const parts = trimmedVal.split(/[\/\-\.]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        // Basic validation
        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if the parsed date is within a reasonable range
  const date = new Date(parsed);
  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  return dateYear >= 1900 && dateYear <= currentYear + 10;
};
