require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const { default: mongoose } = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Recipe = require("./models/recipe.model")

app.use(express.json());

app.use(
    cors({
        origins: "*"
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {

    const { fullName, email,password } = req.body;

    if (!fullName) {
        return res
        .status(400)
        .json({ error: true, message: "Full Name is required" });

    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required "});
    
    }

    if (!password) {
        return res
        .status(400)
        .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "This User already exists",
        });
    }

    const user = newUser({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user}, process.env.ACCESS_TOKEN_SECRET, {
      expireIn: "3600m", 
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",

    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
        
    }

    if (!password) {
        return res.status(400).json ({ message: "Password is required" });

    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found"});
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expireIn: "3600m"
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });

    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

//Add Recipe
app.post("/add-recipe", authenticateToken, async (req, res) => {
    const { title, ingredients, servings, cookTime, directions, tags } = req.body;
    const { user } = req.body;

    if (!title) {
        return res.status(400).json({ error: true, message: "Dish is required" });
    }

    if (!ingredients) {
        return res.status(400).json({ error: true, message: "ingredients are required" })
    }

    if (!servings) {
        return res.status(400).json({ error: true, message: "Servings is required" });
    }

    if (!cookTime) {
        return res.status(400).json({ error: true, message: "Cook Time is required" });
    }

    if (!directions) {
        return res.status(400).json({ error: true, message: "Directions are required" });
    }

    if (!tags) {
        return res.status(400).json({ error: true, message: "Tags are required" });
    }

    try {
        const recipe = newRecipe({
            title,
            ingredients,
            servings,
            cookTime,
            tags: tag || [],
            userId: user.id,
        });

        await recipe.save();
        return res.json({
            error: false,
            recipe,
            message: "recipe added successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

});

//Edit Recipe
app.put("/edit-recipe/recipeId", authenticateToken, async (req, res) => {
    const recipeId = req.params.recipeId;
    const { title, servings, cuisineType, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !servings && !cuisineType && !tags) {
        return res.status(400)
        .json({ error: true, message: "No changes provided"});
    }

    try {
        const recipe = await recipe.findOne({ _id: recipeId, userId: user._id });

        if (!recipe) {
            return res.status(404).json({ error: true, message: "Recipe not found" });
        }

        if (title) recipe.title = recipe;
        if (servings) recipe.servings = servings;
        if (cuisineType) recipe.cuisineType = cuisineType;
        if (tags) recipe.tags = tags;
        if (isPinned) recipe.isPinned = isPinned;

        await recipe.save();

        return res.json({
            error: false,
            recipe,
            message: "Recipe updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "internal Server Error",
        });
    }
});

//Get All Recipe
app.get("/get-all-recipes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const recipes = await Recipe.find({ user: user._id         
        }).sort({ isPinned: -1     
        });

        return res.json({
            error: false,
            recipes,
            message: "All recipes retrieved succesfully",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.listen(8000);

module.exports = app;