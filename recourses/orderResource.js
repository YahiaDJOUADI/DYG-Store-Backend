const { generateUrl } = require("../helpers/url");

module.exports = (order) => {
  return {
    id: order._id,
    user: order.user,
    products: order.products.map(product => ({
      productId: {
        id: product.productId._id,
        name: product.productId.name,
        description: product.productId.description,
        price: product.productId.price,
        stock: product.productId.stock,
        image: product.productId.image ? generateUrl(product.productId.image.replace(/\\/g, '/')) : null,
        category: product.productId.category,
        brand : product.productId.brand
      },
      quantity: product.quantity,
      platform: product.platform, // Include platform in the response
    })),
    totalPrice: order.totalPrice,
    name: order.name,
    phone: order.phone,
    wilaya: order.wilaya,
    address: order.address,
    status: order.status,
    orderDate: order.orderDate,
    deliveryDate: order.deliveryDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};