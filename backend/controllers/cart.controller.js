import Product from "../models/product.model.js";
export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    //add quantity for each product in the cart
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("Error getting cart products", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addCart = async (req, res) => {
  try {
    // Assuming you have a User model and a Cart model
    const { productId } = req.body;
    const user = req.user;

    // Check if the item already exists in the cart
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // If the item doesn't exist, add it to the cart
      user.cartItems.push(productId);
    }

    // Save the updated user document
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error adding to cart", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Assuming you have a User model and a Cart model
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Check if the item already exists in the cart
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    // Save the updated user document
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Assuming you have a User model and a Cart model
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    // Check if the item already exists in the cart
    const existingItem = user.cartItems.find((item) => item.id === productId);

    // If the item exists, update its quantity
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.log("Error updating quantity", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
