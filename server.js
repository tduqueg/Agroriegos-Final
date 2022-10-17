const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(
  'sk_test_51LthRxHRPBXA1owAAzZrwHo7LrauHdZC9TTm2IyYwCoReL2jceL2vwueAI9eFYSJinsEbGGqDlL2w6uhFT46p4DZ00H74nWLHi'
);

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenido a Agroriegos!');
});

app.post('/checkout', async (req, res) => {
  let error;
  let status;
  try {
    const { cart, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: cart.totalPrice * 100,
        currency: 'COP',
        customer: customer.id,
        receipt_email: token.email,
        description: 'products descriptions here',
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      { idempotencyKey: key }
    );
    status = 'success';
  } catch (error) {
    console.log(error);
    status = 'error';
  }
  res.json({ status });
});

app.listen(8080, () => {
  console.log('Tu aplicación se está ejecutando en el puerto # 8080');
});
