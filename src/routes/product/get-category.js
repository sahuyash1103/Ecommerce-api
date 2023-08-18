// ---------------------------------IMPORTS
const router = require("express").Router();
const { getAllCategories, getCategory } = require("../../services/product/product-services");

// ------------------------------------------SINGUP ROUTE
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
