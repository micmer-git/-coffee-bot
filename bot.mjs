import "dotenv/config";
import { Client, GatewayIntentBits, EmbedBuilder, Events } from "discord.js";
import { createClient } from "@supabase/supabase-js";

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // Service key: uso server-side
);

// Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, c =>
  console.log(`🤖 Logged in as ${c.user.tag}`)
);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "coffee") return;

  const type = interaction.options.getString("type");
  const user = interaction.member.displayName ?? interaction.user.username;

  const { error } = await supabase
    .from("coffee_entries")
    .insert({ user, type });

  if (error) {
    console.error(error);
    await interaction.reply({
      content: "🚫 Errore nel salvare il caffè, riprova.",
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x6f4e37)
    .setTitle("☕ Caffè registrato!")
    .addFields(
      { name: "Utente", value: user, inline: true },
      { name: "Tipo",   value: type, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
});

client.login(process.env.DISCORD_TOKEN);
