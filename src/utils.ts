const startsWithIgnoreCase = (str: string, prefix: string): boolean => str.toLowerCase().startsWith(prefix.toLowerCase());

const extractCommandPrompt = (message: string, prefix: string): string | null => {
	if (!startsWithIgnoreCase(message, prefix)) {
		return null;
	}

	const separator = message.at(prefix.length);
	if (separator !== undefined && !/\s/.test(separator)) {
		return null;
	}

	return message.slice(prefix.length).trim();
};

export { extractCommandPrompt, startsWithIgnoreCase };
