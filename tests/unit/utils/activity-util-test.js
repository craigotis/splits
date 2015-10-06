import {
	test
}
from 'ember-qunit';

import Activity from 'ember-splits/models/activity';

import * as NumberUtil from 'ember-splits/utils/number-util';

import * as ActivityUtil from 'ember-splits/utils/activity-util';

test('mileage can be summed', function(assert) {
	var activities = [Activity.create({
		distance: 2.0 / NumberUtil.METERS_TO_MILES
	}), Activity.create({
		distance: 4.0 / NumberUtil.METERS_TO_MILES
	})];

	assert.equal(ActivityUtil.mileageSum(activities), 6.0);
});