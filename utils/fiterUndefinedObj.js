function filterUndefinedObj(obj) {
  const filteredData = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      filteredData[key] = value;
    }
  });
  return filteredData;
}

module.exports = {
  filterUndefinedObj,
};
