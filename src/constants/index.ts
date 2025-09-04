/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  TYPING_SIMULATION_DELAY: 2000,
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

export const ROUTES = {
  HOME: '/',
  DISCUSSION: '/discussion/:id',
} as const;

export const UI_TEXT = {
  APP_TITLE: 'Art Talks',
  SEARCH_PLACEHOLDER: 'Search artworks...',
  NO_RESULTS: 'No artworks found matching',
  ARTWORK_NOT_FOUND: 'Artwork not found',
  BACK_TO_GALLERY: 'Back to Gallery',
  DISCUSSION_TITLE: 'Discussion',
  MESSAGE_PLACEHOLDER: 'Type your message here...',
  SEND_BUTTON: 'Send',
  TYPING_INDICATOR: 'is typing...',
} as const;

export const SAMPLE_RESPONSES = [
  'Great observation!',
  'I agree with your perspective.',
  'That\'s an interesting interpretation.',
  'Thanks for sharing your thoughts!',
  'I see it differently, but I appreciate your view.',
  'The technique used here is fascinating.',
  'What draws you to this particular aspect?',
] as const;
