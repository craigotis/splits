import * as DateUtil from './date-util';

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
	var weeks = createWeeklyStats(activities);
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
	var description = DateUtil.getShortMonth(daysForWeek[0].getMonth() - 1) + ' ' + daysForWeek[0].getDate();
	description += ' - ';
	description += DateUtil.getShortMonth(daysForWeek[6].getMonth() - 1) + ' ' + daysForWeek[6].getDate();
	var mileageForWeek = mileageSum(matchActivities(activities, daysForWeek));
	var lastWeek = {
		days: dayStats,
		mileage: mileageForWeek,
		description: description,
		restWeek: mileageForWeek > 0 && mileageForWeek < (averageWeeklyMileage * 0.65),
	};
	return lastWeek;
}

export function createWeeklyStats(activities, averageWeeklyMileage) {
	var weeklyStats = [];
	$.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], function(idx, el) {
		var date = new Date();
		date.setDate(date.getDate() - (7 * el));
		weeklyStats.push(createWeekStats(activities, averageWeeklyMileage, date));
	});
	return weeklyStats;
}