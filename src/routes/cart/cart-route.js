/**
 * @swagger
 * /api/cart/get:
 *  get:
 *      summery: to get the cart of the user
 *      tags: [CART]
 *      parameters:
 *          - in : header
 *            name: x-auth-token
 *            discription: jwt token provided during login 
 *            required: true  
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: user not found or no orders yet
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: array [list] of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              length:
 *                                  type: number
 *                                  description: length of cart
 *                              cart:
 *                                  type: array
 *                                  discription: list of user cart 
 *                                  items:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Cart'
 * 
 *
 * /api/cart/add:
 *  post:
 *      summery: to get the cart of the user
 *      tags: [CART]
 *      parameters:
 *          - in : header
 *            name: x-auth-token
 *            discription: jwt token provided during login 
 *            required: true  
 *      requestBody:
 *          discription: data for add to cart
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          addToCart:
 *                              type: object
 *                              properties:
 *                                  quantity:
 *                                      type: number
 *                                      required: true
 *                                  productId:
 *                                      type: string
 *                                      required: true
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: user or product not found or cart is empty
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: no addToCart details provided.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: array [list] of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              length:
 *                                  type: number
 *                                  description: length of cart
 *                              cart:
 *                                  type: array
 *                                  discription: list of user cart 
 *                                  items:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Cart'
 * 
 *
 * /api/cart/add/{productId}:
 *  put:
 *      summery: to get the cart of the user
 *      tags: [CART]
 *      parameters:
 *          - in : path
 *            name: productId
 *            discription: id of the product to add to cart 
 *            required: true  
 *          - in : header
 *            name: x-auth-token
 *            discription: jwt token provided during login 
 *            required: true  
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: product or user not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: array [list] of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              length:
 *                                  type: number
 *                                  description: length of cart
 *                              cart:
 *                                  type: array
 *                                  discription: list of user cart 
 *                                  items:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Cart'
 * 
 *
 * /api/cart/remove/{productId}:
 *  delete:
 *      summery: to get the cart of the user
 *      tags: [CART]
 *      parameters:
 *          - in : path
 *            name: productId
 *            discription: id of the product to remove from cart 
 *            required: true  
 *          - in : header
 *            name: x-auth-token
 *            discription: jwt token provided during login 
 *            required: true  
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: user not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: array [list] of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object || string
 *                          discription: string if product is already removed
 *                          properties:
 *                              length:
 *                                  type: number
 *                                  description: length of cart
 *                              cart:
 *                                  type: array
 *                                  discription: list of user cart 
 *                                  items:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Cart'
 * 
 *
 * /api/cart/remove/all:
 *  delete:
 *      summery: to get the cart of the user
 *      tags: [CART]
 *      parameters:
 *          - in : header
 *            name: x-auth-token
 *            discription: jwt token provided during login 
 *            required: true  
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          404:
 *              description: user not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: array [list] of orders
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              length:
 *                                  type: number
 *                                  description: length of cart
 *                              cart:
 *                                  type: array
 *                                  discription: list of user cart 
 *                                  items:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Cart'
 * 
 */


const authenticate = require('../../middlewares/authenticate-user');
const { getProductDetails } = require('../../services/product/product-services');
const { getUserCart } = require('../../services/user/user-cart-services');
const { validateAddToCartData } = require('../../services/user/user-cart-validation');
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
    if (!reqData) return res.status(400).send('no addToCart details provided.');

    let error = await validateAddToCartData(reqData);
    if (error) return res.status(400).send(error.details[0].message);

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