// const { SlashCommandBuilder } = require('discord.js');
// Importing discord.js and destructuring SlashCommandBuilder from it

const axios = require('axios');
// Importing axios, which is a promise-based HTTP client for the browser and node.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Responds to user prompts with random messages!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Enter your prompt here')
                .setRequired(true)),
    // module exports an object with 'data' property containing command info (name, description and options) and execute method
   
    async execute(interaction) {
        const prompt = interaction.options.getString('input'); 
        // get the user input/prompt as a string from options

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
            // Send POST request to the OpenAI API with the prompt and related parameters 

            const messageContent = response.data.choices[0].text.trim();
            // get the generated message from choices array of response data
            
            await interaction.reply(messageContent);
            // sending the generated text back as the response message to user's input.
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error processing your request, please try again later.');
            // if any errors encountered during the process, logging the error and sending error message
        }
    },
};
