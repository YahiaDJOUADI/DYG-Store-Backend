const { generateUrl } = require("../helpers/url");

module.exports = (product) => {
    return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: generateUrl(product.image.replaceAll('\\', '/')),
        category: product.category,
        brand: product.brand, 
        platforms: product.category === "Video Games" ? product.platforms : undefined, 
    };
};
