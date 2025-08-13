import isEmail from "validator/lib/isEmail";

export const validateEmail = (value) => {
  const email = typeof value === "string" ? value.trim() : "";
  if (!email || email.length > 254) return false;
  return isEmail(email, { allow_utf8_local_part: false });
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};
