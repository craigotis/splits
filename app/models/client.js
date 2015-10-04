import Ember from 'ember';

import Client from './client';
import Activity from './activity';

import * as ActivityUtil from '../utils/activity-util';
import * as DateUtil from '../utils/date-util';
import * as CSSUtil from '../utils/css-util';

var STRAVA_ACCESS_KEY = gOptions.access_key;
var STRAVA_API_URL = 'https://www.strava.com/api/v3/athlete/activities';

export default Ember.Object.extend({
    getActivities: function() {
        return new Ember.RSVP.Promise(function(resolve) {
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
                        dateStr: DateUtil.getShortDayOfWeek(activityDate.getDay()) + ' ' + activityDate.toLocaleDateString(),
                        speed: obj.average_speed,
                        cadence: obj.average_cadence ? obj.average_cadence * 2.0 : undefined,
                        heartrate: obj.average_heartrate,
                    });
                    if (!isNaN(newActivity.heartrate)) {
                        hrLow = Math.min(hrLow, newActivity.heartrate);
                        hrHigh = Math.max(hrHigh, newActivity.heartrate);
                    }
                    activitiesList.push(newActivity);
                });
                $.each(activitiesList, function(idx, el) {
                    if (isNaN(el.heartrate)) {
                        el.heartratePercentage = undefined;
                    } else {
                        var percentOfHeart = (el.heartrate - hrLow) / (hrHigh - hrLow);
                        el.heartratePercentage = percentOfHeart;
                    }
                    el.cssStyle = CSSUtil.getCSSColor(el.heartratePercentage).htmlSafe();
                });
                resolve(activitiesList);
            });
        });
    },
    getActivitiesThisWeek: function() {
        return new Ember.RSVP.Promise(function(resolve) {
            Client.create().getActivities().then(function(activities) {
                resolve(ActivityUtil.matchActivities(activities, DateUtil.daysThisWeek()));
            });
        });
    }
});