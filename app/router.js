import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('activities');
    this.route('loading');
    this.route('weekly');
    this.route('monthly');
    this.route('charts');
});

export default Router;