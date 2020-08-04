const checkNullAndUndefined = obj => {
  for (let key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      return false;
    }
  }
  return true;
};

module.exports = { checkNullAndUndefined };
