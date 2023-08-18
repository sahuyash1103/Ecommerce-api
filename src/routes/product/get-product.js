// ---------------------------------IMPORTS
const router = require("express").Router();
const { getProductDetails, getAllProductWithCategory } = require("../../services/product/product-services");

// ------------------------------------------SINGUP ROUTE
router.get("/:categoryId", async (req, res) => {
    const result = await getAllProductWithCategory(req.params.categoryId);
    if (result.error) return res.status(500).send(result.error);

    const products = result.data;
    res.status(200).json([...products]);
});

router.get("/product/:productId", async (req, res) => {
    const result = await getProductDetails(req.params.productId);
    if (result.error) return res.status(400).send(result.error);

    const product = result.data;
    if (!product) return res.status(404).send('product not found');

    res.status(200).json(product);
});

module.exports = router;
