let botReadyTimestamp: Date | null = null;

export function getBotReadyTimestamp(): Date | null {
	return botReadyTimestamp;
}

export function setBotReadyTimestamp(timestamp: Date): void {
	botReadyTimestamp = timestamp;
}
