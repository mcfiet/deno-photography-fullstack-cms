const isMimetypeOk = (type) =>
  type == "image/png" || type == "image/jpg" || type == "image/jpeg";
const isExtensionOk = (name) => {
  const splittetArray = name.split(".");
  return (
    splittetArray[splittetArray.length - 1] == "png" ||
    splittetArray[splittetArray.length - 1] == "jpg" ||
    splittetArray[splittetArray.length - 1] == "jpeg" ||
    splittetArray[splittetArray.length - 1] == "PNG" ||
    splittetArray[splittetArray.length - 1] == "JPG" ||
    splittetArray[splittetArray.length - 1] == "JPEG"
  );
};

const POST_FILE_LIMIT = 1024 * 1024 * 5; // 5 MB

export function validateImage(file) {
  if (!file) return;
  if (file.size == 0) return;
  if (file.size > POST_FILE_LIMIT) {
    return "Datei zu groß.";
  }
  if (isMimetypeOk(file.type) && isExtensionOk(file.name)) {
    return "Validiert";
  }
  return "Dateiformat nicht zulässig.";
}

export const validateEmail = (email) => {
  const re = /^([\w]{2,20})(@)([\w]{2,4})+\.([\w]{2,4})$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const re =
    /(?=.*[0-9])(?=.*[A-Z])(?=^.*[a-z])(?=^.*[,.:_#+~<>!§$%&(){}=?@]).{8,}/;
  return re.test(password);
};

export const validateUsername = (username) => {
  const re = /(?=^.{4,}$)(?=^.*[a-zA-Z]$)/;
  return re.test(username);
};

export const validateText = (name, minLength, maxLength) => {
  const re = new RegExp(
    "^[a-zA-Z0-9s.,:;&%öäüÖÄÜ\\s]{" + minLength + "," + maxLength + "}$"
  );
  return re.test(name);
};

export const validateNumber = (inputNumber) => {
  const number = new Number(inputNumber);
  if (!isNaN(number) && number > 0) {
    return true;
  }
  return false;
};

export const getFormErrors = (formData) => {
  const formErrors = {};
  if (
    (formData.username || formData.username == "") &&
    !validateUsername(formData.username)
  ) {
    formErrors.username = "Falsche Eingabe: mind. 4 Zeichen und nur Buchstaben";
  }
  if (
    (formData.name || formData.name == "") &&
    !validateText(formData.name, 4, 50)
  ) {
    formErrors.name = "Falsche Eingabe: mind. 4 Zeichen und nur Buchstaben";
  }
  if (
    (formData.subject || formData.subject == "") &&
    !validateText(formData.subject, 4, 50)
  ) {
    formErrors.subject = "Falsche Eingabe: mind. 4 Zeichen und nur Buchstaben";
  }
  if (
    (formData.message || formData.message == "") &&
    !validateText(formData.message, 4, 500)
  ) {
    formErrors.message = "Falsche Eingabe: mind. 4 Zeichen und nur Buchstaben";
  }
  if (
    (formData.email || formData.email == "") &&
    !validateEmail(formData.email)
  ) {
    formErrors.email =
      "Falsche Eingabe: Geben Sie eine gültige Emailadresse ein.";
  }
  if (
    (formData.password || formData.password == "") &&
    !validatePassword(formData.password)
  ) {
    formErrors.password =
      "Falsche Eingabe: mind. 6 Zeichen, ein Großbuchstabe, ein Kleinbuchstabe, eine Zahl und ein Sonderzeichen";
  }
  if (
    (formData.role_name || formData.role_name == "") &&
    !validateText(formData.role_name, 4, 50)
  ) {
    formErrors.role_name =
      "Bitte gib einen gültigen Titel ohne Sonderzeichen zwischen 4 und 50 Zeichen ein";
  }
  if (
    (formData.album_title || formData.album_title == "") &&
    !validateText(formData.album_title, 4, 50)
  ) {
    formErrors.album_title =
      "Bitte gib einen gültigen Titel ohne Sonderzeichen zwischen 4 und 50 Zeichen ein";
  }
  if (
    (formData.product_name || formData.product_name == "") &&
    !validateText(formData.product_name, 4, 50)
  ) {
    formErrors.product_name =
      "Bitte gib einen gültigen Namen ohne Sonderzeichen zwischen 4 und 50 Zeichen ein";
  }
  if (
    (formData.product_text || formData.product_text == "") &&
    !validateText(formData.product_text, 4, 255)
  ) {
    formErrors.product_text =
      "Bitte gib einen gültigen Text ohne Sonderzeichen zwischen 4 und 255 Zeichen ein";
  }
  if (
    (formData.product_price || formData.product_price == "") &&
    !validateNumber(formData.product_price)
  ) {
    formErrors.product_price = "Bitte gib eine valide Nummer über 0 an";
  }
  if (
    (formData.product_priceDes || formData.product_priceDes == "") &&
    !validateText(formData.product_priceDes, 4, 20)
  ) {
    formErrors.product_priceDes =
      "Bitte gib einen gültige Beschreibung ohne Sonderzeichen zwischen 4 und 50 Wörtern ein";
  }
  return formErrors;
};
