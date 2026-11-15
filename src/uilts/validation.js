export function validateApplication(values) {
  const errors = {};

  // Phone: 8 digits, starting with 6, 8 or 9 (Singapore number)
  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^[689]\d{7}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid 8-digit Singapore number (starts with 6, 8 or 9).";
  }

  if (!values.experience) {
    errors.experience = "Please select your experience level.";
  }

  const reason = values.reason.trim();
  if (!reason) {
    errors.reason = "Please tell us why you want to join.";
  } else if (reason.length < 20) {
    errors.reason = `Please write at least 20 characters (currently ${reason.length}).`;
  } else if (reason.length > 300) {
    errors.reason = "Please keep it within 300 characters.";
  }

  if (!values.agree) {
    errors.agree = "You must agree to attend the trial session if shortlisted.";
  }

  return errors;
}