/**
 * @swagger
 * /api/orders/all:
 *  get:
 *      summery: to get the orders history of the user
 *      tags: [ORDERS]
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
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Order'
 * 
 * /api/orders/order/{orderId}:
 *  get:
 *      summery: to get order of the user
 *      tags: [ORDERS]
 *      parameters:
 *          - in : path
 *            name: orderId
 *            discription: order id of the order
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
 *              description: user not found or no orders yet
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          200:
 *              discription: order with order id 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Order'
 * 
 * 
 * /api/orders/order/:
 *  put:
 *      summery: to place the order
 *      tags: [ORDERS]
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
 *              discription: order with order id 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              placedOrder: 
 *                                  type: object
 *                                  $ref: '#/components/schemas/Order'
 *                              logs: 
 *                                  type: object
 *                                  description: logs during placing the orders
 * 
 */


const authenticate = require('../../middlewares/authenticate-user');
const { getOrderDetails, PlaceOrder } = require('../../services/order/order-services');
const { getUserOrders } = require('../../services/user/user-order-service');
const { getUserData, updateUserData } = require('../../services/user/user-services');

const router = require('express').Router();

router.get('/all', authenticate, async (req, res) => {
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    const user = result.data;
    if (!user) return res.status(404).send('user not found');

    result = await getUserOrders(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    const orders = result.data;
    if (!orders)
        return res.status(404).send("no orders yet");

    res.status(200).json([...orders]);
})

router.get('/order/:orderId', authenticate, async (req, res) => {
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    const user = result.data;
    if (!user) return res.status(404).send('user not found');

    let orderId = user.orders.find(id => String(id) === req.params.orderId);
    if (!orderId)
        return res.status(404).send("order not found or it's not your order ? ");

    result = await getOrderDetails(orderId);
    if (result.error) return res.status(500).send(result.error);

    const order = result.data;
    if (!order)
        return res.status(404).send("order not found");

    res.status(200).json({ ...order._doc });
})

router.put('/order', authenticate, async (req, res) => {
    let result = await getUserData(req.user.email);
    if (result.error) return res.status(500).send(result.error);

    const user = result.data;
    if (!user) return res.status(404).send('user not found');

    if (!user.cart || user.cart.length === 0) return res.status(200).send('no products in cart');
    result = await PlaceOrder(user.cart);
    order = result.newOrder;
    if (!order)
        return res.status(500).json({ message: 'order can not be placed', logs: result.logs });

    await updateUserData(user.email, {
        $push: { orders: order._id },
        $set: { cart: [] }
    });

    res.status(200).json({ placedOrder: order, logs: result.logs });
})

module.exports = router;