import {
    moduleFor, test
}
from 'ember-qunit';

import Activity from 'ember-splits/models/activity';

moduleFor('model:activity', 'Unit | Model | activity', {
    // Specify the other units that are required for this test.
    needs: []
});

test('distance in miles is properly calculated', function(assert) {
    var activity = Activity.create({
        distance: 8000
    });
    assert.equal(activity.get('distanceInMiles'), 4.97);
});

test('pace is properly calculated', function(assert) {
    var activity = Activity.create({
        speed: 2.87
    });
    assert.equal(activity.get('paceStr'), '9:20');
});

test('cadence string is double dash without numeric value', function(assert) {
    assert.equal(Activity.create().get('cadenceStr'), '--');
});

test('heartrate string is double dash without numeric value', function(assert) {
    assert.equal(Activity.create().get('heartrateStr'), '--');
});

test('effort string is double dash without numeric values', function(assert) {
    assert.equal(Activity.create().get('effortStr'), '--');
});

test('effort string is properly calculated given numeric values', function(assert) {
    var activity = Activity.create({
        speed: 2.87,
        heartrate: 156.4
    });
    assert.equal(activity.get('effortStr'), 54.49);
});