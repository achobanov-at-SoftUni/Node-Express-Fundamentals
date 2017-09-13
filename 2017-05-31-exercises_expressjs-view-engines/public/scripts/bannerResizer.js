const bannerWrapper = $('#banner');

// HOMEWORK ONLY: Close Greeting message listener
$(function() {
    $('#close-greeting').on('click', function() {
        $('#greet').remove();
    });
});
// HOMEWORK ONLY \\

$(document).ready(() => {
    resizeBannerHeight();
});

$(window).on('resize', () => {
    resizeBannerHeight();
});

function resizeBannerHeight() {
    let width = Number(bannerWrapper.css('width').replace('px', ''));
    let height = width / 8;

    bannerWrapper.css('height', `${height}` );
}