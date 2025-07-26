const mongoose = require('mongoose');
const express = require("express");
const app = express();
app.use(express.json());


// Connection URI
const MONGO_URI = `YOUR DB URL FROM MONGODB`;


let DisplayName; // This will be your model for `displayname` collection

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");

    //connection to a specific database in a cluster in mongodb atlas
    const usersDB = mongoose.connection.useDb('Users');

    // Define schema (even a dummy one if you don’t know fields)
    // You create a schema with no defined fields.
    // { strict: false } means Mongo will accept any fields in the documents (like flexible structure).
    const displayNameSchema = new mongoose.Schema({}, { strict: false });


    // Explicitly tell Mongoose to use the 'display name' collection
    DisplayName = usersDB.model('DisplayName', displayNameSchema, 'display name');

    console.log("🔄 Model ready for 'displayname' collection in 'Users' DB");

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

app.get('/displaynames', async (req, res) => {
  try {
    const results = await DisplayName.find();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectToDatabase().then(() => {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
