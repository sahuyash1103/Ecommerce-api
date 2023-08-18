const joi = require("joi");

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

async function validateSignupData(user) {
  const schema = joi.object({
    userName: joi.string().min(3).max(50).required(),
    phone: joi.string().length(10).pattern(phoneRegExp).required(),
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(8).max(255).required(),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

async function validateLoginData(user) {
  const schema = joi.object({
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(8).max(255).required(),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

async function validateUserUpdateData(dataToUpdate) {

  const schema = joi.object({
    userName: joi.string().min(3).max(50),
    phone: joi.string().length(10).pattern(phoneRegExp),
    email: joi.string().min(10).max(255).email(),
    password: joi.string().min(8).max(255),
  });

  try {
    await schema.validateAsync(dataToUpdate);
  } catch (err) {
    return err;
  }
}

module.exports = { validateSignupData, validateLoginData, validateUserUpdateData };
