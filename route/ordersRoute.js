const router= require('express').Router()
const stripe = require('stripe')(`${process.env.STRIPE_KEY}`)
const { v4: uuidv4 } = require('uuid');

router.post('/placeorder',async(req,res)=>{
    const {token , subTotal,currentUser,cartItems} = req.body

    try {
        const customer = await stripe.customers.create({
         email:token.email,
         source:token.id
        });

        const payment = await stripe.charges.create({
            amount:subTotal*100,
            currency:"USD",
            customer:customer.id,
            receipt_email:token.email
        },{
            idempotencyKey:uuidv4()
        })

        if(payment){
            return res.send('Payment Done')
        }else{
           return res.send('Payment failed')    
        }
        
    } catch (error) {
        res.status(400).json({mesage:error});
        
    }
})
module.exports = router