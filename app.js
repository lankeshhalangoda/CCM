// AngularJS App Module
var app = angular.module('dashboardApp', []);

// Dashboard Controller
app.controller('DashboardController', function($scope, $http) {
    // Global Highcharts positioning to avoid overlapping the plot
        if (window.Highcharts && Highcharts.setOptions) {
        Highcharts.setOptions({
            chart: { spacingTop: 36 },
            colors: ['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#0ea5e9','#ec4899'],
            exporting: {
                buttons: {
                    contextButton: {
                        align: 'right',
                        verticalAlign: 'top',
                        y: -6
                    }
                }
            }
        });
    }
    // Unified source colors
    var sourceColors = {
        Survey: '#43bccd',
        Support: '#662e9b',
        Voice: '#ea3546',
        Social: '#f86624',
        Reviews: '#f9c80e'
    };
    // Status and Priority colors (vibrant & modern)
    var statusColors = {
        Open: '#22c55e',       // green-500
        InProgress: '#f59e0b', // amber-500 (yellow)
        Resolved: '#3b82f6'    // blue-500 (treat as Closed color)
    };
    var priorityColors = {
        High: '#ef4444',    // red-500
        Medium: '#f59e0b',  // amber-500 (yellow)
        Low: '#22c55e'      // green-500
    };
    // Initialize active tab
    $scope.activeTab = 'overview';
    
    // Set active tab function
    $scope.setActiveTab = function(tab) {
        $scope.activeTab = tab;
        console.log('Switching to tab:', tab);
    };
    
    // KPI Data
    $scope.kpiData = {
        total: { value: 1247 },
        open: { value: 342 },
        inProgress: { value: 589 },
        resolved: { value: 316 }
    };
    
    // Menu states
    $scope.headerMenuOpen = false;
    $scope.chartMenus = {
        trend: false, channel: false, statusBreakdown: false, prioritySplit: false, statusVsPriority: false,
        dayHourHeatmap: false, monthlyGrowth: false, perThousand: false,
        sourceStatus: false, sourcePriority: false,
        sourceResTime: false, sourceShare: false,
        topCategories: false, categoryStatus: false, topLocations: false,
        locationCategory: false, avgResTime: false, ageDist: false,
        slaCompliance: false, employeePerf: false, funnel: false,
        reopenedTrend: false, sentimentBreakdown: false, emotionAnalysis: false,
        wordCloud: false, sentimentTrend: false, categorySentiment: false,
        timeline: false, volumeHeatmap: false, repeatingIssues: false,
        predictive: false, anomaly: false,
        socialMessagingBreakdown: false, socialMessagingVsStatus: false, socialMessagingVsPriority: false,
        socialMessagingOverTime: false,
        reviewBreakdown: false, reviewVsStatus: false, reviewVsPriority: false,
        reviewOverTime: false,
        subChannelResTime: false,
        locationTrend: false, categoryTrend: false,
        ttfResponse: false, resTimeDist: false, slaBreach: false,
        socialPlatformSent: false, reviewPlatformSent: false, keywordCorrelation: false,
        lifecycleDuration: false, fcrRate: false, employeeAvgTime: false,
        locationBreakdown: false, locationTrendDaily: false, locationResolutionRate: false,
        locationVsStatus: false, locationVsPriority: false, locationGrowth: false, locationVsSource: false,
        locationSourceHeatmap: false, locationVsSocialMessaging: false, locationVsReview: false,
        locationSlaBreachRate: false,
        categoryPriority: false, categoryResTime: false, categoryShare: false,
        keywordFrequencyByCategory: false,
        resolutionRateByChannel: false, slowestCategories: false, fastestLocations: false, closureRate: false,
        employeeStatusBreakdown: false, employeePriorityBreakdown: false,
        resolutionRateBySocialMessaging: false, resolutionRateByReview: false
    };
    $scope.channelChartType = 'bar';
    
    // Recent Feed Data
    $scope.recentFeed = [
        { title: 'Product quality issue reported', time: '2m ago', category: 'Quality', status: 'Open', priority: 'High', source: 'Voice', location: 'New York' },
        { title: 'Billing discrepancy complaint', time: '15m ago', category: 'Billing', status: 'In Progress', priority: 'Medium', source: 'Support', location: 'Los Angeles' },
        { title: 'Service delay concern', time: '32m ago', category: 'Service', status: 'Resolved', priority: 'Low', source: 'Social', location: 'Chicago' },
        { title: 'Shipping delay inquiry', time: '1h ago', category: 'Shipping', status: 'Open', priority: 'Medium', source: 'Voice', location: 'Houston' },
        { title: 'Refund request submitted', time: '1h ago', category: 'Billing', status: 'In Progress', priority: 'High', source: 'Support', location: 'Phoenix' },
        { title: 'Product defect reported', time: '2h ago', category: 'Quality', status: 'Resolved', priority: 'Medium', source: 'Review', location: 'Philadelphia' },
        { title: 'Account access issue', time: '3h ago', category: 'Technical', status: 'Open', priority: 'High', source: 'Support', location: 'San Antonio' },
        { title: 'Order cancellation request', time: '3h ago', category: 'Order', status: 'In Progress', priority: 'Medium', source: 'Voice', location: 'San Diego' }
    ];
    
    // Daily data for last 14 days
    var dailyDates = [];
    for (var i = 13; i >= 0; i--) {
        var date = new Date();
        date.setDate(date.getDate() - i);
        dailyDates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Helper function to add data labels on top of bars
    function getBarChartPlotOptions() {
        return {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() {
                        return this.y;
                    }
                }
            },
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() {
                        return this.y;
                    }
                }
            }
        };
    }
    
    // ============================================
    // SECTION 1: Complaint Overview
    // ============================================
    
    // Complaint Trend (Daily) - Stacked areaspline
    $scope.trendChartConfig = {
        chart: { type: 'areaspline', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: dailyDates },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            areaspline: {
                stacking: 'normal',
                marker: { enabled: false }
            }
        },
            colors: [sourceColors.Survey, sourceColors.Support, sourceColors.Voice, sourceColors.Social, sourceColors.Reviews],
        series: [
            { name: 'Survey', data: [12, 15, 18, 14, 20, 16, 22, 19, 24, 21, 18, 20, 23, 25] },
            { name: 'Support', data: [28, 32, 30, 35, 38, 33, 40, 36, 42, 38, 35, 37, 40, 43] },
            { name: 'Voice', data: [45, 50, 48, 52, 55, 50, 58, 54, 60, 56, 53, 55, 58, 62] },
            { name: 'Social', data: [15, 18, 16, 20, 22, 19, 25, 22, 28, 24, 20, 22, 25, 28] },
            { name: 'Reviews', data: [10, 12, 11, 14, 15, 13, 17, 15, 19, 16, 14, 15, 17, 19] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Channel-wise Distribution - Bar/Pie toggle
    function getChannelChartConfig(type) {
        var baseConfig = {
            title: { text: null },
            credits: { enabled: false },
            legend: { enabled: true }
        };
        
        if (type === 'bar') {
            baseConfig.chart = { type: 'column', backgroundColor: '#fff' };
            baseConfig.xAxis = { categories: [''] };
            baseConfig.yAxis = { title: { text: 'Complaints' } };
            baseConfig.plotOptions = {
                column: {
                    grouping: true,
                    pointPadding: 0.2,
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        style: { fontWeight: 'bold', fontSize: '11px' },
                        formatter: function() { return this.y; }
                    }
                }
            };
            baseConfig.series = [
                { name: 'Survey', data: [156], color: sourceColors.Survey },
                { name: 'Support', data: [482], color: sourceColors.Support },
                { name: 'Voice', data: [721], color: sourceColors.Voice },
                { name: 'Social', data: [243], color: sourceColors.Social },
                { name: 'Reviews', data: [168], color: sourceColors.Reviews }
            ];
        } else {
            baseConfig.chart = { type: 'pie', backgroundColor: '#fff' };
            baseConfig.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    innerSize: '50%',
                    showInLegend: true,
                    dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y})' }
                }
            };
            baseConfig.series = [{
                name: 'Complaints',
                colorByPoint: false,
                data: [
                    { name: 'Survey', y: 156, color: sourceColors.Survey },
                    { name: 'Support', y: 482, color: sourceColors.Support },
                    { name: 'Voice', y: 721, color: sourceColors.Voice },
                    { name: 'Social', y: 243, color: sourceColors.Social },
                    { name: 'Reviews', y: 168, color: sourceColors.Reviews }
                ]
            }];
        }
        return baseConfig;
    }
    $scope.channelChartConfig = getChannelChartConfig('bar');
    
    // Complaint Status Breakdown (bar/pie toggle)
    $scope.statusBreakdownType = 'bar';
    function getStatusBreakdownConfig(type) {
        if (type === 'pie') {
            return {
                chart: { type: 'pie', backgroundColor: '#fff' },
                title: { text: null },
                plotOptions: { pie: { innerSize: '50%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y})' } } },
                series: [{ name: 'Status', data: [
                    { name: 'Open', y: 342, color: statusColors.Open },
                    { name: 'In Progress', y: 589, color: statusColors.InProgress },
                    { name: 'Resolved', y: 316, color: statusColors.Resolved }
                ] }],
                credits: { enabled: false }
            };
        }
        return {
            chart: { type: 'column', backgroundColor: '#fff' },
            title: { text: null },
            xAxis: { categories: ['Open', 'In Progress', 'Resolved'] },
            yAxis: { title: { text: 'Count' } },
            plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' }, formatter: function(){ return this.y; } } } },
            series: [{
                name: 'Complaints',
                colorByPoint: false,
                data: [
                    { y: 342, color: statusColors.Open, name: 'Open' },
                    { y: 589, color: statusColors.InProgress, name: 'In Progress' },
                    { y: 316, color: statusColors.Resolved, name: 'Resolved' }
                ]
            }],
            credits: { enabled: false },
            legend: { enabled: false }
        };
    }
    $scope.statusBreakdownChartConfig = getStatusBreakdownConfig($scope.statusBreakdownType);
    $scope.switchStatusBreakdown = function(type) {
        $scope.statusBreakdownType = type;
        $scope.statusBreakdownChartConfig = getStatusBreakdownConfig(type);
    };
    
    // Priority Split (donut/bar toggle)
    $scope.prioritySplitType = 'donut';
    function getPrioritySplitConfig(type) {
        if (type === 'bar') {
            return {
                chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
                xAxis: { categories: [''] },
                yAxis: { title: { text: 'Count' } },
                plotOptions: { 
                    column: { 
                        dataLabels: { 
                            enabled: true, 
                            style: { fontWeight: 'bold', fontSize: '11px' },
                            formatter: function() { return this.y; }
                        } 
                    } 
                },
                series: [
                    { name: 'High', data: [523], color: priorityColors.High },
                    { name: 'Medium', data: [469], color: priorityColors.Medium },
                    { name: 'Low', data: [255], color: priorityColors.Low }
                ],
                credits: { enabled: false },
                legend: { enabled: true }
            };
        }
        return {
            chart: { type: 'pie', backgroundColor: '#fff' },
            title: { text: null },
            plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
            series: [{ name: 'Priority', colorByPoint: false, data: [
                { name: 'High', y: 523, color: priorityColors.High },
                { name: 'Medium', y: 469, color: priorityColors.Medium },
                { name: 'Low', y: 255, color: priorityColors.Low }
            ] }],
        credits: { enabled: false }
        };
    }
    $scope.prioritySplitChartConfig = getPrioritySplitConfig($scope.prioritySplitType);
    $scope.switchPrioritySplit = function(type) {
        $scope.prioritySplitType = type;
        $scope.prioritySplitChartConfig = getPrioritySplitConfig(type);
    };
    
    // Status vs Priority Chart
    $scope.statusVsPriorityChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Open', 'In Progress', 'Resolved'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } },
                grouping: false
            }
        },
        series: [
            { name: 'High', data: [156, 234, 133], color: priorityColors.High },
            { name: 'Medium', data: [132, 289, 48], color: priorityColors.Medium },
            { name: 'Low', data: [54, 66, 135], color: priorityColors.Low }
        ],
        credits: { enabled: false }
    };
    
    // Complaint Volume by Day & Hour - Heatmap
    $scope.dayHourHeatmapConfig = {
        chart: { type: 'heatmap', backgroundColor: '#fff' },
        title: { text: null },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: '#3B82F6'
        },
        xAxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            title: null
        },
        plotOptions: {
            heatmap: {
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '11px',
                        textOutline: '1px contrast'
                    },
                    formatter: function() {
                        return this.point.value;
                    }
                }
            }
        },
        series: [{
            name: 'Complaints',
            data: [
                [0, 0, 12], [0, 1, 8], [0, 2, 45], [0, 3, 68], [0, 4, 52], [0, 5, 28],
                [1, 0, 15], [1, 1, 10], [1, 2, 52], [1, 3, 72], [1, 4, 58], [1, 5, 32],
                [2, 0, 18], [2, 1, 12], [2, 2, 58], [2, 3, 85], [2, 4, 65], [2, 5, 38],
                [3, 0, 22], [3, 1, 15], [3, 2, 62], [3, 3, 92], [3, 4, 72], [3, 5, 42],
                [4, 0, 20], [4, 1, 14], [4, 2, 55], [4, 3, 78], [4, 4, 68], [4, 5, 35],
                [5, 0, 10], [5, 1, 6], [5, 2, 28], [5, 3, 42], [5, 4, 32], [5, 5, 18],
                [6, 0, 8], [6, 1, 5], [6, 2, 22], [6, 3, 35], [6, 4, 28], [6, 5, 15]
            ]
        }],
        credits: { enabled: false }
    };

    // Monthly Complaint Growth Rate (MoM %)
    $scope.monthlyGrowthChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        yAxis: { title: { text: 'Growth % (MoM)' }, labels: { format: '{value}%' } },
        plotOptions: {
            line: {
                dataLabels: { enabled: true, formatter: function() { return this.y + '%'; }, style: { fontWeight: 'bold', fontSize: '11px' } },
                marker: { enabled: true, radius: 4 }
            }
        },
        colors: ['#3B82F6'],
        series: [{ name: 'Growth %', data: [5, 3, -2, 4, 6, 2, -1, 3, 4, 2, 1, 5] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Complaints per 1,000 Interactions (normalized KPI) - Multi colors like channel-wise distribution
    $scope.perThousandChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: [''] },
        yAxis: { title: { text: 'Complaints per 1,000 Interactions' } },
        plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' }, formatter: function(){ return this.y; } } } },
        series: [
            { name: 'Survey', data: [2.4], color: sourceColors.Survey },
            { name: 'Support', data: [4.8], color: sourceColors.Support },
            { name: 'Voice', data: [6.1], color: sourceColors.Voice },
            { name: 'Social', data: [3.2], color: sourceColors.Social },
            { name: 'Reviews', data: [1.7], color: sourceColors.Reviews }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // ============================================
    // SECTION 2: Source & Channel Analytics
    // ============================================
    
    // Source vs Status - Clustered column
    $scope.sourceStatusChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
            { name: 'Open', data: [45, 125, 180, 68, 52] },
            { name: 'In Progress', data: [78, 245, 398, 142, 95] },
            { name: 'Resolved', data: [33, 112, 143, 33, 21] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Source vs Priority - Stacked column
    $scope.sourcePriorityChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [priorityColors.High, priorityColors.Medium, priorityColors.Low],
        series: [
            { name: 'High', data: [45, 142, 218, 78, 52] },
            { name: 'Medium', data: [78, 245, 356, 112, 78] },
            { name: 'Low', data: [33, 95, 147, 53, 38] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Average Resolution Time per Source - Combo (Column + Line)
    $scope.sourceResTimeChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'] },
        yAxis: [{ 
            title: { text: 'Hours' },
            labels: { format: '{value}h' }
        }],
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + 'h'; }
                }
            },
            line: {
                dataLabels: {
                    enabled: true,
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + 'h'; }
                }
            }
        },
        colors: ['#10B981', '#EF4444'],
        series: [
            {
                name: 'Avg Resolution Time',
                type: 'column',
                data: [12, 18, 24, 15, 10]
            },
            {
                name: 'Target',
                type: 'line',
                yAxis: 0,
                data: [16, 16, 16, 16, 16],
                marker: { enabled: true }
            }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Complaint Trend by Source - Multi-line
    $scope.sourceTrendChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: dailyDates },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        colors: ['#FFB6C1', '#87CEEB', '#98D8C8', '#F7DC6F', '#BB8FCE'],
        series: [
            { name: 'Survey', data: [12, 15, 18, 14, 20, 16, 22, 19, 24, 21, 18, 20, 23, 25] },
            { name: 'Support', data: [28, 32, 30, 35, 38, 33, 40, 36, 42, 38, 35, 37, 40, 43] },
            { name: 'Voice', data: [45, 50, 48, 52, 55, 50, 58, 54, 60, 56, 53, 55, 58, 62] },
            { name: 'Social', data: [15, 18, 16, 20, 22, 19, 25, 22, 28, 24, 20, 22, 25, 28] },
            { name: 'Reviews', data: [10, 12, 11, 14, 15, 13, 17, 15, 19, 16, 14, 15, 17, 19] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Source Share (pie/bar toggle)
    $scope.sourceShareType = 'pie';
    function getSourceShareConfig(type) {
        var data = [
            { name: 'Voice', y: 721, color: sourceColors.Voice },
            { name: 'Support', y: 482, color: sourceColors.Support },
            { name: 'Social', y: 243, color: sourceColors.Social },
            { name: 'Reviews', y: 168, color: sourceColors.Reviews },
            { name: 'Survey', y: 156, color: sourceColors.Survey }
        ];
        if (type === 'bar') {
            return {
                chart: { type: 'column', backgroundColor: '#fff' },
                title: { text: null },
                xAxis: { categories: data.map(function(d){return d.name;}) },
                yAxis: { title: { text: 'Complaints' } },
                plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
                series: [{ name: 'Complaints', data: data.map(function(d){return { y: d.y, color: d.color }; }) }],
                credits: { enabled: false }
            };
        }
        return {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
            plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
            series: [{ name: 'Source Share', colorByPoint: false, data: data }],
            credits: { enabled: false }
        };
    }
    $scope.sourceShareChartConfig = getSourceShareConfig($scope.sourceShareType);
    $scope.switchSourceShare = function(type) {
        $scope.sourceShareType = type;
        $scope.sourceShareChartConfig = getSourceShareConfig(type);
    };

    // Social & Messaging Channel Breakdown (Whatsapp - #25d366, Messenger - #0099e5, Instagram - #c32aa3, Web - #a6b1b7)
    $scope.socialMessagingBreakdownChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: [''] },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
        series: [
            { name: 'WhatsApp', data: [142], color: '#25d366' },
            { name: 'Messenger', data: [118], color: '#16baff' },
            { name: 'Instagram', data: [98], color: '#ff0369' },
            { name: 'Web', data: [86], color: '#616161' }
        ],
        credits: { enabled: false }
    };

    // Social & Messaging Channel vs Status
    $scope.socialMessagingVsStatusChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Web'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
            { name: 'Open', data: [45, 38, 32, 28] },
            { name: 'In Progress', data: [68, 58, 52, 45] },
            { name: 'Resolved', data: [29, 22, 14, 13] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Social & Messaging Channel vs Priority
    $scope.socialMessagingVsPriorityChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Web'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [priorityColors.High, priorityColors.Medium, priorityColors.Low],
        series: [
            { name: 'High', data: [52, 42, 38, 32] },
            { name: 'Medium', data: [68, 58, 48, 42] },
            { name: 'Low', data: [22, 18, 12, 12] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Complaints per Social & Messaging Channel Over Time (timeline)
    $scope.socialMessagingOverTimeChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: dailyDates },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        series: [
            { name: 'WhatsApp', data: [12,14,15,16,18,20,19,21,22,20,18,19,21,23], color: '#25d366' },
            { name: 'Messenger', data: [10,11,12,12,13,14,14,15,16,14,13,14,15,16], color: '#16baff' },
            { name: 'Instagram', data: [8,9,10,10,11,12,12,13,14,12,11,12,13,14], color: '#ff0369' },
            { name: 'Web', data: [7,8,9,9,10,11,11,12,13,11,10,11,12,13], color: '#616161' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Social & Messaging vs Status vs Priority (3D grouped or stacked)
    $scope.socialMessagingStatusPriorityChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Web'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                grouping: false,
                dataLabels: {
                    enabled: true,
                    style: { fontWeight: 'bold', fontSize: '9px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        series: [
            { name: 'Open-High', data: [18, 15, 12, 10], color: '#0d3b66' },
            { name: 'Open-Medium', data: [20, 18, 16, 14], color: '#faf0ca' },
            { name: 'Open-Low', data: [7, 5, 4, 4], color: '#f4d35e' },
            { name: 'In Progress-High', data: [22, 18, 16, 14], color: '#26547c' },
            { name: 'In Progress-Medium', data: [32, 28, 24, 20], color: '#ef476f' },
            { name: 'In Progress-Low', data: [14, 12, 12, 11], color: '#ffd166' },
            { name: 'Resolved-High', data: [12, 9, 10, 8], color: '#1a4d7a' },
            { name: 'Resolved-Medium', data: [16, 11, 3, 4], color: '#d93d5f' },
            { name: 'Resolved-Low', data: [1, 2, 1, 1], color: '#e6c05e' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Review Channel Breakdown (Google -#ea4335, Facebook - #1877f2, TripAdvisor - #0caa41)
    $scope.reviewBreakdownChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: { pie: { innerSize: '55%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
        series: [{
            name: 'Reviews', colorByPoint: true,
            data: [
                { name: 'Google', y: 168, color: '#ea4335' },
                { name: 'Facebook', y: 125, color: '#1877f2' },
                { name: 'TripAdvisor', y: 62, color: '#0caa41' }
            ]
        }],
        credits: { enabled: false }
    };

    // Review Channel vs Status
    $scope.reviewVsStatusChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Google', 'Facebook', 'TripAdvisor'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
            { name: 'Open', data: [52, 38, 18] },
            { name: 'In Progress', data: [68, 52, 24] },
            { name: 'Resolved', data: [48, 35, 20] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Review Channel vs Priority
    $scope.reviewVsPriorityChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Google', 'Facebook', 'TripAdvisor'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [priorityColors.High, priorityColors.Medium, priorityColors.Low],
        series: [
            { name: 'High', data: [48, 35, 18] },
            { name: 'Medium', data: [78, 58, 28] },
            { name: 'Low', data: [42, 32, 16] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Complaints per Review Channel Over Time (timeline)
    $scope.reviewOverTimeChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: dailyDates },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        series: [
            { name: 'Google', data: [12,14,15,16,18,20,19,21,22,20,18,19,21,23], color: '#ea4335' },
            { name: 'Facebook', data: [9,10,11,11,12,13,13,14,15,13,12,13,14,15], color: '#1877f2' },
            { name: 'TripAdvisor', data: [4,5,5,6,6,7,7,8,8,7,6,7,8,9], color: '#0caa41' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Review Channels vs Status vs Priority
    $scope.reviewStatusPriorityChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Google', 'Facebook', 'TripAdvisor'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                grouping: false,
                dataLabels: {
                    enabled: true,
                    style: { fontWeight: 'bold', fontSize: '9px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        series: [
            { name: 'Open-High', data: [18, 13, 6], color: '#0d3b66' },
            { name: 'Open-Medium', data: [24, 18, 8], color: '#faf0ca' },
            { name: 'Open-Low', data: [10, 7, 4], color: '#f4d35e' },
            { name: 'In Progress-High', data: [20, 15, 7], color: '#26547c' },
            { name: 'In Progress-Medium', data: [32, 24, 12], color: '#ef476f' },
            { name: 'In Progress-Low', data: [16, 13, 5], color: '#ffd166' },
            { name: 'Resolved-High', data: [10, 7, 5], color: '#1a4d7a' },
            { name: 'Resolved-Medium', data: [22, 16, 10], color: '#d93d5f' },
            { name: 'Resolved-Low', data: [16, 12, 5], color: '#e6c05e' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Sub-Channel Resolution Time Comparison
    $scope.subChannelResTimeComparisonChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['WhatsApp','Messenger','Instagram','Facebook','Twitter','TikTok'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: getBarChartPlotOptions(),
        colors: ['#0EA5E9'],
        series: [{ name: 'Avg Hours', data: [10,12,14,16,18,20] }],
        credits: { enabled: false }
    };
    
    // ============================================
    // SECTION 3: Category & Location Analytics
    // ============================================
    
    // Top Complaint Categories - Horizontal bar
    // Category color palette for Top Categories legend
    var categoryColors = {
        'Product Quality': (keywordColors && keywordColors.quality) || '#3b82f6',
        'Billing': (keywordColors && keywordColors.billing) || '#10b981',
        'Service Delay': (keywordColors && keywordColors.delay) || '#f59e0b',
        'Shipping': (keywordColors && keywordColors.delivery) || '#8b5cf6',
        'Technical': '#06b6d4',
        'Order': '#f43f5e',
        'Account': '#84cc16',
        'Other': '#a855f7'
    };

    $scope.topCategoriesChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { 
            categories: ['Product Quality', 'Billing', 'Service Delay', 'Shipping', 'Technical', 'Order', 'Account', 'Other'],
            title: { text: null }
        },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        legend: { enabled: true },
        series: [{
            name: 'Complaints',
            showInLegend: true,
            legendType: 'point',
            data: [
                { name: 'Product Quality', y: 342, color: categoryColors['Product Quality'] },
                { name: 'Billing', y: 289, color: categoryColors['Billing'] },
                { name: 'Service Delay', y: 245, color: categoryColors['Service Delay'] },
                { name: 'Shipping', y: 198, color: categoryColors['Shipping'] },
                { name: 'Technical', y: 156, color: categoryColors['Technical'] },
                { name: 'Order', y: 89, color: categoryColors['Order'] },
                { name: 'Account', y: 78, color: categoryColors['Account'] },
                { name: 'Other', y: 17, color: categoryColors['Other'] }
            ]
        }],
        credits: { enabled: false }
    };
    
    // Category vs Status - Stacked bar
    $scope.categoryStatusChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Quality', 'Billing', 'Service', 'Shipping', 'Technical'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
            { name: 'Open', data: [98, 78, 65, 52, 49] },
            { name: 'In Progress', data: [165, 142, 125, 98, 59] },
            { name: 'Resolved', data: [79, 69, 55, 48, 48] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Category vs Priority - Stacked bar
    $scope.categoryPriorityChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Quality', 'Billing', 'Service', 'Shipping', 'Technical'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [priorityColors.High, priorityColors.Medium, priorityColors.Low],
        series: [
            { name: 'High', data: [92, 76, 60, 48, 38] },
            { name: 'Medium', data: [140, 120, 98, 82, 56] },
            { name: 'Low', data: [52, 45, 40, 30, 22] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Top 10 Locations - Bar with data labels
    $scope.topLocationsChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'] },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#F59E0B'],
        series: [{
            name: 'Complaints',
            data: [142, 125, 98, 78, 65, 59, 52, 48, 45, 42]
        }],
        credits: { enabled: false }
    };
    
    // Location vs Category Heatmap
    $scope.locationCategoryChartConfig = {
        chart: { type: 'heatmap', backgroundColor: '#fff' },
        title: { text: null },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: '#F59E0B'
        },
        xAxis: {
            categories: ['New York', 'LA', 'Chicago', 'Houston', 'Phoenix']
        },
        yAxis: {
            categories: ['Quality', 'Billing', 'Service', 'Shipping', 'Technical'],
            title: null
        },
        series: [{
            name: 'Complaints',
            data: [
                [0, 0, 45], [0, 1, 38], [0, 2, 32], [0, 3, 18], [0, 4, 9],
                [1, 0, 42], [1, 1, 35], [1, 2, 28], [1, 3, 15], [1, 4, 5],
                [2, 0, 38], [2, 1, 32], [2, 2, 18], [2, 3, 8], [2, 4, 2],
                [3, 0, 28], [3, 1, 25], [3, 2, 15], [3, 3, 8], [3, 4, 2],
                [4, 0, 25], [4, 1, 22], [4, 2, 12], [4, 3, 5], [4, 4, 1]
            ]
        }],
        credits: { enabled: false }
    };

    // Sri Lanka Map (Highcharts Maps)
    // Sri Lanka Map - render directly with Highcharts.mapChart into #lkMapContainer
    // Inline map rendering handled in index.html via Highcharts.mapChart

    // Location Trend (MoM change)
    $scope.locationTrendMoMChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'] },
        yAxis: { title: { text: 'Complaints' } },
        series: [
            { name: 'New York', data: [142,150,148,155,162,158,165,170] },
            { name: 'Los Angeles', data: [125,130,128,132,137,140,142,145] },
            { name: 'Chicago', data: [98,102,101,105,110,112,114,118] }
        ],
        credits: { enabled: false }
    };

    // ============================================
    // Location Analytics Charts
    // ============================================
    
    // 1. Location Wise Complaint Breakdown (horizontal bar/pie toggle)
    $scope.locationBreakdownType = 'bar';
    function getLocationBreakdownConfig(type) {
        var locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
        var data = [342, 289, 245, 198, 156, 142, 128, 115, 98, 87];
        if (type === 'pie') {
            return {
                chart: { type: 'pie', backgroundColor: '#fff' },
                title: { text: null },
                plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
                series: [{ name: 'Complaints', colorByPoint: true, data: locations.map(function(loc, i) { return { name: loc, y: data[i] }; }) }],
                credits: { enabled: false }
            };
        }
        return {
            chart: { type: 'bar', backgroundColor: '#fff' },
            title: { text: null },
            xAxis: { categories: locations, title: { text: null } },
            yAxis: { title: { text: 'Complaints' } },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        verticalAlign: 'middle',
                        style: { fontWeight: 'bold', fontSize: '11px' },
                        formatter: function() { return this.y; }
                    }
                }
            },
            colors: ['#14B8A6'],
            series: [{ name: 'Complaints', data: data }],
            credits: { enabled: false }
        };
    }
    $scope.locationBreakdownChartConfig = getLocationBreakdownConfig($scope.locationBreakdownType);
    $scope.switchLocationBreakdown = function(type) {
        $scope.locationBreakdownType = type;
        $scope.locationBreakdownChartConfig = getLocationBreakdownConfig(type);
    };

    // 2. Location Wise Complaint Trend (line chart - top 5 locations)
    $scope.locationTrendChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: dailyDates },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        series: [
            { name: 'New York', data: [12,14,15,16,18,20,19,21,22,20,18,19,21,23], color: '#3B82F6' },
            { name: 'Los Angeles', data: [10,11,12,12,13,14,14,15,16,14,13,14,15,16], color: '#10B981' },
            { name: 'Chicago', data: [8,9,10,10,11,12,12,13,14,12,11,12,13,14], color: '#F59E0B' },
            { name: 'Houston', data: [7,8,9,9,10,11,11,12,13,11,10,11,12,13], color: '#EF4444' },
            { name: 'Phoenix', data: [6,7,8,8,9,10,10,11,12,10,9,10,11,12], color: '#8B5CF6' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 2.5. Location Wise Resolution Rate (bar chart - horizontal for many locations)
    $scope.locationResolutionRateChartConfig = {
        chart: { 
            type: 'bar', 
            backgroundColor: '#fff',
            spacingBottom: 50  // Add extra space at bottom for legend and x-axis labels
        },
        title: { text: null },
        xAxis: { 
            categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            title: { text: null }
        },
        yAxis: { 
            title: { text: 'Resolution Rate (%)' },
            max: 100,
            labels: { format: '{value}%' }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { 
                        // Location totals: [342, 289, 245, 198, 156, 142, 128, 115, 98, 87]
                        var locationTotals = [342, 289, 245, 198, 156, 142, 128, 115, 98, 87];
                        var idx = this.x;
                        var total = locationTotals[idx] || 0;
                        var count = Math.round(total * this.y / 100);
                        return this.y + '% (' + count + ')'; 
                    }
                }
            }
        },
        series: [{ 
            name: 'Resolution Rate', 
            data: [85.2, 82.5, 88.1, 79.8, 86.3, 81.2, 83.7, 84.9, 80.5, 87.2],
            zoneAxis: 'y',
            zones: [
                { value: 60, color: '#EF4444' },   // <60% red
                { value: 80, color: '#F59E0B' },   // 60-80% yellow
                { color: '#10B981' }               // >=80% green
            ]
        }],
        credits: { enabled: false },
        legend: { 
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            y: 15,  // Position below x-axis labels
            itemStyle: { fontSize: '12px' },
            symbolWidth: 15,
            symbolHeight: 10,
            symbolRadius: 0,
            itemFormatter: function() {
                // Create custom legend items for zones
                if (this.index === 0) {
                    return '<span style="color:#10B981;">■</span> Good (≥80%)';
                } else if (this.index === 1) {
                    return '<span style="color:#F59E0B;">■</span> Average (60-80%)';
                } else if (this.index === 2) {
                    return '<span style="color:#EF4444;">■</span> Poor (<60%)';
                }
                return this.name;
            }
        }
    };
    
    // Add custom legend using events since zones don't create separate legend items
    $scope.locationResolutionRateChartConfig.chart.events = {
        load: function() {
            var chart = this;
            // Position legend below the plot area (after x-axis labels)
            // Use plotBottom (Y coordinate of bottom of plot area) + spacing for x-axis labels
            var legendY = chart.plotBottom + 30;  // Below plot area with space for x-axis labels (typically 20-25px)
            var legendX = chart.chartWidth / 2 - 140;
            
            // Clear any existing legend elements on redraw
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥80%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#10B981' })
                .add();
            var text1 = chart.renderer.text('Good (≥80%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-80%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#F59E0B' })
                .add();
            var text2 = chart.renderer.text('Average (60-80%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#EF4444' })
                .add();
            var text3 = chart.renderer.text('Poor (<60%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };

    // 3. Location vs Status (stacked bar)
    $scope.locationVsStatusChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
            { name: 'Open', data: [98, 82, 68, 55, 44] },
            { name: 'In Progress', data: [156, 132, 110, 89, 72] },
            { name: 'Resolved', data: [88, 75, 67, 54, 40] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 4. Location vs Priority (stacked bar)
    $scope.locationVsPriorityChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [priorityColors.High, priorityColors.Medium, priorityColors.Low],
        series: [
            { name: 'High', data: [98, 82, 68, 55, 44] },
            { name: 'Medium', data: [156, 132, 110, 89, 72] },
            { name: 'Low', data: [88, 75, 67, 54, 40] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 5. Location Wise Complaint Growth (column chart - growth %)
    $scope.locationGrowthChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'] },
        yAxis: { title: { text: 'Growth %' }, labels: { format: '{value}%' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + '%'; }
                },
                colorByPoint: false
            }
        },
        series: [{ 
            name: 'Growth %', 
            data: [5.2, 3.8, -2.1, 4.5, 6.1, 2.3, -1.2, 3.9],
            zoneAxis: 'y',
            zones: [
                { value: 0, color: '#EF4444' },
                { color: '#10B981' }
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // 6. Location Wise Source Complaint Breakdown (stacked bar)
    $scope.locationVsSourceChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '9px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        series: [
            { name: 'Survey', data: [45, 38, 32, 28, 22], color: sourceColors.Survey },
            { name: 'Support', data: [98, 82, 68, 55, 44], color: sourceColors.Support },
            { name: 'Voice', data: [142, 118, 98, 78, 62], color: sourceColors.Voice },
            { name: 'Social', data: [38, 32, 28, 22, 18], color: sourceColors.Social },
            { name: 'Reviews', data: [19, 16, 19, 15, 10], color: sourceColors.Reviews }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 7. Location vs Source Heatmap
    $scope.locationSourceHeatmapChartConfig = {
        chart: { type: 'heatmap', backgroundColor: '#fff' },
        title: { text: null },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: '#14B8A6'
        },
        xAxis: {
            categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
        },
        yAxis: {
            categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'],
            title: null
        },
        plotOptions: {
            heatmap: {
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '11px',
                        textOutline: '1px contrast'
                    },
                    formatter: function() {
                        return this.point.value;
                    }
                }
            }
        },
        series: [{
            name: 'Complaints',
            data: [
                [0, 0, 45], [0, 1, 98], [0, 2, 142], [0, 3, 38], [0, 4, 19],
                [1, 0, 38], [1, 1, 82], [1, 2, 118], [1, 3, 32], [1, 4, 16],
                [2, 0, 32], [2, 1, 68], [2, 2, 98], [2, 3, 28], [2, 4, 19],
                [3, 0, 28], [3, 1, 55], [3, 2, 78], [3, 3, 22], [3, 4, 15],
                [4, 0, 22], [4, 1, 44], [4, 2, 62], [4, 3, 18], [4, 4, 10]
            ]
        }],
        credits: { enabled: false }
    };

    // 8. Location Wise Social & Messaging Channel Complaint Breakdown (stacked bar)
    $scope.locationVsSocialMessagingChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '9px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        series: [
            { name: 'WhatsApp', data: [12, 10, 8, 7, 6], color: '#25d366' },
            { name: 'Messenger', data: [10, 8, 7, 6, 5], color: '#16baff' },
            { name: 'Instagram', data: [8, 7, 6, 5, 4], color: '#ff0369' },
            { name: 'Web', data: [8, 7, 7, 4, 3], color: '#616161' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 9. Location Wise Review Channel Complaint Breakdown (stacked bar)
    $scope.locationVsReviewChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '9px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        series: [
            { name: 'Google', data: [10, 8, 7, 6, 5], color: '#ea4335' },
            { name: 'Facebook', data: [7, 6, 5, 5, 3], color: '#1877f2' },
            { name: 'TripAdvisor', data: [2, 2, 2, 1, 1], color: '#0caa41' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 11. Complaint SLA Breach Rate by Location (lower is better)
    // Location totals for first 6: [342, 289, 245, 198, 156, 142]
    $scope.locationSlaBreachRateChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: {
            categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
            title: { text: null }
        },
        yAxis: {
            title: { text: 'SLA Breach Rate (%)' },
            max: 100,
            labels: { format: '{value}%' }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function () { 
                        var locationTotals = [342, 289, 245, 198, 156, 142];
                        var idx = this.x;
                        var total = locationTotals[idx] || 0;
                        var count = Math.round(total * this.y / 100);
                        return this.y + '% (' + count + ')'; 
                    }
                }
            }
        },
        series: [{
            name: 'SLA Breach %',
            data: [12.4, 18.6, 9.8, 22.1, 15.3, 7.5],
            zoneAxis: 'y',
            zones: [
                { value: 10, color: '#10B981' },   // <10% green
                { value: 20, color: '#F59E0B' },   // 10–20% yellow
                { color: '#EF4444' }               // >=20% red
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Category Trend Over Time
    $scope.categoryTrendOverTimeChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'] },
        yAxis: { title: { text: 'Complaints' } },
        series: [
            { name: 'Product', data: [120,128,135,140,142,145,150,155] },
            { name: 'Delivery', data: [95,100,102,106,110,108,112,115] },
            { name: 'Billing', data: [80,82,84,86,89,90,92,95] }
        ],
        credits: { enabled: false }
    };

    // Category vs Resolution Time (Avg hours per category)
    $scope.categoryResTimeChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Quality', 'Billing', 'Service', 'Shipping', 'Technical'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + 'h'; }
                }
            }
        },
        colors: ['#10B981'],
        series: [{ name: 'Avg Hours', data: [22, 18, 16, 14, 20] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Category Share (%) - Donut
    $scope.categoryShareChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: {
            pie: {
                innerSize: '60%',
                showInLegend: true,
                dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' }
            }
        },
        series: [{ name: 'Share', colorByPoint: true, data: [
            { name: 'Quality', y: 342 },
            { name: 'Billing', y: 289 },
            { name: 'Service', y: 245 },
            { name: 'Shipping', y: 198 },
            { name: 'Technical', y: 156 }
        ] }],
        credits: { enabled: false }
    };

    // Keyword Frequency by Category (counts)
    $scope.keywordFrequencyByCategoryChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Quality', 'Billing', 'Service', 'Shipping', 'Technical'] },
        yAxis: { title: { text: 'Keyword Mentions' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#3B82F6'],
        series: [{ name: 'Mentions', data: [520, 410, 360, 280, 240] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // ============================================
    // SECTION 4: Resolution & Performance
    // ============================================
    
    // Average Resolution Time by Channel (bar/pie toggle)
    $scope.avgResTimeChartType = 'bar';
    function getAvgResTimeConfig(type) {
        var data = [
            { name: 'Survey', y: 12, color: sourceColors.Survey },
            { name: 'Support', y: 18, color: sourceColors.Support },
            { name: 'Voice', y: 24, color: sourceColors.Voice },
            { name: 'Social', y: 15, color: sourceColors.Social },
            { name: 'Reviews', y: 10, color: sourceColors.Reviews }
        ];
        if (type === 'donut') {
            return {
                chart: { type: 'pie', backgroundColor: '#fff' },
                title: { text: null },
                plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.y}h' } } },
                series: [{ name: 'Avg Resolution Time', colorByPoint: false, data: data }],
                credits: { enabled: false }
            };
        }
        return {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'] },
        yAxis: { title: { text: 'Hours' } },
        plotOptions: {
            column: {
                colorByPoint: true,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + 'h'; }
                }
            }
        },
        colors: [sourceColors.Survey, sourceColors.Support, sourceColors.Voice, sourceColors.Social, sourceColors.Reviews],
        series: [{
            name: 'Avg Resolution Time',
            data: [12, 18, 24, 15, 10]
        }],
            credits: { enabled: false },
            legend: { enabled: true }
        };
    }
    $scope.avgResTimeChartConfig = getAvgResTimeConfig($scope.avgResTimeChartType);
    $scope.switchAvgResTime = function(type) {
        $scope.avgResTimeChartType = type;
        $scope.avgResTimeChartConfig = getAvgResTimeConfig(type);
    };

    // Resolution Rate by Source (Column, %)
    // Source totals: Survey: 156, Support: 482, Voice: 721, Social: 243, Reviews: 168
    var resolutionCountsByChannel = [122, 347, 490, 182, 138]; // Estimated resolved counts
    $scope.resolutionRateByChannelChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff',
            spacingBottom: 50
        },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'] },
        yAxis: { title: { text: 'Resolution Rate (%)' }, max: 100, labels: { format: '{value}%' } },
        plotOptions: {
            column: {
                dataLabels: { 
                    enabled: true, 
                    formatter: function(){ 
                        var idx = this.x;
                        var count = resolutionCountsByChannel[idx] || Math.round(this.y * (idx === 0 ? 156 : idx === 1 ? 482 : idx === 2 ? 721 : idx === 3 ? 243 : 168) / 100);
                        return this.y + '% (' + count + ')'; 
                    }, 
                    style: { fontWeight: 'bold', fontSize: '11px' } 
                }
            }
        },
        series: [{ 
            name: 'Resolution Rate', 
            data: [78, 72, 68, 75, 82],
            zoneAxis: 'y',
            zones: [
                { value: 60, color: '#ef4444' },   // <60% red
                { value: 75, color: '#f59e0b' },   // 60-75% yellow
                { color: '#22c55e' }               // >=75% green
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Resolution Rate by Source zones
    $scope.resolutionRateByChannelChartConfig.chart = $scope.resolutionRateByChannelChartConfig.chart || {};
    $scope.resolutionRateByChannelChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.plotBottom + 30;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥75%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#22c55e' })
                .add();
            var text1 = chart.renderer.text('Good (≥75%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#f59e0b' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ef4444' })
                .add();
            var text3 = chart.renderer.text('Poor (<60%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };

    // Resolution Rate by Social and Messaging Channel (Column, %)
    // Channel totals: WhatsApp: 142, Messenger: 118, Instagram: 98, Web: 86
    var resolutionCountsBySocial = [116, 92, 73, 60]; // Estimated resolved counts
    $scope.resolutionRateBySocialMessagingChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff',
            spacingBottom: 50
        },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Web'] },
        yAxis: { title: { text: 'Resolution Rate (%)' }, max: 100, labels: { format: '{value}%' } },
        plotOptions: {
            column: {
                dataLabels: { 
                    enabled: true, 
                    formatter: function(){ 
                        var idx = this.x;
                        var count = resolutionCountsBySocial[idx] || Math.round(this.y * (idx === 0 ? 142 : idx === 1 ? 118 : idx === 2 ? 98 : 86) / 100);
                        return this.y + '% (' + count + ')'; 
                    }, 
                    style: { fontWeight: 'bold', fontSize: '11px' } 
                }
            }
        },
        series: [{ 
            name: 'Resolution Rate', 
            data: [82, 78, 74, 70],
            zoneAxis: 'y',
            zones: [
                { value: 60, color: '#ef4444' },   // <60% red
                { value: 75, color: '#f59e0b' },   // 60-75% yellow
                { color: '#22c55e' }               // >=75% green
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Resolution Rate by Social & Messaging zones
    $scope.resolutionRateBySocialMessagingChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.plotBottom + 30;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥75%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#22c55e' })
                .add();
            var text1 = chart.renderer.text('Good (≥75%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#f59e0b' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ef4444' })
                .add();
            var text3 = chart.renderer.text('Poor (<60%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };

    // Resolution Rate by Review Channel (Column, %)
    // Channel totals: Google: 168, Facebook: 125, TripAdvisor: 62
    var resolutionCountsByReview = [143, 100, 47]; // Estimated resolved counts
    $scope.resolutionRateByReviewChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff',
            spacingBottom: 50
        },
        title: { text: null },
        xAxis: { categories: ['Google', 'Facebook', 'TripAdvisor'] },
        yAxis: { title: { text: 'Resolution Rate (%)' }, max: 100, labels: { format: '{value}%' } },
        plotOptions: {
            column: {
                dataLabels: { 
                    enabled: true, 
                    formatter: function(){ 
                        var idx = this.x;
                        var count = resolutionCountsByReview[idx] || Math.round(this.y * (idx === 0 ? 168 : idx === 1 ? 125 : 62) / 100);
                        return this.y + '% (' + count + ')'; 
                    }, 
                    style: { fontWeight: 'bold', fontSize: '11px' } 
                }
            }
        },
        series: [{ 
            name: 'Resolution Rate', 
            data: [85, 80, 75],
            zoneAxis: 'y',
            zones: [
                { value: 60, color: '#ef4444' },   // <60% red
                { value: 75, color: '#f59e0b' },   // 60-75% yellow
                { color: '#22c55e' }               // >=75% green
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Resolution Rate by Review zones
    $scope.resolutionRateByReviewChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.plotBottom + 30;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥75%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#22c55e' })
                .add();
            var text1 = chart.renderer.text('Good (≥75%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#f59e0b' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ef4444' })
                .add();
            var text3 = chart.renderer.text('Poor (<60%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };
    
    // Complaint Age Distribution - Histogram
    $scope.ageDistChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['0-1 day', '2-5 days', '6-10 days', '11-14 days', '15+ days'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#EF4444'],
        series: [{
            name: 'Complaints',
            data: [245, 342, 289, 156, 215]
        }],
        credits: { enabled: false }
    };
    
    // SLA Compliance Rate Over Time
    // Estimated weekly totals: [310, 320, 330, 340] (assuming ~1247 total / 4 weeks)
    var weeklyTotals = [310, 320, 330, 340];
    $scope.slaComplianceChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
        yAxis: { 
            title: { text: 'Compliance %' },
            max: 100
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { 
                        var idx = this.x;
                        var total = weeklyTotals[idx] || 0;
                        var count = Math.round(total * this.y / 100);
                        return this.y + '% (' + count + ')'; 
                    }
                },
                marker: { enabled: true, radius: 5 }
            }
        },
        colors: ['#EF4444'],
        series: [{
            name: 'SLA Compliance',
            data: [82, 85, 87, 89]
        }],
        credits: { enabled: false }
    };
    
    // Employee Performance - Horizontal bar
    // Employee resolved counts: Sarah J.: 152, Mike C.: 140, Emma W.: 132, John D.: 118, Lisa K.: 110
    var employeeResolvedCounts = [152, 140, 132, 118, 110];
    $scope.employeePerfChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Sarah J.', 'Mike C.', 'Emma W.', 'John D.', 'Lisa K.'] },
        yAxis: { title: { text: 'Resolution Rate (%)' }, max: 100 },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { 
                        var idx = this.x;
                        var count = employeeResolvedCounts[idx] || 0;
                        return this.y + '% (' + count + ')'; 
                    }
                }
            }
        },
        tooltip: { pointFormat: '{series.name}: <b>{point.y}%</b>' },
        colors: ['#10B981'],
        series: [{
            name: 'Resolved %',
            data: [78, 73, 69, 64, 61]
        }],
        credits: { enabled: false }
    };

    // Average Time per Complaint by Employee (hours)
    $scope.employeeAvgTimePerComplaintChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Sarah J.', 'Mike C.', 'Emma W.', 'John D.', 'Lisa K.'] },
        yAxis: { title: { text: 'Avg Hours per Complaint' } },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + 'h'; }
                }
            }
        },
        tooltip: { pointFormat: '{series.name}: <b>{point.y}h</b>' },
        colors: ['#6b7280'],
        series: [{ name: 'Avg Hours', data: [6.2, 6.8, 7.1, 7.6, 8.0] }],
        credits: { enabled: false }
    };

    // Resolved Complaints by Employee (count)
    $scope.employeeResolvedCountChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Sarah J.', 'Mike C.', 'Emma W.', 'John D.', 'Lisa K.'] },
        yAxis: { title: { text: 'Resolved Complaints' } },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#3b82f6'],
        series: [{ name: 'Resolved', data: [152, 140, 132, 118, 110] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Complaint Status Breakdown by Employee (stacked bar)
    $scope.employeeStatusBreakdownChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Sarah J.', 'Mike C.', 'Emma W.', 'John D.', 'Lisa K.'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
            { name: 'Open', data: [42, 38, 35, 32, 28] },
            { name: 'In Progress', data: [58, 52, 48, 44, 40] },
            { name: 'Resolved', data: [152, 140, 132, 118, 110] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Complaint Priority Breakdown by Employee (stacked bar)
    $scope.employeePriorityBreakdownChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Sarah J.', 'Mike C.', 'Emma W.', 'John D.', 'Lisa K.'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: [priorityColors.High, priorityColors.Medium, priorityColors.Low],
        series: [
            { name: 'High', data: [68, 62, 58, 52, 48] },
            { name: 'Medium', data: [98, 88, 82, 74, 68] },
            { name: 'Low', data: [86, 80, 75, 68, 62] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Complaint Funnel (Funnel chart)
    $scope.funnelChartConfig = {
        chart: { type: 'funnel', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function () { return this.point.name + ': ' + this.y; },
                    softConnector: true,
                    style: { fontWeight: 'bold', fontSize: '11px' }
                },
                neckWidth: '30%',
                neckHeight: '25%'
            }
        },
        series: [{
            name: 'Complaints',
            data: [
                { name: 'Open', y: 342, color: (statusColors && statusColors.Open) || '#22c55e' },
                { name: 'In Progress', y: 589, color: (statusColors && statusColors.InProgress) || '#f59e0b' },
                { name: 'Resolved', y: 316, color: (statusColors && statusColors.Resolved) || '#3b82f6' }
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Reopened/Escalated Complaints Trend
    $scope.reopenedTrendChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                },
                marker: { enabled: true, radius: 5 }
            },
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#EF4444', '#F59E0B'],
        series: [
            { name: 'Reopened', type: 'line', data: [42, 38, 35, 32] },
            { name: 'Escalated', type: 'line', data: [28, 25, 22, 20] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Avg Time to First Response
    $scope.timeToFirstResponseChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey','Support','Voice','Social','Reviews'] },
        yAxis: { title: { text: 'Hours' } },
        plotOptions: getBarChartPlotOptions(),
        colors: [sourceColors.Survey, sourceColors.Support, sourceColors.Voice, sourceColors.Social, sourceColors.Reviews],
        series: [{ name: 'TTFR', data: [1.2, 2.4, 3.1, 2.0, 1.0] }],
        credits: { enabled: false }
    };

    // Resolution Time Distribution (Box & Whisker)
    $scope.resolutionTimeDistributionChartConfig = {
        chart: { type: 'boxplot', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey','Support','Voice','Social','Reviews'] },
        yAxis: { title: { text: 'Hours' } },
        series: [{
            name: 'Resolution Time',
            data: [
                [2, 4, 6, 8, 12],   // Survey
                [4, 8, 12, 16, 24], // Support
                [6, 10, 18, 24, 36],// Voice
                [4, 7, 10, 14, 20], // Social
                [1, 3, 5, 7, 10]    // Reviews
            ]
        }],
        credits: { enabled: false }
    };

    // SLA Breach Reasons
    $scope.slaBreachReasonsChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: { pie: { innerSize: '55%', dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f} %' } } },
        series: [{
            name: 'Breach Reasons', colorByPoint: true,
            data: [
                { name: 'High Volume', y: 35 },
                { name: 'Dependency Delay', y: 28 },
                { name: 'Data Missing', y: 18 },
                { name: 'Escalation Pending', y: 12 },
                { name: 'Other', y: 7 }
            ]
        }],
        credits: { enabled: false }
    };
    
    // ============================================
    // SECTION 5: Sentiment & Feedback
    // ============================================
    
    // Sentiment Breakdown
    $scope.sentimentBreakdownChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y})' }
            }
        },
        colors: ['#EF4444', '#F59E0B', '#10B981'],
        series: [{
            name: 'Sentiment',
            colorByPoint: true,
            data: [
                { name: 'Negative', y: 524 },
                { name: 'Neutral', y: 436 },
                { name: 'Positive', y: 287 }
            ]
        }],
        credits: { enabled: false }
    };

    

    // Word Cloud (Highcharts Wordcloud) with sentiment filter
    var wordCloudAll = [
        { name: 'refund', weight: 120, sentiment: 'negative' },
        { name: 'delay', weight: 95, sentiment: 'negative' },
        { name: 'quality', weight: 75, sentiment: 'negative' },
        { name: 'billing', weight: 60, sentiment: 'negative' },
        { name: 'delivery', weight: 45, sentiment: 'negative' },
        { name: 'support', weight: 40, sentiment: 'neutral' },
        { name: 'response', weight: 38, sentiment: 'neutral' },
        { name: 'defect', weight: 35, sentiment: 'negative' },
        { name: 'cancel', weight: 30, sentiment: 'negative' },
        { name: 'late', weight: 28, sentiment: 'negative' },
        { name: 'helpful', weight: 26, sentiment: 'positive' },
        { name: 'resolved', weight: 24, sentiment: 'positive' },
        { name: 'thanks', weight: 22, sentiment: 'positive' }
    ];
    function getWordCloudData(filter) {
        if (!filter || filter === 'all') return wordCloudAll.map(function(w){ return { name: w.name, weight: w.weight }; });
        return wordCloudAll.filter(function(w){ return w.sentiment === filter; }).map(function(w){ return { name: w.name, weight: w.weight }; });
    }
    function buildWordCloudConfig(filter) {
        return {
            series: [{ type: 'wordcloud', name: 'Occurrences', data: getWordCloudData(filter) }],
            title: { text: null },
            credits: { enabled: false }
        };
    }
    $scope.wordCloudFilter = 'all';
    $scope.wordCloudChartConfig = buildWordCloudConfig($scope.wordCloudFilter);
    $scope.switchWordCloud = function(filter) {
        $scope.wordCloudFilter = filter;
        $scope.wordCloudChartConfig = buildWordCloudConfig(filter);
    };
    
    // Emotion Distribution
    $scope.emotionAnalysisChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Angry', 'Frustrated', 'Sad', 'Neutral', 'Happy', 'Satisfied'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            column: {
                colorByPoint: true,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#ef4444', '#f97316', '#3b82f6', '#9ca3af', '#10b981', '#84cc16'],
        series: [{
            name: 'Emotions',
            colorByPoint: true,
            data: [156, 245, 178, 289, 145, 134]
        }],
        credits: { enabled: false }
    };
    
    // Sentiment Trend Over Time
    $scope.sentimentTrendChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        yAxis: { title: { text: 'Percentage' } },
        colors: ['#EF4444', '#F59E0B', '#10B981'],
        series: [
            { name: 'Negative', data: [48, 45, 42, 44, 41, 40, 38, 39, 42, 40, 41, 42] },
            { name: 'Neutral', data: [32, 33, 34, 33, 35, 36, 37, 36, 35, 36, 35, 35] },
            { name: 'Positive', data: [20, 22, 24, 23, 24, 24, 25, 25, 23, 24, 24, 23] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Category-wise Sentiment
    $scope.categorySentimentChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Quality', 'Billing', 'Service', 'Shipping', 'Technical'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#EF4444', '#F59E0B', '#10B981'],
        series: [
            { name: 'Negative', data: [142, 118, 98, 78, 62] },
            { name: 'Neutral', data: [118, 98, 82, 65, 52] },
            { name: 'Positive', data: [82, 73, 65, 55, 42] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Social Platform Sentiment (Grouped bar)
    $scope.socialPlatformSentimentChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Facebook', 'Twitter', 'TikTok'] },
        yAxis: { title: { text: 'Count' } },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        series: [
            { name: 'Positive', data: [22,18,20,18,15,12] },
            { name: 'Neutral', data: [38,32,25,24,18,16] },
            { name: 'Negative', data: [42,35,28,30,22,20] }
        ],
        credits: { enabled: false }
    };

    // Review Platform Sentiment
    $scope.reviewPlatformSentimentChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Google','Facebook','TripAdvisor','Trustpilot'] },
        yAxis: { title: { text: 'Count' } },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        series: [
            { name: 'Positive', data: [65,52,28,18] },
            { name: 'Neutral', data: [70,56,30,22] },
            { name: 'Negative', data: [33,28,20,12] }
        ],
        credits: { enabled: false }
    };

    // Keyword Colors (shared with Top Categories where applicable)
    var keywordColors = {
        refund: '#ef4444',
        delay: '#f59e0b',
        quality: '#3b82f6',
        billing: '#10b981',
        delivery: '#8b5cf6'
    };

    // Keyword–Category Correlation (Heatmap)
    $scope.keywordCategoryCorrelationChartConfig = {
        chart: { type: 'heatmap', backgroundColor: '#fff', animation: true },
        title: { text: null },
        xAxis: {
            categories: ['Product Issue', 'Delivery Issue', 'Billing Issue', 'Customer Care', 'Technical Issue'],
            labels: { style: { fontSize: '11px' } },
            title: { text: 'Complaint Categories' }
        },
        yAxis: {
            categories: ['delay', 'refund', 'defective', 'rude', 'missing'],
            title: { text: 'Keywords' },
            labels: { style: { fontSize: '11px' } }
        },
        colorAxis: {
            min: 0,
            max: 100,
            stops: [
                [0, '#FFFDE7'],    // very light yellow
                [0.5, '#FDE68A'],  // soft yellow
                [1, '#D97706']     // dark orange
            ],
            labels: { format: '{value}%' }
        },
        plotOptions: {
            heatmap: {
                borderWidth: 1,
                animation: true,
                dataLabels: {
                    enabled: true,
                    color: '#111827',
                    style: { fontWeight: 'bold', fontSize: '10px', textOutline: 'none' },
                    formatter: function() { return this.point.value + '%'; }
                },
                states: { hover: { enabled: true } }
            }
        },
        series: [{
            name: 'Correlation %',
            data: [
                // x: category index, y: keyword index, value: correlation %
                [0, 0, 72], [1, 0, 85], [2, 0, 48], [3, 0, 36], [4, 0, 28], // delay
                [0, 1, 64], [1, 1, 42], [2, 1, 88], [3, 1, 30], [4, 1, 22], // refund
                [0, 2, 91], [1, 2, 38], [2, 2, 26], [3, 2, 18], [4, 2, 35], // defective
                [0, 3, 22], [1, 3, 18], [2, 3, 28], [3, 3, 76], [4, 3, 20], // rude
                [0, 4, 55], [1, 4, 62], [2, 4, 24], [3, 4, 14], [4, 4, 40]  // missing
            ]
        }],
        tooltip: {
            formatter: function () {
                var category = this.series.xAxis.categories[this.point.x];
                var keyword = this.series.yAxis.categories[this.point.y];
                return '<b>Keyword:</b> ' + keyword + '<br/>' +
                       '<b>Category:</b> ' + category + '<br/>' +
                       '<b>Correlation:</b> ' + this.point.value + '%';
            }
        },
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // ============================================
    // SECTION 6: Timeline & Insights
    // ============================================
    
    // Complaint Open vs Resolved Timeline
    $scope.timelineChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: dailyDates },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        colors: [statusColors.Open, statusColors.Resolved],
        series: [
            { name: 'Open', data: [85, 92, 88, 95, 98, 102, 105, 98, 112, 108, 115, 118, 120, 125] },
            { name: 'Resolved', data: [72, 78, 75, 82, 85, 88, 90, 85, 95, 92, 98, 102, 105, 108] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Complaint Volume Heatmap - Day of Week and Hour
    $scope.volumeHeatmapConfig = $scope.dayHourHeatmapConfig; // Reuse same config
    
    // Top Repeating Issues
    $scope.repeatingIssuesChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Product Defect', 'Billing Error', 'Late Delivery', 'Account Lock', 'Poor Service'] },
        yAxis: { title: { text: 'Occurrences' } },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'middle',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#0EA5E9'],
        series: [{
            name: 'Repeats',
            data: [45, 38, 32, 28, 25]
        }],
        credits: { enabled: false }
    };

    // Complaint Lifecycle Duration Trend by Source
    $scope.lifecycleDurationTrendChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Week 1','Week 2','Week 3','Week 4','Week 5'] },
        yAxis: { title: { text: 'Hours (Avg)' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        colors: [sourceColors.Survey, sourceColors.Support, sourceColors.Voice, sourceColors.Social, sourceColors.Reviews],
        series: [
            { name: 'Survey', data: [12, 11.5, 11, 10.5, 10] },
            { name: 'Support', data: [18, 17, 16.5, 16, 15.5] },
            { name: 'Voice', data: [24, 23, 22, 21, 20] },
            { name: 'Social', data: [15, 14.5, 14, 13.5, 13] },
            { name: 'Reviews', data: [10, 9.5, 9, 8.5, 8] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // Slowest-Resolving Categories (Bar - All Categories)
    $scope.slowestResolvingCategoriesChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Product Quality', 'Billing', 'Service', 'Technical', 'Shipping', 'Order', 'Account', 'Other'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: getBarChartPlotOptions(),
        colors: ['#ef4444'],
        series: [{ name: 'Avg Hours', data: [28, 24, 22, 21, 20, 18, 16, 14] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Fastest-Resolving Locations (Bar - All Locations)
    $scope.fastestResolvingLocationsChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura', 'Ratnapura', 'Badulla'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: getBarChartPlotOptions(),
        colors: ['#10B981'],
        series: [{ name: 'Avg Hours', data: [8.4, 9.1, 9.6, 10.2, 10.8, 11.2, 11.8, 12.4, 13.0, 13.6] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Complaint Closure Rate (Line, %)
    // Estimated monthly totals: [850, 920, 980, 1050, 1100, 1180, 1200, 1150, 1220, 1190, 1247, 1300]
    var monthlyTotals = [850, 920, 980, 1050, 1100, 1180, 1200, 1150, 1220, 1190, 1247, 1300];
    $scope.complaintClosureRateChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
        yAxis: { title: { text: 'Closure Rate (%)' }, max: 100 },
        plotOptions: {
            line: { 
                dataLabels: { 
                    enabled: true, 
                    formatter: function(){ 
                        var idx = this.x;
                        var total = monthlyTotals[idx] || 0;
                        var count = Math.round(total * this.y / 100);
                        return this.y + '% (' + count + ')'; 
                    }, 
                    style: { fontWeight: 'bold', fontSize: '11px' } 
                }, 
                marker: { enabled: true, radius: 4 } 
            }
        },
        colors: ['#3B82F6'],
        series: [{ name: 'Closure %', data: [68, 70, 72, 71, 73, 75, 76, 77, 78, 79, 80, 82] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // First-Contact Resolution Rate (FCR) Over Time
    // Estimated weekly totals: [250, 260, 270, 280, 290]
    var fcrWeeklyTotals = [250, 260, 270, 280, 290];
    $scope.firstContactResolutionRateChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Week 1','Week 2','Week 3','Week 4','Week 5'] },
        yAxis: { title: { text: 'FCR %' }, max: 100 },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() {
                        var idx = this.x;
                        var total = fcrWeeklyTotals[idx] || 0;
                        var count = Math.round(total * this.y / 100);
                        return this.y + '% (' + count + ')';
                    }
                }
            }
        },
        colors: ['#10B981'],
        series: [{ name: 'FCR %', data: [62, 65, 67, 70, 72] }],
        credits: { enabled: false }
    };
    
    // ============================================
    // SECTION 7: AI & Smart Insights
    // ============================================
    
    // Predictive Analytics
    $scope.predictiveChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        yAxis: { title: { text: 'Complaints' } },
        colors: ['#F97316', '#EF4444'],
        series: [
            { name: 'Actual', data: [850, 920, 980, 1050, 1100, 1180, 1200, 1150, 1220, 1190, 1247, null], type: 'line', marker: { enabled: true } },
            { name: 'Predicted', data: [null, null, null, null, null, null, null, null, null, null, null, 1380], type: 'line', dashStyle: 'dash', marker: { enabled: true } }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Anomaly Detection
    $scope.anomalyChartConfig = {
        chart: { type: 'scatter', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { title: { text: 'Time' }, categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { title: { text: 'Complaint Count' } },
        colors: ['#F97316', '#EF4444'],
        series: [
            { name: 'Normal', data: [[0, 85], [1, 92], [2, 88], [3, 95], [4, 98], [5, 72], [6, 68]] },
            { name: 'Anomaly', data: [[3, 145], [5, 128]] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // AI Insights: Top 3 Complaint Categories This Week
    $scope.aiTopCategoriesChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Product Quality', 'Billing', 'Service Delay'] },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: getBarChartPlotOptions(),
        series: [{ name: 'This Week', data: [340, 280, 220], color: sourceColors.Reviews }],
        credits: { enabled: false }
    };

    // AI Insights: Most Delayed Locations (avg hours)
    $scope.aiDelayedLocationsChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy'] },
        yAxis: { title: { text: 'Avg Resolution Hours' } },
        plotOptions: getBarChartPlotOptions(),
        series: [{ name: 'Avg Hours', data: [18, 14, 12], color: '#ef4444' }],
        credits: { enabled: false }
    };

    // AI Insights: Fastest Resolving Team / Assignee (avg hours)
    $scope.aiFastestResolvingChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Team Alpha', 'Sarah J.', 'Mike C.'] },
        yAxis: { title: { text: 'Avg Hours (lower is better)' }, reversed: true },
        plotOptions: getBarChartPlotOptions(),
        series: [{ name: 'Avg Hours', data: [8.4, 7.8, 8.1], color: '#10b981' }],
        credits: { enabled: false }
    };

    // AI Insights: Emerging Complaint Trends (WoW % increase)
    $scope.aiEmergingTrendsChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Delivery Delays', 'App Login Issues', 'Refund Wait'] },
        yAxis: { title: { text: 'WoW Increase %' }, max: 100 },
        plotOptions: getBarChartPlotOptions(),
        series: [{ name: 'WoW %', data: [12, 9, 7], color: '#f59e0b' }],
        credits: { enabled: false }
    };

    // AI Insights: Predicted Next-Month Volume (simple single-point column)
    $scope.aiForecastNextMonthChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Next Month'] },
        yAxis: { title: { text: 'Predicted Complaints' } },
        series: [{ name: 'Forecast', data: [1380], color: '#3b82f6' }],
        dataLabels: { enabled: false },
        credits: { enabled: false }
    };

    // AI Insights: Sentiment Summary (pie)
    $scope.aiSentimentSummaryChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: { pie: { innerSize: '40%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.0f}% ({point.y})' } } },
        series: [{ name: 'Share', data: [
            { name: 'Negative', y: 52, color: '#ef4444' },
            { name: 'Neutral', y: 31, color: '#f59e0b' },
            { name: 'Positive', y: 17, color: '#10b981' }
        ] }],
        credits: { enabled: false }
    };

    // AI Insights: Correlation Highlight (avg resolution hours)
    $scope.aiCorrelationHighlightChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Social Media'] },
        yAxis: { title: { text: 'Avg Resolution Hours' } },
        series: [{ name: 'Avg Hours', data: [10, 13], color: '#6b7280' }],
        credits: { enabled: false }
    };
    
    // Menu Functions
    $scope.toggleHeaderMenu = function() {
        $scope.headerMenuOpen = !$scope.headerMenuOpen;
        Object.keys($scope.chartMenus).forEach(function(key) {
            $scope.chartMenus[key] = false;
        });
    };
    
    $scope.toggleChartMenu = function(chartId) {
        $scope.chartMenus[chartId] = !$scope.chartMenus[chartId];
        $scope.headerMenuOpen = false;
        Object.keys($scope.chartMenus).forEach(function(key) {
            if (key !== chartId) {
                $scope.chartMenus[key] = false;
            }
        });
    };
    
    $scope.switchChannelChart = function(type) {
        $scope.channelChartType = type;
        $scope.channelChartConfig = getChannelChartConfig(type);
    };
    
    $scope.headerMenuAction = function(action) {
        $scope.headerMenuOpen = false;
        alert('Header menu action: ' + action + ' (placeholder)');
    };
    
    $scope.downloadChart = function(chartId, format) {
        $scope.chartMenus[chartId] = false;
        var chartName = chartId || 'chart';
        alert('Download ' + chartName + ' as ' + format.toUpperCase() + ' (placeholder)');
    };
    
    $scope.closeAllMenus = function(event) {
        var target = event.target;
        var parent = target.parentElement;
        var isMenuRelated = false;
        
        while (parent && parent !== document.body) {
            if (parent.classList.contains('menu-button') || 
                parent.classList.contains('menu-dropdown') ||
                parent.classList.contains('header-actions') ||
                parent.classList.contains('chart-menu')) {
                isMenuRelated = true;
                break;
            }
            parent = parent.parentElement;
        }
        
        if (!target.classList.contains('menu-button') && !isMenuRelated) {
            $scope.headerMenuOpen = false;
            Object.keys($scope.chartMenus).forEach(function(key) {
                $scope.chartMenus[key] = false;
            });
        }
    };
    
    // Fullscreen toggle function
    $scope.toggleFullscreen = function(event) {
        event.stopPropagation();
        var button = event.currentTarget;
        var chartCard = button.closest('.chart-card');
        if (chartCard) {
            if (chartCard.classList.contains('fullscreen')) {
                chartCard.classList.remove('fullscreen');
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                chartCard.classList.add('fullscreen');
                if (chartCard.requestFullscreen) {
                    chartCard.requestFullscreen();
                } else if (chartCard.webkitRequestFullscreen) {
                    chartCard.webkitRequestFullscreen();
                } else if (chartCard.mozRequestFullScreen) {
                    chartCard.mozRequestFullScreen();
                } else if (chartCard.msRequestFullscreen) {
                    chartCard.msRequestFullscreen();
                }
            }
        }
    };

    // Remove previous header enhancements (custom fullscreen/menu injection)
});
