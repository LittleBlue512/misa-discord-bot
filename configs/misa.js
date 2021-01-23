var Bot = {};

Bot.name = 'Misa';

Bot.help_list = [
    'misa',
    'misa help',
    'misa covid19 thai',
    'misa covid19 global',
    'misa code',
    'misa kanji rand <number>',
    'misa kanji list',
    'misa kanji list <from> <to>',
    'misa kanji count',
    'misa kanji find <kanji>',
    'misa i love you'
];

Bot.dev_list = [
    'misa dev',
    'misa dev help',
    'misa dev staff list',
    'misa dev staff add [name]',
    'misa dev staff remove [name]',

];

Bot.staff_list = [
    'misa staff',
    'misa staff help',
    'misa staff kanji add <kanji>',
    'misa staff kanji remove <kanji>',
    'misa staff cleanchatprefix list',
    'misa staff cleanchatprefix add <prefix>',
    'misa staff cleanchatprefix remove <prefix>',
];

Bot.prefixes = {
    general: 'misa',
    dev: 'misa dev',
    staff: 'misa staff'
};

Bot.channels = {
    dev: '💾-dev'
};

Bot.master = 'LittleBlue';

Bot.apis = {
    CATPICS_API: 'https://api.thecatapi.com/v1/images/search',
    CATFACTS_API: 'https://cat-fact.herokuapp.com/facts/random',
    JOKES_API: 'https://sv443.net/jokeapi/v2/joke/Any',
    SHIBAS_API: 'http://shibe.online/api/shibes',
    COVID19_THAI_API: 'https://covid19.th-stat.com/api/open/today',
    COVID19_GLOBAL_API: 'https://api.covid19api.com/summary',
    BINANCE_PRICE_API: 'https://api.binance.com/api/v3/ticker/price?symbol=',
    PROGRAMMING_QUOTE_API: 'https://programming-quotes-api.herokuapp.com/quotes/random',
    QUOTE_API: 'https://quote-garden.herokuapp.com/api/v2/quotes/random',
    PHOTO_API: 'https://picsum.photos',
};

// Load from database
Bot.cleanChatPrefixes = [];
Bot.staffs = [];

module.exports = Bot;