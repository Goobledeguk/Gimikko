// =============================================================================
// utils/date.js — small date helpers shared by the Discover and Calendar
// screens and the events service. Everything works on plain 'YYYY-MM-DD'
// strings (the same format the database's `date` column uses) so that time
// zones can never shift an event to the wrong day.
// =============================================================================

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-10-12' -> 'Oct 12, 2026'
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

// Today's date on THIS device, as 'YYYY-MM-DD'. Deliberately not
// new Date().toISOString(): that gives the UTC date, which is still
// "yesterday" in the Philippines between midnight and 8 AM.
export function localTodayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
