const Product = require("../../mongo/models/product-model");
const Category = require("../../mongo/models/category-model");
const { getKey, setExKey, deleteKey } = require('../../redis/redis-services');

async function getAllCategories() {
    let categories;
    let isCached = false;
    let error = '';
    try {
        const cacheResults = await getKey('categories');

        if (cacheResults) {
            isCached = true;
            categories = cacheResults;
            if (!categories) {
                deleteKey('categories');
                isCached = false;
                categories = await Category.find({});
                if (categories) {
                    setExKey('categories', categories);
                }
            }
        } else {
            categories = await Category.find({});
            if (categories) {
                setExKey('categories', categories);
            }
        }
    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: categories, isCached: isCached, error: error };
}

async function getCategory(categoryId) {
    let category;
    let isCached = false;
    let error = '';
    try {
        const cacheResults = await getKey('categories');

        if (cacheResults) {
            isCached = true;
            category = cacheResults?.find((cat) => cat._id === categoryId);
            if (!category) {
                isCached = false;
                category = await Category.findById(categoryId);
            }
        } else {
            category = await Category.findById(categoryId);
        }
    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: category, isCached: isCached, error: error };
}

async function getProductDetails(productId) {
    let product;
    let isCached = false;
    let error = '';
    try {
        const cacheResults = await getKey(productId);

        if (cacheResults) {
            isCached = true;
            product = new Product(cacheResults);

            if (!product) {
                deleteKey(productId);
                isCached = false;
                product = await Product.findById(productId);
                if (product) {
                    setExKey(productId, product);
                }
            }
        } else {
            product = await Product.findById(productId);
            if (product) {
                setExKey(productId, product);
            }
        }

    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: product, isCached: isCached, error: error };
}

async function getAllProductWithCategory(categoryId) {
    let products;
    let isCached = false;
    let error = '';
    try {
        const cacheResults = await getKey(categoryId);

        if (cacheResults) {
            isCached = true;
            products = cacheResults;

            if (!products) {
                deleteKey(categoryId);
                isCached = false;
                products = await Product.find({ category: categoryId });
                if (products) {
                    setExKey(categoryId, products);
                }
            }
        } else {
            products = await Product.find({ category: categoryId });
            if (products) {
                setExKey(categoryId, products);
            }
        }

    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: products, isCached: isCached, error: error };
}

async function updateProductDetails(productId, dataToUpdate) {
    let error = '';
    let message = '';
    try {
        await Product.findByIdAndUpdate(productId, dataToUpdate);
        let product = await getKey(productId);
        if (product)
            setExKey(productId, { ...product, ...dataToUpdate });
        message = 'product data updated';
    } catch (e) {
        error = e;
        console.log("[MONGO]: no updation performed on product");
    }
    return { message: message, error: error };
}

module.exports = { getAllCategories, getCategory, getProductDetails, getAllProductWithCategory, updateProductDetails };