$('.mdc-button').click(function() {
    if($('textarea')[0].textLength < 1)
        alert("Please input content");
});