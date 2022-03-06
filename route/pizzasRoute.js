const router = require("express").Router();
const Pizzas = require("../models/pizzaMolde");

router.get('/',async (req,res)=>{
    try {
        const pizzas = await Pizzas.find();
        res.status(200).json(pizzas);
        
    } catch (error) {
        res.status(400).json({message:error.message});
        
    }
});


module.exports = router;