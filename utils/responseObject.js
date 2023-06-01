function sendResponse(
  res,
  satusCode,
  status,
  data = undefined,
  token = undefined
) {
  res.status(satusCode).json({
    status,
    data,
    token,
  });
}

module.exports = {
  sendResponse,
};
