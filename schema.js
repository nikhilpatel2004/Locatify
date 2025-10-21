const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      // image is an object in the form (listing[image][url]) and in the model
      image: joi
        .object({
          url: joi.string().allow("", null),
        })
        .optional(),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
