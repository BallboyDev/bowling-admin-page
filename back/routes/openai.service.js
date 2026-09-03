
const { callAi } = require('./openai/openai')
const basicData = require('./openai/basic.json')

const imageAnalysis = async (file, memberList) => {


    return basicData

    // const base64Image = file.buffer.toString('base64')

    // const imageDataUrl =
    //     `data:${file.mimetype};base64,${base64Image}`;


    // const response = await callAi('imageAnalysis', { imageDataUrl, memberList })

    // if (!response.output_text) {
    //     throw new Error(`OPEN AI 응답 이슈 / ${response.status}`)
    // }

    // return {
    //     action: JSON.parse(response.output_text)
    // }
}



module.exports = {
    imageAnalysis
}

