import isEmail from "validator/lib/isEmail";

export const validateEmail = (value) => {
  const email = typeof value === "string" ? value.trim() : "";
  if (!email || email.length > 254) return false;
  return isEmail(email, { allow_utf8_local_part: false });
};
