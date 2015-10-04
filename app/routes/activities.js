import Ember from 'ember';
import Client from '../models/client';

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            activities: new Ember.RSVP.Promise(function(resolve) {
                Client.create().getActivities().then(function(activities) {
                    resolve(activities);
                });
            })
        });
    }
});