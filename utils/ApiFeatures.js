class ApiFeatures {
  constructor(urlQuery, dbQuery) {
    this.urlQuery = urlQuery;
    this.dbQuery = dbQuery;
  }

  filter() {
    const excludedFields = ["sort", "fields", "limit", "page", "search"];
    const queryObj = { ...this.urlQuery };
    Object.entries(queryObj).forEach(([key, value]) => {
      if (excludedFields.includes(key)) delete queryObj[key];
    });
    const query = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    console.log(query);

    this.dbQuery = this.dbQuery.find(JSON.parse(query));
    return this;
  }

  limitFields() {
    if (this.urlQuery) {
      const fields = this.urlQuery.fields?.replaceAll(",", " ");
      this.dbQuery = this.dbQuery.select(fields);
    }
    return this;
  }
  sort() {
    if (this.urlQuery) {
      const sortBy = this.urlQuery.sort?.replace(",", " ");
      this.dbQuery = this.dbQuery.sort(sortBy);
    }
    return this;
  }

  pagination() {
    const limit = this.urlQuery.limit || 100;
    const page = this.urlQuery.page || 1;
    const skip = limit * (page - 1);
    this.dbQuery = this.dbQuery.skip(skip).limit(limit);
    return this;
  }

  search() {
    if (this.urlQuery.search) {
      const searchBy = this.urlQuery.search;
      this.dbQuery = this.dbQuery
        .find({
          $text: { $search: searchBy },
        })
        .sort({ score: { $meta: "textScore" } });
    }
    return this;
  }
}

module.exports = ApiFeatures;
