import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { data } from "./data";
import { config } from "dotenv";

config();

const BOT_ID = process.env.BOT_ID || "";
const BOT_TOKEN = process.env.BOT_TOKEN || "";

const body = [new SlashCommandBuilder().setName("votes").setDescription("查看開票進度")].map((c) => c.toJSON());

const rest = new REST().setToken(BOT_TOKEN);

try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(BOT_ID), { body });

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}

export const bot = new Client({
    intents: ["Guilds"],
});

bot.on("ready", () => {
    console.log("Bot is ready");
});

bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const chan = interaction.channel;
    if (!chan) {
        return;
    }

    await interaction.deferReply();

    for (let i = 0; i < 4 * 10; i++) {
        const result = await data();

        const progress = Math.round((result.counted / result.total) * 1000) / 10;
        const total_votes = result.leader.reduce((acc, cur) => acc + cur.votes, 0);

        let output = `# 開票進度: ${progress}%\n\n`;
        output += "## 總統得票數\n";
        for (const d of result.leader) {
            output += `- ${d.candidate}: ${d.votes} (${Math.round((d.votes / total_votes) * 1000) / 10}%)\n`;
        }
        output += "\n";
        output += "## 立委席次\n";
        for (const [party, seats] of Object.entries(result.seats)) {
            output += `- ${party}: ${seats}\n`;
        }

        await interaction.editReply(output);

        await new Promise((resolve) => setTimeout(resolve, 60_000 / 4));
    }
});

bot.login(BOT_TOKEN);
