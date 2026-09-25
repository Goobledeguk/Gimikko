// Temporary stand-in for "the logged-in user" until you have real auth
// or a backend. This lives in its own file so every screen that needs it
// imports the SAME object, instead of each screen typing its own copy
// (which would drift out of sync the moment one gets edited).
//
// Why not just pass it as a prop from Home to CalendarScreen? Because
// Home and CalendarScreen are SIBLING tabs — React Navigation renders
// each tab independently, there's no parent/child relationship between
// them the way normal components have. A shared file is the simple
// solution

export const user = {
  name: 'Nigel',
  rating: 5,
  eventsAttended: 5,
};