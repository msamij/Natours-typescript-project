import qs, { type ParsedQs } from 'qs';

export class APIFeatures {
  constructor(public query: any, public queryString: ParsedQs) {}

  filter() {
    const queryObj = { ...qs.parse(this.queryString as any) };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.toString().split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.toString().split(',').join(' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page as string) || 1;
    const limit = parseInt(this.queryString.limit as string) || 100;
    const skip = limit * page - limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
