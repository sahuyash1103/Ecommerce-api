
// ---------------------------/API/PRODUCTS/CATEGORIES/ ROUTE
/**
 * @swagger:
 * /api/products/categories/all:
 *  get:
 *      summery: returns all the categories
 *      tags: [PORDUCTS]
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          200:
 *              discription: all the product categories fetched successfuly
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Category'
 *
 * /api/products/categories/category/{categoryId}:
 *  get:
 *      parameters:
 *          - in: path
 *            name: categoryId
 *            required: true
 *      summery: returns category having id {categoryId}
 *      tags: [PORDUCTS]
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: category not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: catgeory with id {categoryId}
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Category'
 */




// ---------------------------------IMPORTS
const router = require("express").Router();
const { getAllCategories, getCategory } = require("../../services/product/product-services");

router.get("/all", async (req, res) => {
    const result = await getAllCategories();
    if (result.error) return res.status(500).send(result.error);

    const categories = result.data;
    res.status(200).json([...categories]);
});

router.get("/category/:id", async (req, res) => {
    const result = await getCategory(req.params.id);
    if (result.error) return res.status(500).send(result.error);

    const category = result.data;
    if (!category) return res.status(404).send('category not found');

    res.status(200).json(category);
});

module.exports = router;
