import Ember from 'ember';

import * as ActivityUtil from '../utils/activity-util';

export default Ember.Component.extend({
    dataOption: 'mileageByMonth',
    activities: null,
    chartDataTypes: [{
        key: 'mileageByMonth',
        name: 'Mileage by Month'
    }, {
        key: 'speedByMonth',
        name: 'Speed by Month'
    }, {
        key: 'effortByMonth',
        name: 'Effort by Month'
    }],
    chartOptions: {
        scaleFontColor: '#fff',
        responsive: true,
        scaleBeginAtZero: true,
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(2) %>"
    },
    chartType: Ember.computed('dataOption', function() {
        return this.get('dataOption') === 'mileageByMonth' ? 'Bar' : 'Line';
    }),
    chartData: Ember.computed('dataOption', function() {
        var activities = this.get('activities');
        var chartData = [];
        var labels = [];
        var chartTitle = '';
        let monthlyStats = ActivityUtil.createMonthlyStats(activities, 13).reverse();
        if (this.get('dataOption') === 'mileageByMonth') {
            chartTitle = 'Monthly Mileage';
            $.each(monthlyStats, function(idx, monthlyStat) {
                chartData.push(monthlyStat['mileage']);
                labels.push(monthlyStat['description']);
            });
        } else if (this.get('dataOption') === 'speedByMonth') {
            chartTitle = 'Monthly Speed';
            $.each(monthlyStats, function(idx, monthlyStat) {
                chartData.push(monthlyStat['averageSpeed']);
                labels.push(monthlyStat['description']);
            });
        } else if (this.get('dataOption') === 'effortByMonth') {
            chartTitle = 'Monthly Effort';
            $.each(monthlyStats, function(idx, monthlyStat) {
                chartData.push(monthlyStat['averageEffort']);
                labels.push(monthlyStat['description']);
            });
        } else {
            throw 'Invalid data option selected: "' + this.get('dataOption') + '"';
        }
        return {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: chartData,
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
            }]
        };
    })
});