import express from "express";
import { mongo } from '../models/model.js';

const router = express.Router();

router.post('/', async (request, response) => {
    try {
        const { name, basePrice } = request.body;
        if (
            !name,
            !basePrice
        ) {
            return response.status(400).send({ message: "enter details" });
        }
        const infodetails = {
            name: request.body.name ,
            basePrice: request.body.basePrice,
            increment: request.body.increment,
            currentPrice: basePrice,
            intervalDays: request.body.intervalDays,
            lastPriceUpdate: new Date()
        }

        const product = await mongo.create(infodetails);

        return response.status(200).send(product);
    }
    catch (error) {
        console.log(error);
        return response.status(400).send({ message: "error" })
    }
})


router.get('/search', async (req, res) => {
    const { name } = req.query;
  
    try {
      const products = await mongo.find({ name: { $regex: name, $options: 'i' } });
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
router.get('/', async (request, response) => {
    try {
        const product = await mongo.find({})

        return response.status(200).send(product);
    } catch (error) {
        console.log(error);
        return response.status(400).send({ message: "error" })
    }
})

router.get('/:id', async (request, response) => {
    try {
        const product = await mongo.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Update price if needed
        const now = new Date();
        const daysSinceLastUpdate = Math.floor((now - new Date(product.lastPriceUpdate)) / (1000 * 60 * 60 * 24));

        if (daysSinceLastUpdate >= product.intervalDays) {
            const increments = Math.floor(daysSinceLastUpdate / product.intervalDays);
            product.currentPrice = product.basePrice + (increments * product.increment);
            product.lastPriceUpdate = now;
            await product.save();
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const product = await mongo.findByIdAndDelete(id);

        if (!product) {
            return response.status(400).send({ message: "not found" });
        }

        return response.status(200).send({ message: "deleted" })
    } catch (error) {
        console.log(error);
        return response.status(200).send({ message: error.message });
    }
})

export default router;