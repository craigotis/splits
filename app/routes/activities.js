import Ember from 'ember';
import Activity from '../models/activity';

var STRAVA_ACCESS_KEY = gOptions.access_key;
var STRAVA_API_URL = 'https://www.strava.com/api/v3/athlete/activities';

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            activities: new Ember.RSVP.Promise(function(resolve, reject) {
                $.ajax({
                    url: STRAVA_API_URL,
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        access_token: STRAVA_ACCESS_KEY,
                        per_page: 200
                    }
                }).done(function(res) {
                    var activitiesList = [];
                    var hrLow = 999;
                    var hrHigh = 0;
                    $.each(res, function(idx, obj) {
                        if (obj.type !== 'Run') {
                            // Skip everything that's not a run
                            return true;
                        }
                        var activityDate = new Date(obj.start_date);
                        var newActivity = Activity.create({
                            id: obj.id,
                            distance: obj.distance,
                            date: new Date(obj.start_date),
                            dateStr: getShortDayOfWeek(activityDate.getDay()) + ' ' + activityDate.toLocaleDateString(),
                            speed: obj.average_speed,
                            cadence: obj.average_cadence ? obj.average_cadence * 2.0 : undefined,
                            heartrate: obj.average_heartrate,
                        });
                        console.log('Created an activity');
                        if (!isNaN(newActivity.heartrate)) {
                            hrLow = Math.min(hrLow, newActivity.heartrate);
                            hrHigh = Math.max(hrHigh, newActivity.heartrate);
                        }
                        activitiesList.push(newActivity);
                    });
                    $.each(activitiesList, function(idx, el) {
                        if (isNaN(el.heartrate == undefined)) {
                            el.heartratePercentage = undefined;
                        } else {
                            var percentOfHeart = (el.heartrate - hrLow) / (hrHigh - hrLow);
                            el.heartratePercentage = percentOfHeart;
                        }
                        el.cssStyle = getCSSColor(percentOfHeart).htmlSafe();
                    });
                    resolve(activitiesList);
                });
            })
        });
    }
});

// FIXME - Refactor into helper class
function getShortDayOfWeek(dayOfWeek) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
}

function getCSSColor(percentage) {
    var colors = ['#61DE31', '#90DE42', '#BCDE3F', '#DADE53', '#DED55B', '#DEC541', '#DEB643', '#FF7423', '#FF530D', '#E82C0C'];

    var color = '';
    if (percentage == undefined) {
        color = '#000';
    } else {
        for (var i = 0.0; i < 10; i++) {
            if (((i + 1) / 10.0) >= percentage) {
                color = colors[i];
                break;
            }
        }
    }
    return 'color: ' + color + ';';
}