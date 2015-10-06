import Ember from 'ember';

import * as NumberUtil from '../utils/number-util';

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
        var paceUnrounded = (26.82 / this.get('speed'));
        var minutes = Math.floor(paceUnrounded);
        var seconds = ((paceUnrounded.toFixed(2) % 1) * 60).toFixed(0);
        return minutes + ':' + NumberUtil.padDigits(seconds, 2);
    })
});