const crypto = require("crypto");
global.crypto = crypto;

require("dotenv").config();

const mongoose = require("mongoose");
const Item = require("./models/Item");

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // supprimer anciennes données
    await Item.deleteMany();

    // données réalistes
    await Item.insertMany([
      {
        name: "Préparer la présentation Docker",
        status: "doing",
      },
      {
        name: "Faire les devoirs de programmation",
        status: "todo",
      },
      {
        name: "Réviser MongoDB",
        status: "done",
      },
      {
        name: "Acheter des courses",
        status: "todo",
      },
      {
        name: "Réunion équipe projet",
        status: "doing",
      },
      {
        name: "Corriger les bugs frontend",
        status: "done",
      },
      {
        name: "Préparer le README GitHub",
        status: "done",
      },
      {
        name: "Tester Docker Compose",
        status: "doing",
      },
    ]);

    console.log("🌱 Seed ajouté avec succès");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });