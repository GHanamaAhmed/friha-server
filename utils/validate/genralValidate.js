const joi = require("joi");
const { objectId } = require("./validateObjctId");
const removeValidate = joi.object({
  id: objectId.required(),
});
const couponValidate = joi.object({
  code: joi.string().required(),
});
const fetchOneValidate = joi.object({
  id: objectId.required(),
});
const photoValidate = joi.object({
  type: joi.string().required(),
  folderName: joi.string().required(),
  fileName: joi.string(),
});
const rangeValidate = joi.object({
  min: joi.number(),
  max: joi.number(),
  type: joi.string(),
  name: joi.string(),
  reverse: joi.string(),
});
const fetchOneValidateOP = joi.object({
  id: objectId,
});
module.exports = {
  photoValidate,
  fetchOneValidate,
  removeValidate,
  rangeValidate,
  fetchOneValidateOP,
  couponValidate,
};
