const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productModel = require('./models/product.model');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    const products = await productModel.find();

    for (const p of products) {
      let updated = false;

      if (typeof p.sizes === 'string') {
        p.sizes = p.sizes.split(',').map(s => s.trim());
        updated = true;
      }

      if (typeof p.colors === 'string') {
        p.colors = p.colors.split(',').map(c => c.trim());
        updated = true;
      }

      if (updated) {
        await p.save();
        console.log(`Fixed: ${p.name}`);
      }
    }

    console.log('Done fixing all products');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();