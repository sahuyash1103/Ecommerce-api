
// ---------------------------/API/PRODUCTS/ ROUTE
/**
 * @swagger:
 * /api/products/{categoryId}:
 *  get:
 *      parameters:
 *          - in: path
 *            name: categoryId
 *            required: true
 *      summery: returns all the product with category id
 *      tags: [PORDUCTS]
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          200:
 *              discription: all the product with category id {categoryId}
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Product'                 
 * 
 * /api/products/product/{productId}:
 *  get:
 *      parameters:
 *          - in: path
 *            name: productId
 *            required: true
 *      summery: returns product having id {productId}
 *      tags: [PORDUCTS]
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: product not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: product with id {productId}
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Product'                 
 */


// ---------------------------------IMPORTS
const router = require("express").Router();
const { getProductDetails, getAllProductWithCategory } = require("../../services/product/product-services");

router.get("/:categoryId", async (req, res) => {
    const result = await getAllProductWithCategory(req.params.categoryId);
    if (result.error) return res.status(500).send(result.error);

    const products = result.data;
    console.log(result)
    res.status(200).json(products);
});

router.get("/product/:productId", async (req, res) => {
    const result = await getProductDetails(req.params.productId);
    if (result.error) return res.status(500).send(result.error);

    const product = result.data;
    if (!product) return res.status(404).send('product not found');

    res.status(200).json(product);
});

module.exports = router;
