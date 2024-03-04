function prettyFormatDate(dateString) {
  let date = new Date(dateString);
  date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return date;
}

module.exports = prettyFormatDate;
