const emojis = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
    windy: '🌬️'
};

export function getAllEmojis() {
    return Object.values(emojis);
}

export function getEmojiForCondition(condition) {
    return emojis[condition] || '❓'; // Return a question mark emoji if the condition is not found
}