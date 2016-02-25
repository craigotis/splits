import * as DateUtil from './date-util';
import * as NumberUtil from './number-util';

export function speedToPace(speed) {
    var paceUnrounded = (26.82 / speed);
    var minutes = Math.floor(paceUnrounded);
    var seconds = ((paceUnrounded.toFixed(3) % 1) * 60).toFixed(0);
    if (seconds == 60) {
        minutes++;
        seconds = 0;
    }
    return minutes + ':' + NumberUtil.padDigits(seconds, 2);
}

export function mostFrequentRunDay(activities) {
    var dayCounts = {};
    $.each([0, 1, 2, 3, 4, 5, 6], function(idx) {
        dayCounts[idx] = 0;
    });
    $.each(activities, function(idx, el) {
        dayCounts[el.get('date').getDay()] = dayCounts[el.get('date').getDay()] + 1;
    });
    var maxDay = 0;
    var maxCount = 0;
    $.each([0, 1, 2, 3, 4, 5, 6], function(idx) {
        var runsForThisDay = dayCounts[idx];
        if (runsForThisDay > maxCount) {
            maxCount = runsForThisDay;
            maxDay = idx;
        }
    });
    return {
        day: DateUtil.getFullDayOfWeek(maxDay),
        count: maxCount
    };
}

export function mileageSum(activities) {
    var mileage = 0;
    $.each(activities, function(idx, el) {
        mileage += parseFloat(el.get('distanceInMiles'));
    });
    return mileage.toFixed(1);
}

export function matchActivities(activities, dateList) {
    var matchingActivities = [];
    $.each(activities, function(idx, el) {
        $.each(dateList, function(idx2, el2) {
            if (DateUtil.dateEquals(el.date, el2)) {
                matchingActivities.push(el);
            }
        });
    });
    return matchingActivities;
}

export function getAverageWeeklyMileage(activities, startingOffset) {
    if (startingOffset === undefined) {
        startingOffset = 0;
    }
    var weeks = createWeeklyStats(activities, 0, 16);
    var sum = 0;
    var count = 0;
    $.each(weeks, function(idx, el) {
        if (idx < (startingOffset - 1)) {
            return true;
        }
        sum += parseFloat(el.mileage);
        count++;
        // Only run 5 times
        if (count >= 5) {
            return false;
        }
    });
    return (count > 0) ? (sum / count).toFixed(1) : 0;
}

function createWeekStats(activities, averageWeeklyMileage, date) {
    var daysForWeek = DateUtil.daysOfWeek(date);
    var dayStats = [];
    $.each(daysForWeek, function(idx, el) {
        var mileage = mileageSum(matchActivities(activities, [el]));
        dayStats.push({
            day: el,
            dayStr: DateUtil.getShortDayOfWeek(el.getDay()),
            mileage: mileage,
            restDay: parseFloat(mileage) === 0,
            today: DateUtil.dateEquals(new Date(), el)
        });
    });
    var description = DateUtil.getShortMonth(daysForWeek[0].getMonth()) + ' ' + daysForWeek[0].getDate();
    description += ' - ';
    description += DateUtil.getShortMonth(daysForWeek[6].getMonth()) + ' ' + daysForWeek[6].getDate();
    var mileageForWeek = mileageSum(matchActivities(activities, daysForWeek));
    var lastWeek = {
        days: dayStats,
        mileage: mileageForWeek,
        description: description,
        restWeek: mileageForWeek < (averageWeeklyMileage * 0.65),
    };
    return lastWeek;
}

export function createWeeklyStats(activities, averageWeeklyMileage, numWeeks) {
    var weeklyStats = [];
    for (var idx = 0; idx < numWeeks; idx++) {
        var date = new Date();
        date.setDate(date.getDate() - (7 * idx));
        weeklyStats.push(createWeekStats(activities, averageWeeklyMileage, date));
    }
    return weeklyStats;
}

function createMonthStats(activities, date) {
    var daysForMonth = DateUtil.daysOfMonth(date);
    var cumulativeMileage = 0;
    var speedTotal = 0;
    var speedCount = 0;
    $.each(matchActivities(activities, daysForMonth), function(idx, el) {
        if (el.get('speed')) {
            speedTotal += el.get('speed');
            speedCount++;
        }
    });
    $.each(daysForMonth, function(idx, el) {
        cumulativeMileage += parseFloat(mileageSum(matchActivities(activities, [el])));
    });
    var description = DateUtil.getShortMonth(date.getMonth()) + ' ' + date.getFullYear();
    var monthStats = {
        mileage: cumulativeMileage.toFixed(2),
        description: description,
        averagePace: speedToPace(speedTotal / speedCount)
    };
    return monthStats;
}

export function createMonthlyStats(activities, numMonths) {
    var monthlyStats = [];
    for (var idx = 0; idx < numMonths; idx++) {
        var date = new Date();
        date.setMonth(date.getMonth() - idx);
        monthlyStats.push(createMonthStats(activities, date));
    }
    return monthlyStats;
}