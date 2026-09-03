const OpenAI = require('openai')
const imageAnalysis = require('./imageAnalysis')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const callAi = async (prompt, data) => {
    const prompts = {
        imageAnalysis: imageAnalysis.prompt(data)
    }[prompt]



    // return prompts

    return await openai.responses.create(prompts)
}

module.exports = { callAi }