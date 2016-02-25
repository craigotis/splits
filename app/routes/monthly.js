import Ember from 'ember';

import Client from '../models/client';

import * as ActivityUtil from '../utils/activity-util';

export default Ember.Route.extend({
    model: function() {
        return Ember.RSVP.hash({
            monthlyStats: new Ember.RSVP.Promise(function(resolve) {
                Client.create().getActivities().then(function(activities) {
                    resolve(ActivityUtil.createMonthlyStats(activities, 8));
                });
            })
        });
    }
});