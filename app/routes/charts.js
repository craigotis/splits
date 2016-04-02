import Ember from 'ember';

import Client from '../models/client';

export default Ember.Route.extend({
    model: function() {
        return Ember.RSVP.hash({
            activities: new Ember.RSVP.Promise(function(resolve) {
                resolve(Client.create().getActivities());
            })
        });
    }
});