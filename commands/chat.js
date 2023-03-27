const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Responds to user prompts with random messages!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Enter your prompt here')
                .setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('input');
        try {
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt,
                max_tokens: 150,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const messageContent = response.data.choices[0].text.trim();
            await interaction.reply(messageContent);
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error processing your request, please try again later.');
        }
    },
};
