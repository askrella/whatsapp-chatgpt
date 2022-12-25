import * as dotenv from 'dotenv'
import process from 'process'
import qrcode from 'qrcode-terminal'
import { Client, type Message } from 'whatsapp-web.js'
import { ChatGPTAPIBrowser } from 'chatgpt'

// Environment variables
dotenv.config()

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED === 'true'
const prefix = '!gpt'

// Whatsapp Client
const client = new Client({})

// ChatGPT Client
const api = new ChatGPTAPIBrowser({
  email: process.env.EMAIL as string,
  password: process.env.PASSWORD as string,
})

// Entrypoint
const start = async () => {
  // Ensure the API is properly authenticated
  try {
    await api.initSession()
  } catch (error: any) {
    console.error(
      '[Whatsapp ChatGPT] Failed to authenticate with the ChatGPT API: ' +
        error.message
    )
    process.exit(1)
  }

  // Whatsapp auth
  client.on('qr', qr => {
    console.log('[Whatsapp ChatGPT] Scan this QR code in whatsapp to log in:')
    qrcode.generate(qr, { small: true })
  })

  // Whatsapp ready
  client.on('ready', () => {
    console.log('[Whatsapp ChatGPT] Client is ready!')
  })

  // Whatsapp message
  client.on('message', async message => {
    if (message.body.length === 0 || message.from === 'status@broadcast') return

    if (!prefixEnabled) {
      await handleMessage(message, message.body)
      return
    }

    if (message.body.startsWith(prefix)) {
      // Get the rest of the message
      const prompt = message.body.substring(prefix.length + 1)
      await handleMessage(message, prompt)
    }
  })

  client.initialize()
}

const handleMessage = async (message: Message, prompt: string) => {
  try {
    const start = Date.now()

    // Send the prompt to the API
    console.log(
      '[Whatsapp ChatGPT] Received prompt from ' + message.from + ': ' + prompt
    )
    const response = await api.sendMessage(prompt)

    console.log(
      `[Whatsapp ChatGPT] Answer to ${message.from}: ${response.response}`
    )

    const end = Date.now() - start

    console.log('[Whatsapp ChatGPT] ChatGPT took ' + end + 'ms')

    // Send the response to the chat
    message.reply(response.response)
  } catch (error: any) {
    console.error('An error occured', error)
    message.reply(
      'An error occured, please contact the administrator. (' +
        error.message +
        ')'
    )
  }
}

void start()
