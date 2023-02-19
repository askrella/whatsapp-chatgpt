import { Message } from "whatsapp-web.js";
import { aiConfigTarget, aiConfigTypes, aiConfigValues } from "./types/ai-config";

const aiConfig = {
    dalle: {
        size: "512x512",
    },
    // chatgpt: {}
}

const handleMessageAICONFIG = async (message: any, prompt: any) => {
    try {
        console.log("[Whatsapp Config] Received prompt from " + message.from + ": " + prompt)

        const args: string[] = prompt.split(" ")

        if (args.length !== 3) {
            message.reply("Invalid number of arguments, please use the following format: <target> <type> <value>")
            return
        }

        const target: string = args[0]
        const type: string = args[1]
        const value: string = args[2]

        if (!(target in aiConfigTarget)) {
            message.reply("Invalid target, please use one of the following: " + Object.keys(aiConfigTarget).join(", "))
            return
        }

        if (!(type in aiConfigTypes[target])) {
            message.reply("Invalid type, please use one of the following: " + Object.keys(aiConfigTypes[target]).join(", "))
            return
        }

        if (!(value in aiConfigValues[target][type])) {
            message.reply("Invalid value, please use one of the following: " + Object.keys(aiConfigValues[target][type]).join(", "))
            return
        }

        aiConfig[target][type] = value

        message.reply("Successfully set " + target + " " + type + " to " + value)
    } catch (error: any) {
        console.error("An error occured", error)
        message.reply("An error occured, please contact the administrator. (" + error.message + ")")
    }
}

export {
    aiConfig,
    handleMessageAICONFIG
}
