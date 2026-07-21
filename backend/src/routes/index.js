const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/banners', require('./banner.routes'));
router.use('/cart', require('./cart.routes'));
router.use('/wishlist', require('./wishlist.routes'));
router.use('/orders', require('./order.routes'));
router.use('/upload', require('./upload.routes'));

module.exports = router;
