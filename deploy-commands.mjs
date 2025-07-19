import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("coffee")
    .setDescription("Registra un nuovo caffè")
    .addStringOption(o =>
      o.setName("type")
       .setDescription("Tipo di caffè")
       .setRequired(true)
       .addChoices(
         { name: "single",    value: "single" },
         { name: "moka4",     value: "moka4" },
         { name: "americano", value: "americano" },
         { name: "decaf",     value: "decaf" }
       )
    )
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
await rest.put(
  Routes.applicationCommands("YOUR_APP_ID"),   // o Routes.applicationGuildCommands(appId, guildId) per test
  { body: commands }
);
console.log("✅  Slash command deployed");
