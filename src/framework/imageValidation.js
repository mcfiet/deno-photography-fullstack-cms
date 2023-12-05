const isMimetypeOk = (type) =>
  type == "image/png" || type == "image/jpg" || type == "image/jpeg";
const isExtensionOk = (name) => {
  const splittetArray = name.split(".");
  return splittetArray[splittetArray.length - 1] == "png" ||
    splittetArray[splittetArray.length - 1] == "jpg" ||
    splittetArray[splittetArray.length - 1] == "jpeg" ||
    splittetArray[splittetArray.length - 1] == "PNG" ||
    splittetArray[splittetArray.length - 1] == "JPG" ||
    splittetArray[splittetArray.length - 1] == "JPEG";
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
