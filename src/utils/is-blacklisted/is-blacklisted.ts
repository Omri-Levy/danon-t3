export const isBlacklisted = (value, blacklist) =>
	blacklist.some((b) => b === value);
