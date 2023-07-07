const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { initDb } = require("./config/dbinit.config");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const catogoriesRoutes = require("./routes/catogories.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const cartsRoutes = require("./routes/carts.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const shopRoutes = require("./routes/shop.routes");
const orderRoutes = require("./routes/orders.routes");
const userRoutes = require("./routes/user.routes");

const { globalErrorHandler } = require("./middleware/errorHandler.middleware");
const Order = require("./models/order.model");
const stripe = require("stripe")(
  "sk_test_51NCDBnFLDQjuRWyyAX8r0gTPwhDfTaflddqfpeyIEkOCuPdQABENE254snHMOVp3BObbHrme2MFmlJyV01rYZl5O00323z8xqB"
);
const app = express();

const endpointSecret = "we_1NEFxfFLDQjuRWyy1RfLPEiG";

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
initDb();
app.use(cors({ origin: true }));
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        console.log(event.data.object);
        const intent = event.data.object;
        const order = JSON.parse(intent.metadata);
        const { products, totalPrice, shippingAddress, customer } = order;
        const newOrder = new Order({
          products,
          shippingAddress,
          customer,
          totalPrice,
        });

        await newOrder.save();

        break;
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }
);

const url = "/api/v1";

app.use(express.static("public"));
app.use(`${url}/auth`, authRoutes);
app.use(`${url}/products`, productsRoutes);
app.use(`${url}/catogories`, catogoriesRoutes);
app.use(`${url}/reviews`, reviewsRoutes);
app.use(`${url}/cart`, cartsRoutes);
app.use(`${url}/favorites`, favoritesRoutes);
app.use(`${url}/shop`, shopRoutes);
app.use(`${url}/orders`, orderRoutes);
app.use(`${url}/user`, userRoutes);

app.use((req, res, next) => {
  res
    .status(404)
    .json({ message: "Sorry, we can't find that route! " + req.url });
});

app.use(globalErrorHandler);

module.exports = app;
