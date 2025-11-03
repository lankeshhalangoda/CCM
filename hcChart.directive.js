// Reusable Highcharts Directive
angular.module('dashboardApp')
.directive('hcChart', function() {
    return {
        restrict: 'A',
        scope: {
            hcChart: '='
        },
        link: function(scope, element) {
            var chart = null;
            
            // Watch for chart config changes
            scope.$watch('hcChart', function(newConfig) {
                if (newConfig) {
                    if (typeof window.Highcharts === 'undefined') {
                        // Highcharts not yet loaded; wait for next digest
                        return;
                    }
                    // Ensure chart key exists
                    if (!newConfig.chart) {
                        newConfig.chart = {};
                    }
                    if (!chart) {
                        // Create new chart
                        var chartConfig = angular.copy(newConfig);
                        chartConfig.chart.renderTo = element[0];
                        chart = new Highcharts.Chart(chartConfig);
                    } else {
                        // Update existing chart
                        var updateConfig = angular.copy(newConfig);
                        updateConfig.chart.renderTo = element[0];
                        chart.update(updateConfig, true, true);
                    }
                }
            }, true);
            
            // Cleanup on destroy
            scope.$on('$destroy', function() {
                if (chart) {
                    chart.destroy();
                }
            });
        }
    };
});

