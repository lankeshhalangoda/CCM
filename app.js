// AngularJS App Module
var app = angular.module('dashboardApp', []);

// Dashboard Controller
app.controller('DashboardController', function($scope, $http) {
    // Unified source colors
    var sourceColors = {
        Survey: '#540d6e',
        Support: '#ee4266',
        Voice: '#ffd23f',
        Social: '#3bceac',
        Reviews: '#0ead69'
    };
    // Status and Priority colors
    var statusColors = {
        Open: '#0d3b66',
        InProgress: '#faf0ca',
        Resolved: '#f4d35e'
    };
    var priorityColors = {
        High: '#26547c',
        Medium: '#ef476f',
        Low: '#ffd166'
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
        trend: false, channel: false, statusBreakdown: false, prioritySplit: false,
        dayHourHeatmap: false, monthlyGrowth: false, perThousand: false,
        sourceStatus: false, sourcePriority: false,
        sourceResTime: false, sourceTrend: false, sourceShare: false,
        topCategories: false, categoryStatus: false, topLocations: false,
        locationCategory: false, avgResTime: false, ageDist: false,
        slaCompliance: false, employeePerf: false, funnel: false,
        reopenedTrend: false, sentimentBreakdown: false, emotionAnalysis: false,
        wordCloud: false, sentimentTrend: false, categorySentiment: false,
        timeline: false, volumeHeatmap: false, repeatingIssues: false,
        predictive: false, anomaly: false,
        socialSub: false, reviewBreakdown: false, socialSentiment: false,
        channelTypeTrend: false, subChannelResTime: false,
        locationTrend: false, categoryTrend: false,
        ttfResponse: false, resTimeDist: false, slaBreach: false,
        socialPlatformSent: false, reviewPlatformSent: false, keywordCorrelation: false,
        lifecycleDuration: false, fcrRate: false, employeeAvgTime: false
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
                    dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %' }
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
                plotOptions: { pie: { innerSize: '0%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %' } } },
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
            plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
            series: [
                { name: 'Open', data: [342, null, null], color: statusColors.Open },
                { name: 'In Progress', data: [null, 589, null], color: statusColors.InProgress },
                { name: 'Resolved', data: [null, null, 316], color: statusColors.Resolved }
            ],
        credits: { enabled: false }
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
                xAxis: { categories: ['High','Medium','Low'] },
                yAxis: { title: { text: 'Count' } },
                plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
                series: [
                    { name: 'High', data: [523, null, null], color: priorityColors.High },
                    { name: 'Medium', data: [null, 469, null], color: priorityColors.Medium },
                    { name: 'Low', data: [null, null, 255], color: priorityColors.Low }
                ],
                credits: { enabled: false }
            };
        }
        return {
            chart: { type: 'pie', backgroundColor: '#fff' },
            title: { text: null },
            plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f} %' } } },
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

    // Complaints per 1,000 Interactions (normalized KPI)
    $scope.perThousandChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support', 'Voice', 'Social', 'Reviews'] },
        yAxis: { title: { text: 'Per 1,000 Interactions' } },
        plotOptions: getBarChartPlotOptions(),
        colors: ['#64748B'],
        series: [{ name: 'Complaints / 1,000', data: [2.4, 4.8, 6.1, 3.2, 1.7] }],
        credits: { enabled: false },
        legend: { enabled: false }
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
            plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f} %' } } },
            series: [{ name: 'Source Share', colorByPoint: false, data: data }],
            credits: { enabled: false }
        };
    }
    $scope.sourceShareChartConfig = getSourceShareConfig($scope.sourceShareType);
    $scope.switchSourceShare = function(type) {
        $scope.sourceShareType = type;
        $scope.sourceShareChartConfig = getSourceShareConfig(type);
    };

    // Social Media Sub-Channel Breakdown (grouped with legends per platform)
    $scope.socialSubChannelsChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: [''] },
        yAxis: { title: { text: 'Complaints' } },
        plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
        series: [
            { name: 'WhatsApp', data: [142] },
            { name: 'Messenger', data: [118] },
            { name: 'Instagram', data: [98] },
            { name: 'Facebook', data: [86] },
            { name: 'Twitter', data: [65] },
            { name: 'TikTok', data: [52] }
        ],
        credits: { enabled: false }
    };

    // Review Channel Breakdown
    $scope.reviewBreakdownChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: { pie: { innerSize: '55%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f} %' } } },
        series: [{
            name: 'Reviews', colorByPoint: true,
            data: [
                { name: 'Google', y: 168 }, { name: 'Facebook', y: 125 }, { name: 'TripAdvisor', y: 62 }, { name: 'Trustpilot', y: 48 }
            ]
        }],
        credits: { enabled: false }
    };

    // Social Channel vs Sentiment (Stacked)
    $scope.socialSentimentStackedChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Facebook', 'Twitter', 'TikTok'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: { bar: { stacking: 'normal' } },
        colors: ['#EF4444', '#F59E0B', '#10B981'],
        series: [
            { name: 'Negative', data: [42, 35, 28, 30, 22, 20] },
            { name: 'Neutral', data: [38, 32, 25, 24, 18, 16] },
            { name: 'Positive', data: [22, 18, 20, 18, 15, 12] }
        ],
        credits: { enabled: false }
    };

    // Complaints per Channel Type Over Time
    $scope.channelTypeOverTimeChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'] },
        yAxis: { title: { text: 'Complaints' } },
        series: [
            { name: 'WhatsApp', data: [12,14,15,16,18,20,19,21] },
            { name: 'Messenger', data: [10,11,12,12,13,14,14,15] },
            { name: 'Instagram', data: [8,9,10,10,11,12,12,13] }
        ],
        credits: { enabled: false }
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
        colors: ['#F59E0B'],
        series: [{
            name: 'Complaints',
            data: [342, 289, 245, 198, 156, 89, 78, 17]
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
    $scope.sriLankaMapChartConfig = { chart: { backgroundColor: '#fff' }, title: { text: null }, credits: { enabled: false } };
    (function loadSriLankaMap(){
        var mapUrl = 'https://cdn.jsdelivr.net/npm/@highcharts/map-collection@2.1.2/countries/lk/lk-all.geo.json';
        $http.get(mapUrl).then(function(response){
            var mapData = response.data;
            $scope.sriLankaMapChartConfig = {
                chart: { map: mapData, backgroundColor: '#fff' },
                title: { text: null },
                mapNavigation: { enabled: true, enableButtons: false },
                colorAxis: { min: 0, minColor: '#E5F0FF', maxColor: '#3B82F6' },
                series: [{
                    data: mapData.features.map(function(f, i){ return [f.properties['hc-key'] || f.properties['hc-key'], Math.round(Math.random()*100)]; }),
                    name: 'Complaints',
                    states: { hover: { color: '#a4edba' } },
                    dataLabels: { enabled: false }
                }],
                credits: { enabled: false }
            };
        }, function(){
            // Fallback empty state on fetch error
            $scope.sriLankaMapChartConfig = { chart: { backgroundColor: '#fff' }, title: { text: 'Sri Lanka map failed to load' }, credits: { enabled: false } };
        });
    })();

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
    
    // ============================================
    // SECTION 4: Resolution & Performance
    // ============================================
    
    // Average Resolution Time by Channel
    $scope.avgResTimeChartConfig = {
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
        credits: { enabled: false }
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
                    formatter: function() { return this.y + '%'; }
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
                    formatter: function() { return this.y + '%'; }
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
    
    // Complaint Funnel
    $scope.funnelChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Created', 'Assigned', 'In Progress', 'Resolved', 'Closed'] },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y; }
                }
            }
        },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#0EA5E9', '#8B5CF6'],
        series: [{
            name: 'Complaints',
            data: [1247, 1056, 589, 316, 298]
        }],
        credits: { enabled: false }
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
                dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.1f} %' }
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

    // Keyword-Category Correlation (Bubble/Scatter)
    $scope.keywordCategoryCorrelationChartConfig = {
        chart: { type: 'scatter', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { title: { text: 'Keyword Frequency' } },
        yAxis: { title: { text: 'Category Impact Score' } },
        series: [{
            name: 'Keywords',
            data: [
                { x: 120, y: 80, name: 'refund' },
                { x: 95, y: 70, name: 'delay' },
                { x: 75, y: 65, name: 'quality' },
                { x: 60, y: 55, name: 'billing' },
                { x: 45, y: 50, name: 'delivery' }
            ]
        }],
        tooltip: { pointFormat: '{point.name}: ({point.x}, {point.y})' },
        credits: { enabled: false }
    };
    
    // ============================================
    // SECTION 6: Timeline & Insights
    // ============================================
    
    // Complaint Creation vs Resolution Timeline
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
        colors: ['#0EA5E9', '#10B981'],
        series: [
            { name: 'Created', data: [85, 92, 88, 95, 98, 102, 105, 98, 112, 108, 115, 118, 120, 125] },
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

    // Complaint Lifecycle Duration Trend (Box or Line)
    $scope.lifecycleDurationTrendChartConfig = {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Week 1','Week 2','Week 3','Week 4','Week 5'] },
        yAxis: { title: { text: 'Hours (Avg)' } },
        series: [
            { name: 'Lifecycle Avg', data: [48, 45, 44, 42, 40] }
        ],
        credits: { enabled: false }
    };

    // First-Contact Resolution Rate (FCR) Over Time
    $scope.firstContactResolutionRateChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Week 1','Week 2','Week 3','Week 4','Week 5'] },
        yAxis: { title: { text: 'FCR %' }, max: 100 },
        plotOptions: getBarChartPlotOptions(),
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
        plotOptions: { pie: { innerSize: '40%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.0f}%' } } },
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

    // Enhance all chart headers: add fullscreen button and replace menu dots with hamburger
    function enhanceChartHeaders() {
        try {
            var headers = document.querySelectorAll('.chart-card .chart-header');
            headers.forEach(function(header) {
                var card = header.closest('.chart-card');
                var container = card;
                // Insert fullscreen button if missing
                if (!header.querySelector('.fullscreen-button')) {
                    var fsBtn = document.createElement('button');
                    fsBtn.className = 'fullscreen-button';
                    fsBtn.title = 'View full screen';
                    fsBtn.setAttribute('aria-label', 'View full screen');
                    fsBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V4h5v2H6v3H4zm10-5h5v5h-2V6h-3V4zM9 20H4v-5h2v3h3v2zm11-5v5h-5v-2h3v-3h2z" fill="currentColor"/></svg>';
                    fsBtn.addEventListener('click', function(e){
                        e.stopPropagation();
                        card.classList.toggle('fullscreen');
                        // trigger chart reflow if Highcharts is available
                        if (window.Highcharts) {
                            var chartContainer = card.querySelector('[hc-chart]');
                            if (chartContainer && chartContainer.__highcharts_chart__) {
                                chartContainer.__highcharts_chart__.reflow();
                            }
                        }
                    });
                    var menu = header.querySelector('.chart-menu');
                    if (menu) {
                        header.insertBefore(fsBtn, menu);
                    } else {
                        header.appendChild(fsBtn);
                    }
                }
                // Ensure toolbar exists right under header
                var toolbar = card.querySelector(':scope > .chart-toolbar');
                if (!toolbar) {
                    toolbar = document.createElement('div');
                    toolbar.className = 'chart-toolbar';
                    var left = document.createElement('div');
                    left.className = 'chart-toolbar-left';
                    var toggle = document.createElement('div');
                    toggle.className = 'chart-toggle';
                    left.appendChild(toggle);
                    toolbar.appendChild(left);
                    // right side container for menu
                    var right = document.createElement('div');
                    right.className = 'chart-menu';
                    toolbar.appendChild(right);
                    header.after(toolbar);
                }
                // Move existing header menu into toolbar right side
                var headerMenu = header.querySelector('.chart-menu');
                if (headerMenu) {
                    var rightSide = toolbar.querySelector('.chart-menu');
                    if (rightSide !== headerMenu) {
                        // move children (button + dropdown) into toolbar menu
                        rightSide.innerHTML = '';
                        while (headerMenu.firstChild) {
                            rightSide.appendChild(headerMenu.firstChild);
                        }
                        headerMenu.remove();
                    }
                }
                // Replace menu button content with hamburger icon (in toolbar)
                var toolbarMenuBtn = toolbar.querySelector('.menu-button');
                if (toolbarMenuBtn && toolbarMenuBtn.dataset.hamburger !== '1') {
                    toolbarMenuBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
                    toolbarMenuBtn.dataset.hamburger = '1';
                }
            });
        } catch (e) { /* noop */ }
    }

    // Observe DOM changes to enhance dynamic charts
    setTimeout(enhanceChartHeaders, 0);
    document.addEventListener('DOMContentLoaded', enhanceChartHeaders);
    // Also enhance after tab switches
    var originalSetActiveTab = $scope.setActiveTab;
    $scope.setActiveTab = function(tab) {
        originalSetActiveTab.call(this, tab);
        setTimeout(enhanceChartHeaders, 0);
    };
});
