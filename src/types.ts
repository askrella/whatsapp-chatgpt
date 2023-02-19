export enum dalleImageSize {
    small = "256x256",
    medium = "512x512",
    large = "1024x1024"
}

export enum configTarget {
    dalle = "dalle",
    // chatgpt = "chatgpt"
}

export enum dalleConfigType {
    size = "size"
}

const configTypes = {
    dalle: dalleConfigType
}

const configValues = {
    dalle: {
        size: dalleImageSize
    }
}
