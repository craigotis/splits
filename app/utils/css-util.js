export function getCSSColor(percentage) {
    var colors = ['#61DE31', '#90DE42', '#BCDE3F', '#DADE53', '#DED55B', '#DEC541', '#DEB643', '#FF7423', '#FF530D', '#E82C0C'];

    var color = '';
    if (percentage !== undefined) {
        for (var i = 0.0; i < 10; i++) {
            if (((i + 1) / 10.0) >= percentage) {
                color = colors[i];
                break;
            }
        }
    }
    return 'color: ' + color + ';';
}