import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai' // Certifique-se que instalou este!
import dotenv from 'dotenv'
import { error } from 'console'

dotenv.config()

const app = express()
app.use(cors(
    origin: 
))
app.use(express.json())

const apiKey = process.env.Google_api; 

if (!apiKey) {
    console.error("❌ ERRO: Chave 'Google_api' não encontrada no .env");
}

const genAI = new GoogleGenerativeAI(apiKey)

app.post('/api/google', async (req, res) => {
    const { texto } = req.body
    console.log(texto)
    try {
        if (!texto) {
            return res.status(400).json({ error: "Texto é obrigatório" })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

        if (!model) {
            return res.status(500).json({error: "Falha ao inicializar o modelo Gemini."});
        }

        const result = await model.generateContent(texto)
        const response = await result.response
        const text = response.text()

        console.log(text)

        return res.json({ text })

    } catch (error) {
        console.error('Erro detalhado no servidor:', error)
        return res.status(500).json({ 
            error: 'Erro ao processar sua solicitação',
            details: error.message 
        })
    }
})

let port = 3002
app.listen(port, () => {
    console.log('Servidor rodando em http://localhost:' + port)
})