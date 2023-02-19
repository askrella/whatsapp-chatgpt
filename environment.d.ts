declare global {
    namespace NodeJS {
        interface ProcessEnv {
            OPENAI_API_KEY: string;
            PREFIX_ENABLED: string;
            REPLY_SELF_ENABLED: string;
        }
    }
}

export {}