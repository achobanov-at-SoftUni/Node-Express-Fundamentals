const Tag = require('mongoose').model('Tag');

module.exports = {
    tagsAreEqual: (currentTags, editedTags) => {
        if (currentTags.length !== editedTags.length) {
            return false;
        }

        for (let i = 0, n = currentTags.length; i < n; i++) {
            let currentTagsContainsEditedTag = currentTags.indexOf(editedTags[i]) !== -1;
            let editedTagsContainCurrentTag = editedTags.indexOf(currentTags[i]) !== -1;

            if (!currentTagsContainsEditedTag || !editedTagsContainCurrentTag) {
                return false;
            }
        }

        return true;
    },
    getTags: (base, tagsToCompare) => {
        let tags = [];
        for (let i = 0, n = tagsToCompare.length; i < n; i++) {
            if (base.indexOf(tagsToCompare[i]) === -1) {
                tags.push(tagsToCompare[i]);
            }
        }

        return tags;
    },
    addTags: (tagsToAdd, tags, tweetId) => {
        for (let tagToAdd of tagsToAdd) {
            tags.push(tagsToAdd);

            Tag.findOne({ name: tagToAdd }).then(existingTag => {
                if (!existingTag) {
                    let tagData = {
                        name: tagToAdd,
                        tweets: [ tweetId ]
                    };
                    Tag.create(tagData).then(tag => {
                        if (!tag) { console.log('Cannot create tag'); }
                    });

                    return;
                }

                existingTag.tweets.push(tweetId);
                existingTag.save();
            })
        }

        return tags;
    },
    removeTags: (tagsToRemove, tags, tweetId) => {
        for (let tagToRemove of tagsToRemove) {
            let index = tags.indexOf(tagToRemove);
            if (index !== -1) {
                tags.splice(index, 1);

                Tag.findOne({ name: tagToRemove }).then(tag => {
                    if (!tag) { console.log('Cannot find tag!'); return; }

                    let tagContainsOnlyThisTweet = tag.tweets.length === 1;
                    if (tagContainsOnlyThisTweet) {
                        tag.remove();
                        return;
                    }

                    let indexOfThisTweet = tag.tweets.indexOf(tweetId);
                    tag.tweets.splice(indexOfThisTweet, 1);
                    tag.save();
                })
            }
        }

        return tags;
    }
};

