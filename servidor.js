import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const apiKey = process.env.GOOGLE_API_KEY; 


const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

app.get('/', (req,res) => {
    res.send('API ok')
})


app.post('/api/google', async (req, res) => {
    const { texto } = req.body



    if(!texto) {
        return res.status(400).json({error: 'Texto é obrigatório'})
    }

    try {

        if (!apiKey) {
            console.log("❌ ERRO: Chave 'Google_api' não encontrada no .env");
            return res.status(400).json({error: 'Chave Google_api não encontrada no .env'})
        }

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

const port = process.env.PORT || 3002
app.listen(port, () => {
   console.log(`Servidor rodando na porta ${port}`);
})   