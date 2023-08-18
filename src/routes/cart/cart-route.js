const authenticate = require('../../middlewares/authenticate-user');
const { getProductDetails } = require('../../services/product/product-services');
const { getUserCart } = require('../../services/user/cart-services');
const { validateAddToCartData } = require('../../services/user/cart-validation');
const { getUserData } = require('../../services/user/user-services');

const router = require('express').Router();

router.get("/get", authenticate, async (req, res) => {
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;
    res.status(200).json([...cart]);
});

router.post("/add", authenticate, async (req, res) => {
    const reqData = req.body.addToCart;
    let error = await validateAddToCartData(reqData);
    if (error) return res.status(400).send(error);

    let result = await getProductDetails(reqData.productId);
    if (result.error) return res.status(500).send(result.error);

    let product = result.data;
    if (!product) return res.status(404).send('product not found');

    result = await getUserData(email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    for (let i = 1; i <= reqData.quantity; i++)
        user.cart.push(product._id);

    await updateUserData(user.email,
        { cart: user.cart }
    );

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json([...cart]);
});

router.put("/add/:productId", authenticate, async (req, res) => {
    let result = await getProductDetails(req.params.productId);
    if (result.error) return res.status(500).send(result.error);

    let product = result.data;
    if (!product) return res.status(404).send('product not found');

    result = await getUserData(email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    user.cart.push(product._id);

    await updateUserData(user.email,
        { cart: user.cart }
    );


    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json([...cart]);
});

router.delete("/remove/:productId", authenticate, async (req, res) => {
    let result = await getUserData(email);
    if (result.error) return { status: 500, data: '', error: result.error };

    let user = result.data;
    if (!user) return { status: 404, data: '', error: 'user not found' };

    if (user.cart.includes(productId))
        return { status: 200, data: '', error: 'product is already removed' }

    const index = user.cart.indexOf(productId);
    user.cart.splice(index, 1);

    await updateUserData(user.email,
        { cart: user.cart }
    );

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json([...cart]);
});

module.exports = router