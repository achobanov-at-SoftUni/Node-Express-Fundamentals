
$(document).ready(() => {
    $('#add-song').on('click', (event) => {
        event.preventDefault();
        saveSong();
    });
});


function saveSong() {
    let name = $('#name').val();
    let genre = $('#genre').val();
    let minutes = $('#minutes').val();
    let seconds = $('#seconds').val();
    let band = $('#band').text().replace('Band:', '');
    let ballad = $('#ballad').is(':checked');

    let method = 'POST';
    let url = `${window.location.pathname}`
        + `?name=${name}`
        + `&genre=${genre}`
        + `&minutes=${minutes}`
        + `&seconds=${seconds}`
        + `&band=${band}`
        + `&ballad=${ballad}`;

    $.ajax({ url, method, }).then(response => {
        let setListUl = $('#set-list');
        let setList = setListUl.find('li');
        let songIsPresent = setList.text().indexOf(name) !== -1;
        if (songIsPresent) {
            printMsg('error', 'This track is already on the list');
            return;
        }

        let songIndex = setList.length + 1;
        let songText = `${songIndex}. ${response.data.name} - ${response.data.minutes}:${response.data.seconds}`;
        let LI = $('<li>').text(songText);

        setListUl.append(LI);
    }).catch(err => {
        console.log('Caching error: ', err);
         let errorMessage = err.responseJSON.error;
         location.href = `${location.origin}/?error=${errorMessage}`;
    });
}
