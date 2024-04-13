const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const BuyerModel = require('./models/Buyer.js');
const SellerModel = require('./models/Seller.js');
const Product = require('./models/productModel.js');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;





// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// Define your routes here

// Start server
const PORT = process.env.PORT || 3000;



mongoose.connect('mongodb+srv://gaganraghav143:41I20u65Prsld0jJ@cluster0.9thzedv.mongodb.net/')
.then(() => console.log('Connected to database'))
.catch(()=>console.log("could not connect to database"));

const storage = multer.diskStorage({});
const upload = multer({ storage });


cloudinary.config({
    cloud_name: "duyne05yg",
    api_key: "392199442626637",
    api_secret: "jRSyIYt8-fwIUz23Pcg6aDnOnPQ",
  });


app.post('/signupbuyer', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await BuyerModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new BuyerModel({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up' });
    }
});

app.post('/loginbuyer', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await BuyerModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create and return JWT token
        const token = jwt.sign({ id:user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token,  userID:user._id});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.post('/signupseller', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await SellerModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new SellerModel({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up' });
    }
});

app.post('/loginseller', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await SellerModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create and return JWT token
        const token = jwt.sign({ id:user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token,  userID:user._id});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});



// Route to create a new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.json({ url: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });


  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});