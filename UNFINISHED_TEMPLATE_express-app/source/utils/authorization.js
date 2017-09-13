
module.exports = (topic, user) => {
    let isAuthor = topic.author.equals(user._id);
    let isAdmin = user.roles.indexOf('Admin') !== -1;

    return isAdmin || isAuthor;
};