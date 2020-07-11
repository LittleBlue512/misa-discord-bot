var Bot = {};

Bot.name = 'Misa';

Bot.help_list = [
    'misa',
    'misa help',
    'misa cat',
    'misa cat fact',
    'misa shiba',
    'misa joke',
    'misa quote',
    'misa prog quote',
    'misa covid19 thai',
    'misa covid19 global',
    'misa anime [category]',
    'misa binance [symbol]',
    'misa avatar [identidier]',
    'misa photo [width] [height]',
    'misa code'
];

Bot.dev_list = [
    'misa dev',
    'misa dev help',
    'misa dev command list',
    'misa dev command clear',
    'misa dev command add [key] [response]'
];

Bot.staff_list = [
    'misa staff',
    'misa staff help',
    'misa staff command list',
    'misa staff command add [key] [response]'
];

Bot.prefixs = {
    general: 'misa',
    dev: 'misa dev',
    staff: 'misa staff'
};

Bot.channels = {
    dev: 'misa-bot-dev',
    talk: 'misa-bot-talk'
};

Bot.master = 'LittleBlue';

Bot.staffs = [
    'LittleBlue',
    'Ren'
];

Bot.apis = {
    CATPICS_API: 'https://api.thecatapi.com/v1/images/search',
    CATFACTS_API: 'https://cat-fact.herokuapp.com/facts/random',
    JOKES_API: 'https://sv443.net/jokeapi/v2/joke/Any',
    SHIBAS_API: 'http://shibe.online/api/shibes',
    COVID19_THAI_API: 'https://covid19.th-stat.com/api/open/today',
    COVID19_GLOBAL_API: 'https://api.covid19api.com/summary',
    BINANCE_PRICE_API: 'https://api.binance.com/api/v3/ticker/price?symbol=',
    ANIME_API: 'https://kitsu.io/api/edge/anime',
    PROGRAMMING_QUOTE_API: 'https://programming-quotes-api.herokuapp.com/quotes/random',
    QUOTE_API: 'https://quote-garden.herokuapp.com/api/v2/quotes/random',
    PHOTO_API: 'https://picsum.photos',
    AVATAR_API: 'https://api.adorable.io/avatars/285'
};

module.exports = Bot;