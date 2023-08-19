// --------------------------- swagger COMPONENTS
/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *          title:
 *              type: string
 *              discription: title [name] of product
 *
 *          availability:
 *              type: bool
 *              discription: availability of product
 *
 *          images:
 *              type: array
 *              items:
 *                  type: string
 *                  discription: links to images of product
 *
 *          category:
 *              type: array
 *              discription: catagory of product
 *              items:
 *                  type: object
 *                  $ref: '#/components/schemas/Category'
 *
 *          discription:
 *              type: string
 *              discription: discription of product
 *
 *          totalNumberOfProduct:
 *              type: number
 *              discription: total Number Of Product
 *
 *          numberOfProductSold:
 *              type: number
 *              discription: number Of Product Sold
 *
 *          price:
 *              type: number
 *              discription: price of product
 *
 *    Category:
 *      type: object
 *      properties:
 *          title:
 *              type: string
 *              discription: title [name] of category
 *
 *          availability:
 *              type: bool
 *              discription: product availability of that category
 * 
 *    Order:
 *      type: object
 *      properties:
 *          createdOn:
 *              type: string
 *              discription: date of order placement
 *
 *          completedOn:
 *              type: string
 *              discription: date of order completion
 *
 *          isCompleted:
 *              type: bool
 *              discription: order is completed or not
 *
 *          products:
 *              type: array
 *              discription: products that are included in order
 *
 *          totalPrice:
 *              type: number
 *              discription: total price of order
 *
 *    User:
 *      type: object
 *      properties:
 *          userName:
 *              type: string
 *              discription: name of user
 *
 *          phone:
 *              type: string
 *              discription: phone number of user
 *
 *          email:
 *              type: string
 *              discription: email of user
 *    Cart:
 *      type: object
 *      properties:
 *          quantity:
 *              type: number
 *              discription: number of this products in cart
 *          product:
 *              type: string || object
 *              discription: product Id or product details
 *              $ref: '#/components/schemas/Product'
 */
// --------------------------------swagger tags
/**
 * @swagger
 * tags:
 *  - name: STATUS
 *    description: to check server status
 *
 *  - name: AUTH
 *    description: to login or signup
 *
 *  - name: PORDUCTS
 *    description: to get the details of the product
 *
 *  - name: ORDERS
 *    description: to place an order or to check its info
 *
 *  - name: CART
 *    description: to get, add or remove producy from cart
 */

// --------------------------swagger STATUS ROUTES
/**
 * @swagger
 * /:
 *  get:
 *      summary: returns the server status
 *      tags: [STATUS]
 *      responses:
 *          200:
 *              description: to check the server status
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  discription: server is running
 *                              error:
 *                                  type: string || object
 *                                  discription: errors while loading the server.
 * /api:
 *  get:
 *      summary: returns the server status
 *      tags: [STATUS]
 *      responses:
 *          200:
 *              description: to check the server status
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  discription: server is running
 *                              error:
 *                                  type: object || string
 *                                  discription: errors while loading the server
 */


// -----------------------------IMPORTS AND VARIABLES
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { PORT } = require('./src/utils/get-env');
const { initMongo } = require('./src/mongo/mongo-services');
const { initRedis } = require('./src/redis/redis-services');
const { checkEnvironmentVariable } = require('./src/utils/check-env-var');

const loginRoute = require('./src/routes/auth/login-route');
const signupRoute = require('./src/routes/auth/signup-route');
const categoryRoute = require('./src/routes/product/category-route');
const productRoute = require('./src/routes/product/product-route');
const cartRoute = require('./src/routes/cart/cart-route');
const orderRoute = require('./src/routes/order/order-route');

let error;
const app = express();

// ----------------------------------CHECK ENV VARIABLES
error = checkEnvironmentVariable();

// ----------------------------------INIT MONGO AND REDIS
initRedis();
initMongo();

// -------------------------CORS
app.use(
    cors({
        origin: "*",
        methods: "*",
        allowedHeaders: "*",
        exposedHeaders: "*",
    })
);

// ---------------------------------SWAGGER SETUP
const swaggerOtions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ecommerce API",
            version: "1.0.0",
            description: "A simple Express Ecommerce API",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [
        "./index.js",
        "./src/routes/*/*.js",
    ],
}

const specs = swaggerJsDoc(swaggerOtions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// ----------------------------------MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// -----------------------------------OTHER ROUTES
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/signup", signupRoute);
app.use("/api/products/categories", categoryRoute);
app.use("/api/products/", productRoute);
app.use("/api/orders/", orderRoute);
app.use("/api/cart/", cartRoute);

// -----------------------------------SERVER STATUS ROUTES
app.get('/', (req, res) => {
    res.json({ message: 'server is runnin...', error: error }).status(200);
});

app.get('/api/', (req, res) => {
    res.json({ message: 'server is runnin...', error: error }).status(200);
});

// ---------------------------------SERVER LISTENING
app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}...`);
})