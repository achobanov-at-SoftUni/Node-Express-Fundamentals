const MESSAGE_WRAPPER = $('#message-wrapper');

const MESSAGE_TIMESPAN = 3000;
const CLASS_MESSAGE = 'message';

function printMsg(type, msg) {
    MESSAGE_WRAPPER
        .css('height', `50px`)
        .append(
            $('<h2>')
                .attr('class', CLASS_MESSAGE)
                .attr('id', type)
                .text(msg)
                .hide());

    let messageElement = $('.message');

    setTimeout(() => messageElement.fadeIn(500), 200);

    setTimeout(() => {
        messageElement.fadeOut(500);
        setTimeout(() => {
            MESSAGE_WRAPPER.empty().css('height', 0);
        }, 300);
    }, MESSAGE_TIMESPAN);
}