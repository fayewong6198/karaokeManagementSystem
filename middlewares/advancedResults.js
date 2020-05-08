const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  console.log(1);
  // Create remove field
  let removeFields = [
    "select",
    "sort",
    "limit",
    "page",
    "checkInDate",
    "checkOutDate",
  ];

  // Copy req.query
  const reqQuery = { ...req.query };

  // Delete removeField from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Stringify req.query
  queryStr = JSON.stringify(reqQuery);

  // Change lte, gte, ... to $lte, $gte, ...
  queryStr = queryStr.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  // Query
  console.log(2);
  query = model.find(JSON.parse(queryStr));

  // Select field
  if (req.query.select) {
    const field = req.query.select.split(",").join(" ");
    query = query.select(field);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  console.log(3);
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  let results = await query;
  console.log(4);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  let finalResult = results;
  console.log(5);
  res.advancedResults = {
    success: true,
    count: finalResult.length,
    pagination,
    data: finalResult,
  };

  console.log(3);
  next();
};

module.exports = advancedResults;
