const checkValidateTermFormat = function (term) {
  const terms = term.split('-');
  terms.forEach(date => {
    if (
      !/^(19[0-9][0-9]|20[0-9][0-9])\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])$/i.test(
        date
      )
    ) {
      throw new Error('term validate error');
    }
  });
  const startDate = terms[0];
  const endDate = terms[1];

  const startSplit = startDate.split('/').map(el => parseInt(el));
  const endSplit = endDate.split('/').map(el => parseInt(el));

  const startYear = startSplit[0];
  const endYear = endSplit[0];

  const startMonth = startSplit[1];
  const endMonth = endSplit[1];

  const startDay = startSplit[2];
  const endDay = endSplit[2];

  if (startYear > endYear) {
    throw new Error('term validate error');
  }
  if (startMonth > endMonth) {
    throw new Error('term validate error');
  }
  if (startMonth === endMonth) {
    if (startDay > endDay) {
      throw new Error('term validate error');
    }
  }
};

module.exports = { checkValidateTermFormat };
