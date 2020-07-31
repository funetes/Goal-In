const checkValidateTerm = function (term) {
  const terms = term.split('-');
  terms.forEach(date => {
    if (
      !/^(19[0-9][0-9]|20[0-9][0-9])\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/i.test(
        date
      )
    ) {
      throw new Error('term validate error');
    }
  });
};

module.exports = { checkValidateTerm };
