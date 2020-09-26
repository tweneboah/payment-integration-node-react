const express = require('express');
const cors = require('cors');
require('./config/dbConnect')();
const request = require('request');
const Donotion = require('./models/Donotion');
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000', //Location of the react app to connect
    credentials: true,
  })
);

//1. Initialize payment
app.post('/api/paystack/pay', (req, res) => {
  console.log('req.body,', req.body);
  //Options for request
  //This is the required field by paystack
  const formData = {
    email: req.body.email,
    amount: parseInt(req.body.amount) * 100, //This is how paystack requires if you are paying cedis
  };
  //Adding additional fields
  formData.metadata = {
    fullName: 'Emmanuel',
    phoneNumber: '487ehwjehwjew',
  };
  const options = {
    url: 'https://api.paystack.co/transaction/initialize',
    form: formData,
    headers: {
      authorization: 'Bearer your key here',
    },
  };
  //Make the request
  request.post(options, function (err, response, body) {
    if (err) {
      console.log(err);
    } else {
      // The body contains the url created for payment and the reference
      // convert it from json to object
      const responseData = JSON.parse(body);
      const { authorization_url } = responseData.data; //you copy and paste this authorization_url  into the browswer and it will open a form for you
      //We have to redirect the user to the url created
      //This will handle by our client so we send it to the client
      res.status(200).json({ url: authorization_url });
    }
  });
});

//2. Verify Payment
//We need the reference automatically after initialization and it can be access as req.query.reference

//We should set this route in our paystack dashboard
app.get('/api/paystack/callback', (req, res) => {
  // We have access to the reference after we initailiaze the payment it's available as req.query.reference
  const userReferenceFromInitializePayment = req.query.reference;
  const options = {
    url:
      'https://api.paystack.co/transaction/verify/' +
      encodeURIComponent(userReferenceFromInitializePayment),
    headers: {
      authorization: 'Bearer your key here',
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
  };
  request.get(options, async (err, response, body) => {
    if (err) {
      console.log('Error occured', err);
    } else {
      //Convert the response
      const resData = JSON.parse(body);
      //destructure and save important details you want base on your model
      //Divide the amount by 100 to get the actual amount paying;
      const amount = resData.data.amount / 100;
      const { reference } = resData.data;
      //get full name
      const { fullName } = resData.data.metadata;
      //Save this to the database
      const newDonation = new Donotion({ amount, reference, fullName });
      await newDonation.save();
      //We want to print a receipt like emma paid GHS 400 to Teklinco so we will redirect and create a route for that
      //Since we cannot access the user about the payment we will do internal redirecting therefore we have to create this route for our react app to use it
      res.redirect(`/payment-success/${newDonation._id}`);
    }
  });
});

// We need to print receipt to the user like emma you paid 700GHS to Teklinco
app.get('/payment-success/:id', async (req, res) => {
  try {
    //Get the id of the user
    const userId = req.params.id;
    //Find the user in the database
    const user = await Donotion.findById(userId);
    //Redirect to UI
    res.status(200).json({ user: user });
    // res.send(user);
  } catch (error) {
    console.log(error);
  }
});
app.listen(5000, () => {
  console.log('Server is runing');
});
