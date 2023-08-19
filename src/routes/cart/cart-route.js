const authenticate = require('../../middlewares/authenticate-user');
const { getProductDetails } = require('../../services/product/product-services');
const { getUserCart } = require('../../services/user/cart-services');
const { validateAddToCartData } = require('../../services/user/cart-validation');
const { getUserData, updateUserData } = require('../../services/user/user-services');

const router = require('express').Router();

router.get("/get", authenticate, async (req, res) => {
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;
    res.status(200).json({ length: cart.length, cart: [...cart] });
});

router.post("/add", authenticate, async (req, res) => {
    const reqData = req.body.addToCart;
    let error = await validateAddToCartData(reqData);
    if (error) return res.status(400).send(error);

    let result = await getProductDetails(reqData.productId);
    if (result.error) return res.status(500).send(result.error);

    let product = result.data;
    if (!product) return res.status(404).send('product not found');

    result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    let cart = user.cart.find(cart => {
        if (String(cart.product) === reqData.productId) {
            cart.quantity += reqData.quantity;
            return true;
        }
    });

    if (!cart) {
        cart = { quantity: reqData.quantity, product: reqData.productId };
        await updateUserData(user.email,
            { $addToSet: { cart: cart } }
        );
    }
    else {
        await updateUserData(user.email, { cart: user.cart });
    };

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json({ length: cart.length, cart: [...cart] });
});

router.put("/add/:productId", authenticate, async (req, res) => {
    let productId = req.params.productId;

    let result = await getProductDetails(productId);
    if (result.error) return res.status(500).send(result.error);

    let product = result.data;
    if (!product) return res.status(404).send('product not found');

    result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    let cart = user.cart.find(cart => {
        if (String(cart.product) === productId) {
            cart.quantity += 1;
            return true;
        }
    });

    if (!cart) {
        cart = { quantity: 1, product: productId };
        await updateUserData(user.email,
            { $addToSet: { cart: cart } }
        );
    }
    else {
        await updateUserData(user.email,
            { cart: user.cart }
        );
    };

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json({ length: cart.length, cart: [...cart] });
});


router.delete("/remove/all", authenticate, async (req, res) => {
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    user.cart = [];

    await updateUserData(user.email,
        { cart: user.cart }
    );

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json({ length: cart.length, cart: [...cart] });
});


router.delete("/remove/:productId", authenticate, async (req, res) => {
    let productId = req.params.productId;
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    let user = result.data;
    if (!user) return res.status(404).send('user not found');

    cart = user.cart.find(cart => {
        if (String(cart.product) === productId) {
            cart.quantity -= 1;
            return true;
        }
    });

    if (!cart)
        return res.status(200).send('product is already removed');

    if (cart.quantity === 0) {
        const index = user.cart.indexOf(cart);
        user.cart.splice(index, 1);
    }

    await updateUserData(user.email,
        { cart: user.cart }
    );

    result = await getUserCart(user.email);
    if (result.error) return res.status(500).send(result.error);

    cart = result.data;

    res.status(200).json({ length: cart.length, cart: [...cart] });
});

module.exports = router