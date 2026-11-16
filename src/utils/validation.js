// Contact form validation. Pure functions, no React.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 1200;

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value).trim());
}

// Validate a single field. Returns an error string, or '' if valid.
export function validateField(name, value) {
  const v = String(value ?? '').trim();

  switch (name) {
    case 'name':
      if (!v) return 'Please tell us your name.';
      if (v.length < 2) return 'Name is too short.';
      if (v.length > 80) return 'Name is too long.';
      return '';

    case 'email':
      if (!v) return 'An email address is required.';
      if (!isValidEmail(v)) return 'That email address looks invalid.';
      return '';

    case 'topic':
      if (!v) return 'Please choose a topic.';
      return '';

    case 'message':
      if (!v) return 'Write us a message.';
      if (v.length < MESSAGE_MIN)
        return `Message needs at least ${MESSAGE_MIN} characters (${v.length}/${MESSAGE_MIN}).`;
      if (v.length > MESSAGE_MAX)
        return `Message must be under ${MESSAGE_MAX} characters.`;
      return '';

    default:
      return '';
  }
}

// Validate the whole form. Returns { errors, isValid }.
export function validateContact(values) {
  const fields = ['name', 'email', 'topic', 'message'];
  const errors = {};

  for (const field of fields) {
    const message = validateField(field, values[field]);
    if (message) errors[field] = message;
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}