import Ember from 'ember';
import Client from '../models/client';
import * as ActivityUtil from '../utils/activity-util';

export default Ember.Route.extend({
    model() {
        var client = Client.create();
        var activitiesThisWeek = client.getActivitiesThisWeek();
        return Ember.RSVP.hash({
            activitiesThisWeek: activitiesThisWeek,
            weekStats: new Ember.RSVP.Promise(function(resolve) {
                activitiesThisWeek.then(function(activities) {
                    resolve(ActivityUtil.createWeeklyStats(activities, 20, 1));
                });
            }),
            mostFrequentDay: new Ember.RSVP.Promise(function(resolve) {
                client.getActivities().then(function(activities) {
                    resolve(ActivityUtil.mostFrequentRunDay(activities));
                });
            }),
            mileageThisWeek: new Ember.RSVP.Promise(function(resolve) {
                activitiesThisWeek.then(function(activities) {
                    resolve(ActivityUtil.mileageSum(activities));
                });
            })
        });
    }
});