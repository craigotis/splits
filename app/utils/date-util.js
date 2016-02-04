export function daysThisWeek(currentDate) {
    var days = [];
    if (currentDate === undefined) {
        currentDate = new Date();
    }
    for (var i = 0; i < 7; i++) {
        var theDay = new Date(currentDate.getTime());
        theDay.setDate(currentDate.getDate() - i);
        days.push(theDay);
        if (theDay.getDay() === 1) {
            break;
        }
    }
    days.reverse();
    return days;
}

function daysThisMonth(currentDate) {
    var days = [];
    if (currentDate === undefined) {
        currentDate = new Date();
    }
    var startingMonth = currentDate.getMonth();
    var currentDay = new Date(currentDate.getTime());
    while (true) {
        days.push(currentDay);
        currentDay = new Date(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
        if (currentDay.getMonth() !== startingMonth) {
            break;
        }
    }
    return days;
}

export function daysOfMonth(containingDate) {
    if (containingDate === undefined) {
        containingDate = new Date();
    }
    while (containingDate.getDate() !== 1) {
        containingDate.setDate(containingDate.getDate() - 1);
    }
    return daysThisMonth(containingDate);
}

export function daysOfWeek(containingDate) {
    if (containingDate === undefined) {
        containingDate = new Date();
    }
    while (containingDate.getDay() !== 0) {
        containingDate.setDate(containingDate.getDate() + 1);
    }
    return daysThisWeek(containingDate);
}

export function getShortMonth(month) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
}

export function getShortDayOfWeek(dayOfWeek) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
}

export function getFullDayOfWeek(dayOfWeek) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

export function dateEquals(one, two) {
    if (one.getDate() !== two.getDate()) {
        return false;
    }
    if (one.getMonth() !== two.getMonth()) {
        return false;
    }
    if (one.getYear() !== two.getYear()) {
        return false;
    }
    return true;
}
