import Ember from 'ember';

import * as NumberUtil from '../utils/number-util';
import * as ActivityUtil from '../utils/activity-util';

export default Ember.Object.extend({
    heartrate: null,
    speed: null,
    distance: null,
    cadence: null,
    effortStr: Ember.computed(function() {
        var temp = this.get('heartrate') / this.get('speed');
        return isNaN(temp) ? '--' : temp.toFixed(2);
    }),
    distanceInMiles: Ember.computed('distance', function() {
        return (this.get('distance') * NumberUtil.METERS_TO_MILES).toFixed(2);
    }),
    cadenceStr: Ember.computed('cadence', function() {
        return this.get('cadence') ? this.get('cadence') : '--';
    }),
    heartrateStr: Ember.computed('heartrate', function() {
        return this.get('heartrate') ? this.get('heartrate') : '--';
    }),
    paceStr: Ember.computed('speed', function() {
        return ActivityUtil.speedToPace(this.get('speed'));
    })
});