STEPS TO SETUP PROJECT LOCALLY

1. install redis from official website https://redis.io/download/
2. run redis server using command `redis-server`
4. install nodejs LTS from official website https://nodejs.org/en/download
4. clone the repo inside any directory or download the zip file
5. run `npm i`
6. create `.env` file with following variables
    a. PORT=3001
    a. REDIS_EXP_TIME=300
    a. JWT_PRIVATE_KEY="any-most-secret-key"
    a. MONGO_URI="usl-to-mongodb/Ecommerce-db?"
7. run server using `npm start`

OR

THIS API IS HOSTED HERE
https://nice-pear-abalone-wig.cyclic.cloud/
https://ecommerce-api-wpiv.onrender.com/

For `SWAGGER` docs go to `/api-docs/`

=============================================================Authentication Routes
1. `/api/auth/login`    (POST)
    <= request body = {
        email: "your-email@provider.com",
        password: "min-8-digit-password"
    }
    => returns jwtToken 

2. `/api/auth/signup`   (POST)
    <= request body = {
        userName: "your name",
        phone: "10-digit-phone-number"
        email: "your-email@provider.com",
        password: "min-8-digit-password"
    }
    => returns jwtToken 

============================================================== Product Routes
1. `/api/products/categories/all`   (GET)
    => returns all the categories

2. `/api/products/categories/category/:categoryId`  (GET)
    => returns specific category

3. `/api/products/:categoryId`  (GET)
    => returns all product of specific category

4. `/api/products/product/:productId`  (GET)
    => returns specific product

============================================================== Cart Routes
1. `/api/cart/get`: (GET)
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => returns cart of the user 

2. `/api/cart/add`  (POST)
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    <= requestBody = {
        addToCart: {
            quantity: number-of-product,
            productId: "id-of-product"
        }
    }
    => returns updated cart 

3. `/api/cart/add/:productId`  (PUT)
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => returns updated cart 

4. `/api/cart/remove/all`  (DELETE)
    : empty cart 
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => returns empty cart 

5. `/api/cart/remove/:productId`  (DELETE)
    : remove porduct from cart 
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => returns updated cart 

=========================================================== Order Routes
1. `/api/orders/all` (GET)
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => all the orders by user

2. `/api/orders/order/:orderId`  (GET)
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => specific order

3. `/api/orders/order` (PUT)
    : places order from cart 
    <= requiresHeader = {
          x-auth-token: jwtToken
        }
    => returns order details

******************************************************************************************