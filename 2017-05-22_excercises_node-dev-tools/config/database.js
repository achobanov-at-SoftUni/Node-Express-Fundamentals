let pictures = [];

module.exports.pictures = {
    add: (picture) => {
        "use strict";
        picture.id = pictures.length + 1;
        console.log(`\n__DEV_pictures-pre-push: \n%j`, pictures);
        pictures.push(picture);

        console.log(`\n__DEV_picture-to-add:\n %j`, picture);
        console.log(`__DEV_pictures:\n %j`, pictures);
    },
    findById: (id) => {
        "use strict";
        for (let picture of pictures) {
            if (picture.id == id) {
                return picture;
            }
        }

        return null;
    },
    getAll: () => {
        "use strict";
        return pictures;
    },
    pictures: pictures
};
