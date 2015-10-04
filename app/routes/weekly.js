import Ember from 'ember';

import Client from '../models/client';

import * as ActivityUtil from '../utils/activity-util';

export default Ember.Route.extend({
    model: function() {
        var trendingProm = new Ember.RSVP.Promise(function(resolve) {
            Client.create().getActivities().then(function(activities) {
                var pastFive = ActivityUtil.getAverageWeeklyMileage(activities);
                var pastFivePrev = ActivityUtil.getAverageWeeklyMileage(activities, 5);
                if (((pastFive - pastFivePrev) / pastFive) < 0.1) {
                    resolve('same');
                } else if (pastFive > pastFivePrev) {
                    resolve('up');
                } else {
                    resolve('down');
                }
            });
        });
        return Ember.RSVP.hash({
            trending: trendingProm,
            trendingUp: new Ember.RSVP.Promise(function(resolve) {
                trendingProm.then(function(result) {
                    resolve(result === 'up');
                });
            }),
            trendingSame: new Ember.RSVP.Promise(function(resolve) {
                trendingProm.then(function(result) {
                    resolve(result === 'same');
                });
            }),
            averageMileage: new Ember.RSVP.Promise(function(resolve) {
                Client.create().getActivities().then(function(activities) {
                    resolve(ActivityUtil.getAverageWeeklyMileage(activities));
                });
            }),
            trailingAverageMileage: new Ember.RSVP.Promise(function(resolve) {
                Client.create().getActivities().then(function(activities) {
                    resolve(ActivityUtil.getAverageWeeklyMileage(activities, 5));
                });
            }),
            weeklyStats: new Ember.RSVP.Promise(function(resolve) {
                Client.create().getActivities().then(function(activities) {
                    var averageWeeklyMileage = ActivityUtil.getAverageWeeklyMileage(activities);
                    resolve(ActivityUtil.createWeeklyStats(activities, averageWeeklyMileage));
                });
            })
        });
    }
});