const joi = require("joi");

async function validateOrderData(data) {
    const schema = joi.object({
        createdOn: joi.string().required(),
        completedOn: joi.string(),
    });

    try {
        await schema.validateAsync(data);
    } catch (err) {
        return err;
    }
}

module.exports = { validateOrderData };
