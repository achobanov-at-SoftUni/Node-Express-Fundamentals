const delimiter = /[ ,.?!]/;
const tagMatcher = new RegExp(/^#([a-z0-9]+)$/i);
const handleMatcher = new RegExp(/^@([a-z0-9]+)$/i);

module.exports = {
    get: (tweetContent, mode) => {
        let matcher;
        switch (mode) {
            case'handles': matcher = handleMatcher; break;
            default: matcher = tagMatcher; break;
        }

        let words = tweetContent.split(delimiter);
        let elements = [];
        for (let word of words) {
            let match = matcher.exec(word);
            if (match) {
                elements.push(match[1]);
            }
        }

        return elements;
    },
};

