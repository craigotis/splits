import Ember from 'ember';
import Client from '../models/client';
import * as ActivityUtil from '../utils/activity-util';

export default Ember.Route.extend({
    model() {
        var activitiesThisWeek = Client.create().getActivitiesThisWeek();
        return Ember.RSVP.hash({
            activitiesThisWeek: activitiesThisWeek,
            mileageThisWeek: new Ember.RSVP.Promise(function(resolve) {
                activitiesThisWeek.then(function(activities) {
                    resolve(ActivityUtil.mileageSum(activities));
                });
            })
        });
    }
});