// AngularJS App Module
var app = angular.module('dashboardApp', []);

// Dashboard Controller
app.controller('DashboardController', function($scope, $http) {
    // Global Highcharts positioning to avoid overlapping the plot
        if (window.Highcharts && Highcharts.setOptions) {
        Highcharts.setOptions({
            chart: { spacingTop: 36 },
            colors: ['#007abf','#dc3545','#28a745','#ffc107','#8b5cf6','#0ea5e9','#ec4899'],
            accessibility: {
                enabled: false
            },
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
        Survey: '#003f5c',
        Support: '#9a5caf',
        Voice: '#bc5090',
        Social: '#ff6361',
        Reviews: '#ffa600'
    };
    // Status and Priority colors (vibrant & modern)
    var statusColors = {
        Open: '#28a745',       // green
        InProgress: '#ffc107', // yellow
        Resolved: '#007abf'    // blue
    };
    var priorityColors = {
        High: '#dc3545',    // red
        Medium: '#ffc107',  // yellow
        Low: '#28a745'      // green
    };
    
    // Helper functions for badge colors
    $scope.getStatusColor = function(status) {
        var statusMap = {
            'Open': statusColors.Open,
            'In Progress': statusColors.InProgress,
            'Resolved': statusColors.Resolved
        };
        return statusMap[status] || '#6B7280';
    };
    
    $scope.getPriorityColor = function(priority) {
        return priorityColors[priority] || '#6B7280';
    };
    
    $scope.getCategoryColor = function(category) {
        // Map feed categories to chart category colors
        // Note: categoryColors is defined later, so we use direct color values here
        var categoryMap = {
            'Service': '#7209b7',      // Service Delay - Dark Purple
            'Technical': '#480ca8',     // Technical - Very Dark Purple
            'Quality': '#9d4edd',      // Product Quality - Purple
            'Billing': '#f72585',     // Billing - Pink
            'Shipping': '#560bad',     // Shipping - Deep Purple
            'Order': '#ff6b35',        // Order - Orange
            'Account': '#c2185b'       // Account - Magenta
        };
        return categoryMap[category] || '#8e24aa'; // Other - Violet
    };
    
    $scope.getSourceColor = function(source) {
        // Map new source names to color keys
        var sourceMap = {
            'Support Form': sourceColors.Support,
            'Voice Calls': sourceColors.Voice,
            'Social Channels': sourceColors.Social,
            'Review Channels': sourceColors.Reviews,
            'Survey': sourceColors.Survey
        };
        return sourceMap[source] || sourceColors[source] || '#6B7280';
    };
    
    $scope.getLocationColor = function(location) {
        // Use a consistent color scheme for locations
        var locationColors = {
            'Colombo': '#007abf',
            'Gampaha': '#10b981',
            'Kandy': '#ffc107',
            'Galle': '#8b5cf6',
            'Kurunegala': '#dc3545',
            'Matara': '#06b6d4',
            'Jaffna': '#f43f5e',
            'Anuradhapura': '#84cc16',
            'Ratnapura': '#f86624',
            'Badulla': '#43bccd'
        };
        return locationColors[location] || '#6B7280';
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
    
    // Comments Feed Data
    $scope.recentFeed = [
        { title: 'I ordered a product online two weeks ago and it still has not arrived. The tracking information shows it was shipped but there have been no updates for the past ten days. I have tried contacting customer service multiple times but only received automated responses. This is completely unacceptable and I need a refund immediately or the product delivered within the next three days.', time: '2m ago', category: 'Shipping', status: 'Open', priority: 'High', source: 'Support Form', location: 'Colombo' },
        { title: 'The product I received was damaged and not as described in the advertisement. The packaging was torn and the item inside has scratches and dents. When I tried to return it, the return process was complicated and I was told I would have to pay for return shipping. This is terrible customer service and I want a full refund including the shipping costs I already paid.', time: '15m ago', category: 'Quality', status: 'In Progress', priority: 'High', source: 'Social Platforms', location: 'Gampaha' },
        { title: 'I was charged twice for the same order and my bank account shows two separate transactions. I have contacted your billing department three times this week but no one has responded to my emails or phone calls. I need this duplicate charge refunded immediately as it has caused an overdraft fee in my account. This is urgent and I expect a response within 24 hours.', time: '32m ago', category: 'Billing', status: 'In Progress', priority: 'High', source: 'Voice Calls', location: 'Kandy' },
        { title: 'The service I received was extremely poor and the staff member was rude and unhelpful. I had to wait over an hour to be served and when I finally got assistance, the employee was dismissive of my concerns. I have been a loyal customer for five years and this experience has made me reconsider my relationship with your company. I expect an apology and compensation for my time.', time: '1h ago', category: 'Service', status: 'Open', priority: 'Medium', source: 'Review Platforms', location: 'Galle' },
        { title: 'My account was locked without any warning or explanation. I cannot access my account to make payments or view my order history. I have tried resetting my password multiple times but the system keeps saying there is an error. I have important orders pending and need immediate access to my account. Please resolve this issue as soon as possible.', time: '1h ago', category: 'Account', status: 'In Progress', priority: 'High', source: 'Support Form', location: 'Kurunegala' },
        { title: 'The item I received is completely different from what I ordered. The description said it was a premium quality product but what arrived looks like a cheap knockoff. The color is wrong, the size is incorrect, and the material feels nothing like what was advertised. I want a replacement with the correct item or a full refund including all shipping charges.', time: '2h ago', category: 'Quality', status: 'Resolved', priority: 'Medium', source: 'Social Platforms', location: 'Matara' },
        { title: 'I have been trying to cancel my subscription for the past month but cannot find the cancellation option anywhere on your website. Every time I try to contact support, I am put on hold for over thirty minutes and then disconnected. This is frustrating and I feel like you are making it intentionally difficult to cancel. I want my subscription cancelled immediately and a refund for the last billing cycle.', time: '3h ago', category: 'Billing', status: 'Open', priority: 'High', source: 'Voice Calls', location: 'Jaffna' },
        { title: 'The technical support I received was completely unhelpful and the representative did not understand my problem. I explained the issue three times and they kept giving me the same generic troubleshooting steps that I had already tried. After wasting two hours on the phone, I am no closer to resolving my issue. I need someone with actual technical knowledge to help me fix this problem.', time: '3h ago', category: 'Technical', status: 'In Progress', priority: 'Medium', source: 'Support Form', location: 'Anuradhapura' }
    ];
    
    // Daily data for last 14 days
    var dailyDates = [];
    for (var i = 13; i >= 0; i--) {
        var date = new Date();
        date.setDate(date.getDate() - i);
        dailyDates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Monthly data for last 12 months
    var monthlyDates = [];
    for (var i = 11; i >= 0; i--) {
        var date = new Date();
        date.setMonth(date.getMonth() - i);
        monthlyDates.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
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
            { name: 'Support Form', data: [28, 32, 30, 35, 38, 33, 40, 36, 42, 38, 35, 37, 40, 43] },
            { name: 'Voice Calls', data: [45, 50, 48, 52, 55, 50, 58, 54, 60, 56, 53, 55, 58, 62] },
            { name: 'Social Channels', data: [15, 18, 16, 20, 22, 19, 25, 22, 28, 24, 20, 22, 25, 28] },
            { name: 'Review Channels', data: [10, 12, 11, 14, 15, 13, 17, 15, 19, 16, 14, 15, 17, 19] }
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
                { name: 'Support Form', data: [482], color: sourceColors.Support },
                { name: 'Voice Calls', data: [721], color: sourceColors.Voice },
                { name: 'Social Channels', data: [243], color: sourceColors.Social },
                { name: 'Review Channels', data: [168], color: sourceColors.Reviews }
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
                    { name: 'Support Form', y: 482, color: sourceColors.Support },
                    { name: 'Voice Calls', y: 721, color: sourceColors.Voice },
                    { name: 'Social Channels', y: 243, color: sourceColors.Social },
                    { name: 'Review Channels', y: 168, color: sourceColors.Reviews }
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
            maxColor: '#007abf'
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
        colors: ['#007abf'],
        series: [{ name: 'Growth %', data: [5, 3, -2, 4, 6, 2, -1, 3, 4, 2, 1, 5] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Complaints per 1,000 Interactions (normalized KPI) - Multi colors like channel-wise distribution
    $scope.perThousandChartType = 'column';
    function getPerThousandConfig(type) {
        var data = [
            { name: 'Survey', y: 2.4, color: sourceColors.Survey },
            { name: 'Support Form', y: 4.8, color: sourceColors.Support },
            { name: 'Voice Calls', y: 6.1, color: sourceColors.Voice },
            { name: 'Social Platforms', y: 3.2, color: sourceColors.Social },
            { name: 'Review Platforms', y: 1.7, color: sourceColors.Reviews }
        ];
        if (type === 'donut') {
            return {
                chart: { type: 'pie', backgroundColor: '#fff' },
                title: { text: null },
                plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
                series: [{ name: 'Complaints per 1,000', colorByPoint: false, data: data }],
                credits: { enabled: false }
            };
        }
        return {
            chart: { type: 'column', backgroundColor: '#fff' },
            title: { text: null },
            xAxis: { categories: [''] },
            yAxis: { title: { text: 'Complaints per 1,000 Interactions' } },
            plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' }, formatter: function(){ return this.y; } } } },
            series: data.map(function(item) {
                return { name: item.name, data: [item.y], color: item.color };
            }),
            credits: { enabled: false },
            legend: { enabled: true }
        };
    }
    $scope.perThousandChartConfig = getPerThousandConfig($scope.perThousandChartType);
    $scope.switchPerThousand = function(type) {
        $scope.perThousandChartType = type;
        $scope.perThousandChartConfig = getPerThousandConfig(type);
    };
    
    // ============================================
    // SECTION 2: Source & Channel Analytics
    // ============================================
    
    // Source vs Status - Clustered column
    $scope.sourceStatusChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support Form', 'Voice Calls', 'Social Channels', 'Review Channels'] },
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
        xAxis: { categories: ['Survey', 'Support Form', 'Voice Calls', 'Social Channels', 'Review Channels'] },
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
        xAxis: { categories: ['Survey', 'Support Form', 'Voice Calls', 'Social Channels', 'Review Channels'] },
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
        colors: ['#007abf', '#dc3545'],
        series: [
            {
                name: 'Avg Resolution Time',
                type: 'column',
                data: [12, 18, 24, 15, 10],
                color: '#007abf'
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
            { name: 'Support Form', data: [28, 32, 30, 35, 38, 33, 40, 36, 42, 38, 35, 37, 40, 43] },
            { name: 'Voice Calls', data: [45, 50, 48, 52, 55, 50, 58, 54, 60, 56, 53, 55, 58, 62] },
            { name: 'Social Channels', data: [15, 18, 16, 20, 22, 19, 25, 22, 28, 24, 20, 22, 25, 28] },
            { name: 'Review Channels', data: [10, 12, 11, 14, 15, 13, 17, 15, 19, 16, 14, 15, 17, 19] }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };
    
    // Source Share (pie/bar toggle)
    $scope.sourceShareType = 'pie';
    function getSourceShareConfig(type) {
        var data = [
            { name: 'Voice Calls', y: 721, color: sourceColors.Voice },
            { name: 'Support Form', y: 482, color: sourceColors.Support },
            { name: 'Social Channels', y: 243, color: sourceColors.Social },
            { name: 'Review Channels', y: 168, color: sourceColors.Reviews },
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

    // Social & Messaging Channel Breakdown (Whatsapp - #25d366, Messenger - #1877f2, Instagram - #c32aa3, Web - #a6b1b7)
    $scope.socialMessagingBreakdownType = 'column';
    function getSocialMessagingBreakdownConfig(type) {
        var data = [
            { name: 'WhatsApp', y: 142, color: '#25d366' },
            { name: 'Messenger', y: 118, color: '#1877f2' },
            { name: 'Instagram', y: 98, color: '#ff0369' },
            { name: 'Web', y: 86, color: '#616161' }
        ];
        if (type === 'donut') {
            return {
                chart: { type: 'pie', backgroundColor: '#fff' },
                title: { text: null },
                plotOptions: { pie: { innerSize: '60%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
                series: [{ name: 'Complaints', colorByPoint: false, data: data }],
                credits: { enabled: false }
            };
        }
        return {
            chart: { type: 'column', backgroundColor: '#fff' },
            title: { text: null },
            xAxis: { categories: [''] },
            yAxis: { title: { text: 'Complaints' } },
            plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
            series: data.map(function(item) {
                return { name: item.name, data: [item.y], color: item.color };
            }),
            credits: { enabled: false }
        };
    }
    $scope.socialMessagingBreakdownChartConfig = getSocialMessagingBreakdownConfig($scope.socialMessagingBreakdownType);
    $scope.switchSocialMessagingBreakdown = function(type) {
        $scope.socialMessagingBreakdownType = type;
        $scope.socialMessagingBreakdownChartConfig = getSocialMessagingBreakdownConfig(type);
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
            { name: 'Messenger', data: [10,11,12,12,13,14,14,15,16,14,13,14,15,16], color: '#1877f2' },
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
    $scope.reviewBreakdownType = 'pie';
    function getReviewBreakdownConfig(type) {
        var data = [
            { name: 'Google', y: 168, color: '#ea4335' },
            { name: 'Facebook', y: 125, color: '#1877f2' },
            { name: 'TripAdvisor', y: 62, color: '#00AF87' }
        ];
        if (type === 'bar') {
            return {
                chart: { type: 'column', backgroundColor: '#fff' },
                title: { text: null },
                xAxis: { categories: [''] },
                yAxis: { title: { text: 'Complaints' } },
                plotOptions: { column: { dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '11px' } } } },
                series: data.map(function(item) {
                    return { name: item.name, data: [item.y], color: item.color };
                }),
                credits: { enabled: false },
                legend: { enabled: true }
            };
        }
        return {
            chart: { type: 'pie', backgroundColor: '#fff' },
            title: { text: null },
            plotOptions: { pie: { innerSize: '55%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' } } },
            series: [{
                name: 'Review Platforms', colorByPoint: false,
                data: data
            }],
            credits: { enabled: false }
        };
    }
    $scope.reviewBreakdownChartConfig = getReviewBreakdownConfig($scope.reviewBreakdownType);
    $scope.switchReviewBreakdown = function(type) {
        $scope.reviewBreakdownType = type;
        $scope.reviewBreakdownChartConfig = getReviewBreakdownConfig(type);
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
            { name: 'TripAdvisor', data: [4,5,5,6,6,7,7,8,8,7,6,7,8,9], color: '#00AF87' }
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
    
    // Top Complaint Categories - Horizontal bar with donut switch
    // Category color palette for Top Categories legend (8 colors excluding blue, red, yellow, green)
    var categoryColors = {
        'Product Quality': (keywordColors && keywordColors.quality) || '#9d4edd',  // Purple
        'Billing': (keywordColors && keywordColors.billing) || '#f72585',            // Pink
        'Service Delay': (keywordColors && keywordColors.delay) || '#7209b7',         // Dark Purple
        'Shipping': (keywordColors && keywordColors.delivery) || '#560bad',          // Deep Purple
        'Technical': '#480ca8',                                                       // Very Dark Purple
        'Order': '#ff6b35',                                                           // Orange
        'Account': '#c2185b',                                                         // Magenta
        'Other': '#8e24aa'                                                            // Violet
    };

    $scope.topCategoriesChartType = 'bar';
    function getTopCategoriesConfig(type) {
        var data = [
            { name: 'Product Quality', y: 342, color: categoryColors['Product Quality'] },
            { name: 'Billing', y: 289, color: categoryColors['Billing'] },
            { name: 'Service Delay', y: 245, color: categoryColors['Service Delay'] },
            { name: 'Shipping', y: 198, color: categoryColors['Shipping'] },
            { name: 'Technical', y: 156, color: categoryColors['Technical'] },
            { name: 'Order', y: 89, color: categoryColors['Order'] },
            { name: 'Account', y: 78, color: categoryColors['Account'] },
            { name: 'Other', y: 17, color: categoryColors['Other'] }
        ];
        
        if (type === 'donut') {
            return {
                chart: { type: 'pie', backgroundColor: '#fff' },
                title: { text: null },
                plotOptions: {
                    pie: {
                        innerSize: '60%',
                        showInLegend: true,
                        dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' }
                    }
                },
                series: [{ name: 'Complaints', colorByPoint: false, data: data }],
                credits: { enabled: false }
            };
        }
        
        return {
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
                data: data
        }],
        credits: { enabled: false }
        };
    }
    $scope.topCategoriesChartConfig = getTopCategoriesConfig($scope.topCategoriesChartType);
    $scope.switchTopCategories = function(type) {
        $scope.topCategoriesChartType = type;
        $scope.topCategoriesChartConfig = getTopCategoriesConfig(type);
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
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura', 'Ratnapura', 'Badulla'] },
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
        colors: ['#ffc107'],
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
            maxColor: '#ffc107'
        },
        xAxis: {
            categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala']
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
            { name: 'Colombo', data: [142,150,148,155,162,158,165,170] },
            { name: 'Gampaha', data: [125,130,128,132,137,140,142,145] },
            { name: 'Kandy', data: [98,102,101,105,110,112,114,118] }
        ],
        credits: { enabled: false }
    };

    // ============================================
    // Location Analytics Charts
    // ============================================
    
    // 1. Location Wise Complaint Breakdown (horizontal bar/pie toggle)
    $scope.locationBreakdownType = 'bar';
    function getLocationBreakdownConfig(type) {
        var locations = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura', 'Ratnapura', 'Badulla'];
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
            colors: ['#007abf'],
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
            { name: 'Colombo', data: [12,14,15,16,18,20,19,21,22,20,18,19,21,23], color: '#007abf' },
            { name: 'Gampaha', data: [10,11,12,12,13,14,14,15,16,14,13,14,15,16], color: '#10B981' },
            { name: 'Kandy', data: [8,9,10,10,11,12,12,13,14,12,11,12,13,14], color: '#ffc107' },
            { name: 'Galle', data: [7,8,9,9,10,11,11,12,13,11,10,11,12,13], color: '#dc3545' },
            { name: 'Kurunegala', data: [6,7,8,8,9,10,10,11,12,10,9,10,11,12], color: '#8B5CF6' }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
    };

    // 2.5. Location Wise Resolution Rate (bar chart - horizontal for many locations)
    $scope.locationResolutionRateChartConfig = {
        chart: { 
            type: 'bar', 
            backgroundColor: '#fff',
            spacingBottom: 60
        },
        title: { text: null },
        xAxis: { 
            categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura', 'Ratnapura', 'Badulla'],
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
                { value: 60, color: '#dc3545' },   // <60% red
                { value: 80, color: '#ffc107' },   // 60-80% yellow
                { color: '#28a745' }               // >=80% green
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend using events since zones don't create separate legend items
    $scope.locationResolutionRateChartConfig.chart.events = {
        load: function() {
            var chart = this;
            // Position legend at the very bottom inside the chart area
            var legendY = chart.chartHeight - 20;
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
                .attr({ fill: '#28a745' })
                .add();
            var text1 = chart.renderer.text('Good (≥80%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-80%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (60-80%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
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
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala'] },
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
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala'] },
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
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura'] },
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
                { value: 0, color: '#dc3545' },
                { color: '#28a745' }
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // 6. Location Wise Source Complaint Breakdown (stacked bar)
    $scope.locationVsSourceChartConfig = {
        chart: { type: 'bar', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala'] },
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
            { name: 'Support Form', data: [98, 82, 68, 55, 44], color: sourceColors.Support },
            { name: 'Voice Calls', data: [142, 118, 98, 78, 62], color: sourceColors.Voice },
            { name: 'Social Channels', data: [38, 32, 28, 22, 18], color: sourceColors.Social },
            { name: 'Review Channels', data: [19, 16, 19, 15, 10], color: sourceColors.Reviews }
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
            maxColor: '#007abf'
        },
        xAxis: {
            categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala']
        },
        yAxis: {
            categories: ['Survey', 'Support Form', 'Voice Calls', 'Social Channels', 'Review Channels'],
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
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala'] },
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
            { name: 'Messenger', data: [10, 8, 7, 6, 5], color: '#1877f2' },
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
        xAxis: { categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala'] },
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
            { name: 'TripAdvisor', data: [2, 2, 2, 1, 1], color: '#00AF87' }
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
            categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara'],
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
                { value: 10, color: '#007abf' },   // <10% blue
                { value: 20, color: '#ffc107' },   // 10–20% yellow
                { color: '#dc3545' }               // >=20% red
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Sri Lanka Geo Complaint Density Map - Using column chart as fallback since map module has issues
    $scope.sriLankaMapChartConfig = {
        chart: {
            type: 'column',
            backgroundColor: '#fff'
        },
        title: { text: null },
        xAxis: {
            categories: ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Matara', 'Jaffna', 'Anuradhapura', 'Ratnapura', 'Badulla', 'Kalutara', 'Ampara', 'Puttalam', 'Trincomalee', 'Vavuniya', 'Mannar', 'Kegalle', 'Polonnaruwa', 'Hambantota', 'Moneragala', 'Batticaloa', 'Mullaitivu', 'Kilinochchi', 'Nuwara Eliya', 'Matale'],
            title: { text: 'Districts' }
        },
        yAxis: {
            title: { text: 'Complaints' }
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '10px' },
                    formatter: function() { return this.y; }
                },
                colorByPoint: true,
                colors: ['#007abf']
            }
        },
        series: [{
            name: 'Complaints',
            data: [54, 40, 42, 51, 50, 55, 38, 41, 44, 45, 68, 62, 35, 58, 49, 53, 46, 39, 37, 56, 43, 47, 45, 48, 52],
            color: '#007abf'
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
        colors: ['#007abf'],
        series: [{ name: 'Avg Hours', data: [22, 18, 16, 14, 20], color: '#007abf' }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Category Share (%) - Donut
    $scope.categoryShareType = 'pie';
    function getCategoryShareConfig(type) {
        var data = [
            { name: 'Quality', y: 342, color: categoryColors['Product Quality'] || '#007abf' },
            { name: 'Billing', y: 289, color: categoryColors['Billing'] || '#007abf' },
            { name: 'Service', y: 245, color: categoryColors['Service Delay'] || '#007abf' },
            { name: 'Shipping', y: 198, color: categoryColors['Shipping'] || '#007abf' },
            { name: 'Technical', y: 156, color: categoryColors['Technical'] || '#007abf' }
        ];
        if (type === 'bar') {
            return {
                chart: { type: 'column', backgroundColor: '#fff' },
                title: { text: null },
                xAxis: { categories: data.map(function(d) { return d.name; }) },
                yAxis: { title: { text: 'Complaints' } },
                plotOptions: {
                    column: {
                        colorByPoint: false,
                        dataLabels: {
                            enabled: true,
                            align: 'left',
                            verticalAlign: 'middle',
                            style: { fontWeight: 'bold', fontSize: '11px' },
                            formatter: function() { return this.y; }
                        }
                    }
                },
                series: [{ name: 'Complaints', data: data.map(function(d) { return { y: d.y, color: d.color }; }) }],
                credits: { enabled: false },
                legend: { enabled: false }
            };
        }
        return {
            chart: { type: 'pie', backgroundColor: '#fff' },
            title: { text: null },
            plotOptions: {
                pie: {
                    innerSize: '60%',
                    showInLegend: true,
                    dataLabels: { enabled: true, format: '<b>{point.name}</b><br>{point.percentage:.1f}% ({point.y})' }
                }
            },
            series: [{ name: 'Share', colorByPoint: false, data: data }],
            credits: { enabled: false }
        };
    }
    $scope.categoryShareChartConfig = getCategoryShareConfig($scope.categoryShareType);
    $scope.switchCategoryShare = function(type) {
        $scope.categoryShareType = type;
        $scope.categoryShareChartConfig = getCategoryShareConfig(type);
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
        colors: ['#007abf'],
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
            { name: 'Support Form', y: 18, color: sourceColors.Support },
            { name: 'Voice Calls', y: 24, color: sourceColors.Voice },
            { name: 'Social Channels', y: 15, color: sourceColors.Social },
            { name: 'Review Channels', y: 10, color: sourceColors.Reviews }
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
        xAxis: { categories: ['Survey', 'Support Form', 'Voice Calls', 'Social Channels', 'Review Channels'] },
        yAxis: { title: { text: 'Hours' } },
        plotOptions: {
            column: {
                colorByPoint: false,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'top',
                    style: { fontWeight: 'bold', fontSize: '11px' },
                    formatter: function() { return this.y + 'h'; }
                }
            }
        },
        series: [{
            name: 'Avg Resolution Time',
            data: [
                { y: 12, color: sourceColors.Survey },
                { y: 18, color: sourceColors.Support },
                { y: 24, color: sourceColors.Voice },
                { y: 15, color: sourceColors.Social },
                { y: 10, color: sourceColors.Reviews }
            ]
        }],
            credits: { enabled: false },
            legend: { enabled: false }
        };
    }
    $scope.avgResTimeChartConfig = getAvgResTimeConfig($scope.avgResTimeChartType);
    $scope.switchAvgResTime = function(type) {
        $scope.avgResTimeChartType = type;
        $scope.avgResTimeChartConfig = getAvgResTimeConfig(type);
    };

    // Resolution Rate by Source (Column, %)
    // Source totals: Survey: 156, Support Form: 482, Voice Calls: 721, Social Channels: 243, Review Channels: 168
    var resolutionCountsByChannel = [122, 347, 490, 182, 138]; // Estimated resolved counts
    $scope.resolutionRateByChannelChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff',
            spacingBottom: 60
        },
        title: { text: null },
        xAxis: { categories: ['Survey', 'Support Form', 'Voice Calls', 'Social Channels', 'Review Channels'] },
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
                { value: 60, color: '#dc3545' },   // <60% red
                { value: 75, color: '#ffc107' },   // 60-75% yellow
                { color: '#28a745' }               // >=75% green
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
            var legendY = chart.chartHeight - 20;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥75%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#28a745' })
                .add();
            var text1 = chart.renderer.text('Good (≥75%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
                .add();
            var text3 = chart.renderer.text('Poor (<60%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };

    // Average Resolution Time by Social & Messaging Channel (Column, hours)
    var avgResTimeBySocialData = [12, 15, 18, 20];
    var socialChannelColors = ['#25d366', '#1877f2', '#ff0369', '#616161']; // WhatsApp, Messenger, Instagram, Web
    $scope.avgResTimeBySocialMessagingChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff'
        },
        title: { text: null },
        xAxis: { categories: ['WhatsApp', 'Messenger', 'Instagram', 'Web'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: {
            column: {
                dataLabels: { 
                    enabled: true, 
                    formatter: function(){ return this.y + 'h'; }, 
                    style: { fontWeight: 'bold', fontSize: '11px' } 
                }
            }
        },
        series: [{ 
            name: 'Avg Hours', 
            data: avgResTimeBySocialData.map(function(value, index) {
                return { y: value, color: socialChannelColors[index] };
            })
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Resolution Rate by Social and Messaging Channel (Column, %)
    // Channel totals: WhatsApp: 142, Messenger: 118, Instagram: 98, Web: 86
    var resolutionCountsBySocial = [116, 92, 73, 60]; // Estimated resolved counts
    $scope.resolutionRateBySocialMessagingChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff',
            spacingBottom: 60
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
                { value: 60, color: '#dc3545' },   // <60% red
                { value: 75, color: '#ffc107' },   // 60-75% yellow
                { color: '#28a745' }               // >=75% green
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Resolution Rate by Social & Messaging zones
    $scope.resolutionRateBySocialMessagingChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.chartHeight - 20;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥75%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#28a745' })
                .add();
            var text1 = chart.renderer.text('Good (≥75%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
                .add();
            var text3 = chart.renderer.text('Poor (<60%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };

    // Average Resolution Time by Review Channel (Column, hours)
    var avgResTimeByReviewData = [10, 12, 14];
    var reviewChannelColors = ['#ea4335', '#1877f2', '#00AF87']; // Google, Facebook, TripAdvisor
    $scope.avgResTimeByReviewChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff'
        },
        title: { text: null },
        xAxis: { categories: ['Google', 'Facebook', 'TripAdvisor'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: {
            column: {
                dataLabels: { 
                    enabled: true, 
                    formatter: function(){ return this.y + 'h'; }, 
                    style: { fontWeight: 'bold', fontSize: '11px' } 
                }
            }
        },
        series: [{ 
            name: 'Avg Hours', 
            data: avgResTimeByReviewData.map(function(value, index) {
                return { y: value, color: reviewChannelColors[index] };
            })
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // Resolution Rate by Review Channel (Column, %)
    // Channel totals: Google: 168, Facebook: 125, TripAdvisor: 62
    var resolutionCountsByReview = [143, 100, 47]; // Estimated resolved counts
    $scope.resolutionRateByReviewChartConfig = {
        chart: { 
            type: 'column', 
            backgroundColor: '#fff',
            spacingBottom: 60
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
                { value: 60, color: '#dc3545' },   // <60% red
                { value: 75, color: '#ffc107' },   // 60-75% yellow
                { color: '#28a745' }               // >=75% green
            ]
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Resolution Rate by Review zones
    $scope.resolutionRateByReviewChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.chartHeight - 20;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Good (≥75%) - Green
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#28a745' })
                .add();
            var text1 = chart.renderer.text('Good (≥75%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Poor (<60%) - Red
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
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
        colors: ['#dc3545'],
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
        colors: ['#dc3545'],
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
        colors: ['#007abf'],
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
                { name: 'Open', y: 342, color: (statusColors && statusColors.Open) || '#28a745' },
                { name: 'In Progress', y: 589, color: (statusColors && statusColors.InProgress) || '#ffc107' },
                { name: 'Resolved', y: 316, color: (statusColors && statusColors.Resolved) || '#007abf' }
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
        colors: ['#dc3545', '#ffc107'],
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
        xAxis: { categories: ['Survey','Support Form','Voice Calls','Social Channels','Review Channels'] },
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
        xAxis: { categories: ['Survey','Support Form','Voice Calls','Social Channels','Review Channels'] },
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
        colors: ['#dc3545', '#ffc107', '#10B981'],
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
        { name: 'thanks', weight: 22, sentiment: 'positive' },
        { name: 'broken', weight: 55, sentiment: 'negative' },
        { name: 'error', weight: 50, sentiment: 'negative' },
        { name: 'missing', weight: 48, sentiment: 'negative' },
        { name: 'wrong', weight: 46, sentiment: 'negative' },
        { name: 'damaged', weight: 44, sentiment: 'negative' },
        { name: 'slow', weight: 42, sentiment: 'negative' },
        { name: 'poor', weight: 40, sentiment: 'negative' },
        { name: 'issue', weight: 38, sentiment: 'neutral' },
        { name: 'problem', weight: 36, sentiment: 'negative' },
        { name: 'complaint', weight: 34, sentiment: 'negative' },
        { name: 'service', weight: 32, sentiment: 'neutral' },
        { name: 'customer', weight: 30, sentiment: 'neutral' },
        { name: 'order', weight: 28, sentiment: 'neutral' },
        { name: 'product', weight: 26, sentiment: 'neutral' },
        { name: 'shipping', weight: 24, sentiment: 'neutral' },
        { name: 'payment', weight: 22, sentiment: 'neutral' },
        { name: 'account', weight: 20, sentiment: 'neutral' },
        { name: 'excellent', weight: 25, sentiment: 'positive' },
        { name: 'satisfied', weight: 23, sentiment: 'positive' },
        { name: 'great', weight: 21, sentiment: 'positive' },
        { name: 'good', weight: 19, sentiment: 'positive' },
        { name: 'appreciate', weight: 17, sentiment: 'positive' },
        { name: 'faulty', weight: 52, sentiment: 'negative' },
        { name: 'unacceptable', weight: 49, sentiment: 'negative' },
        { name: 'disappointed', weight: 47, sentiment: 'negative' },
        { name: 'frustrated', weight: 45, sentiment: 'negative' },
        { name: 'unresponsive', weight: 43, sentiment: 'negative' },
        { name: 'incomplete', weight: 41, sentiment: 'negative' },
        { name: 'incorrect', weight: 39, sentiment: 'negative' },
        { name: 'unreliable', weight: 37, sentiment: 'negative' },
        { name: 'unsatisfactory', weight: 35, sentiment: 'negative' },
        { name: 'outstanding', weight: 27, sentiment: 'positive' },
        { name: 'amazing', weight: 25, sentiment: 'positive' },
        { name: 'fantastic', weight: 23, sentiment: 'positive' },
        { name: 'wonderful', weight: 21, sentiment: 'positive' },
        { name: 'professional', weight: 29, sentiment: 'positive' },
        { name: 'efficient', weight: 27, sentiment: 'positive' },
        { name: 'prompt', weight: 25, sentiment: 'positive' },
        { name: 'reliable', weight: 23, sentiment: 'positive' },
        { name: 'timely', weight: 21, sentiment: 'positive' },
        { name: 'communication', weight: 33, sentiment: 'neutral' },
        { name: 'update', weight: 31, sentiment: 'neutral' },
        { name: 'status', weight: 29, sentiment: 'neutral' },
        { name: 'tracking', weight: 27, sentiment: 'neutral' },
        { name: 'invoice', weight: 25, sentiment: 'neutral' },
        { name: 'receipt', weight: 23, sentiment: 'neutral' },
        { name: 'package', weight: 21, sentiment: 'neutral' },
        { name: 'return', weight: 19, sentiment: 'neutral' },
        { name: 'exchange', weight: 17, sentiment: 'neutral' },
        { name: 'warranty', weight: 15, sentiment: 'neutral' },
        { name: 'refunded', weight: 53, sentiment: 'negative' },
        { name: 'cancelled', weight: 51, sentiment: 'negative' },
        { name: 'overcharged', weight: 49, sentiment: 'negative' },
        { name: 'undelivered', weight: 47, sentiment: 'negative' },
        { name: 'misleading', weight: 45, sentiment: 'negative' },
        { name: 'deceptive', weight: 43, sentiment: 'negative' },
        { name: 'unfair', weight: 41, sentiment: 'negative' },
        { name: 'inconvenient', weight: 39, sentiment: 'negative' },
        { name: 'unhelpful', weight: 37, sentiment: 'negative' },
        { name: 'rude', weight: 35, sentiment: 'negative' },
        { name: 'impolite', weight: 33, sentiment: 'negative' },
        { name: 'satisfaction', weight: 28, sentiment: 'positive' },
        { name: 'pleased', weight: 26, sentiment: 'positive' },
        { name: 'content', weight: 24, sentiment: 'positive' },
        { name: 'happy', weight: 22, sentiment: 'positive' },
        { name: 'delighted', weight: 20, sentiment: 'positive' },
        { name: 'thrilled', weight: 18, sentiment: 'positive' },
        { name: 'recommend', weight: 16, sentiment: 'positive' }
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
        colors: ['#dc3545', '#f97316', '#007abf', '#9ca3af', '#10b981', '#84cc16'],
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
        colors: ['#dc3545', '#ffc107', '#10B981'],
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
        colors: ['#dc3545', '#ffc107', '#10B981'],
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
        colors: ['#10B981', '#ffc107', '#dc3545'],
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
        colors: ['#10B981', '#ffc107', '#dc3545'],
        series: [
            { name: 'Positive', data: [65,52,28,18] },
            { name: 'Neutral', data: [70,56,30,22] },
            { name: 'Negative', data: [33,28,20,12] }
        ],
        credits: { enabled: false }
    };

    // Keyword Colors (shared with Top Categories where applicable)
    var keywordColors = {
        refund: '#dc3545',
        delay: '#ffc107',
        quality: '#007abf',
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
    
    // Complaint Status Timeline (daily/monthly toggle)
    $scope.timelineChartType = 'daily';
    var timelineDailyData = {
        open: [85, 92, 88, 95, 98, 102, 105, 98, 112, 108, 115, 118, 120, 125],
        inProgress: [145, 152, 148, 155, 158, 162, 165, 158, 172, 168, 175, 178, 180, 185],
        resolved: [72, 78, 75, 82, 85, 88, 90, 85, 95, 92, 98, 102, 105, 108]
    };
    var timelineMonthlyData = {
        open: [2850, 2920, 2880, 2950, 2980, 3020, 3050, 2980, 3120, 3080, 3150, 3180],
        inProgress: [4450, 4520, 4480, 4550, 4580, 4620, 4650, 4580, 4720, 4680, 4750, 4780],
        resolved: [2720, 2780, 2750, 2820, 2850, 2880, 2900, 2850, 2950, 2920, 2980, 3020]
    };
    function getTimelineConfig(type) {
        var categories = type === 'daily' ? dailyDates : monthlyDates;
        var data = type === 'daily' ? timelineDailyData : timelineMonthlyData;
        return {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
            xAxis: { categories: categories },
        yAxis: { title: { text: 'Count' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        colors: [statusColors.Open, statusColors.InProgress, statusColors.Resolved],
        series: [
                { name: 'Open', data: data.open },
                { name: 'In Progress', data: data.inProgress },
                { name: 'Resolved', data: data.resolved }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
        };
    }
    $scope.timelineChartConfig = getTimelineConfig($scope.timelineChartType);
    $scope.switchTimeline = function(type) {
        $scope.timelineChartType = type;
        $scope.timelineChartConfig = getTimelineConfig(type);
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

    // Complaint Lifecycle Duration Trend (daily/monthly toggle)
    $scope.lifecycleDurationTrendType = 'daily';
    var lifecycleDailyData = {
        survey: [12, 11.8, 11.5, 11.2, 11, 10.8, 10.5, 10.2, 10, 9.8, 9.5, 9.2, 9, 8.8],
        support: [18, 17.8, 17.5, 17.2, 17, 16.8, 16.5, 16.2, 16, 15.8, 15.5, 15.2, 15, 14.8],
        voice: [24, 23.5, 23, 22.5, 22, 21.5, 21, 20.5, 20, 19.5, 19, 18.5, 18, 17.5],
        social: [15, 14.8, 14.5, 14.2, 14, 13.8, 13.5, 13.2, 13, 12.8, 12.5, 12.2, 12, 11.8],
        review: [10, 9.8, 9.5, 9.2, 9, 8.8, 8.5, 8.2, 8, 7.8, 7.5, 7.2, 7, 6.8]
    };
    var lifecycleMonthlyData = {
        survey: [12, 11.5, 11, 10.5, 10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5],
        support: [18, 17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13, 12.5, 12],
        voice: [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13],
        social: [15, 14.5, 14, 13.5, 13, 12.5, 12, 11.5, 11, 10.5, 10, 9.5],
        review: [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5]
    };
    function getLifecycleDurationTrendConfig(type) {
        var categories = type === 'daily' ? dailyDates : monthlyDates;
        var data = type === 'daily' ? lifecycleDailyData : lifecycleMonthlyData;
        return {
        chart: { type: 'line', backgroundColor: '#fff' },
        title: { text: null },
            xAxis: { categories: categories },
        yAxis: { title: { text: 'Hours (Avg)' } },
        plotOptions: {
            line: {
                marker: { enabled: true, radius: 3 }
            }
        },
        colors: [sourceColors.Survey, sourceColors.Support, sourceColors.Voice, sourceColors.Social, sourceColors.Reviews],
        series: [
                { name: 'Survey', data: data.survey },
                { name: 'Support Form', data: data.support },
                { name: 'Voice Calls', data: data.voice },
                { name: 'Social Channels', data: data.social },
                { name: 'Review Channels', data: data.review }
        ],
        credits: { enabled: false },
        legend: { enabled: true }
        };
    }
    $scope.lifecycleDurationTrendChartConfig = getLifecycleDurationTrendConfig($scope.lifecycleDurationTrendType);
    $scope.switchLifecycleDurationTrend = function(type) {
        $scope.lifecycleDurationTrendType = type;
        $scope.lifecycleDurationTrendChartConfig = getLifecycleDurationTrendConfig(type);
    };

    // Slowest-Resolving Locations (Bar - All Locations)
    var slowestLocationsData = [13.6, 13.0, 12.4, 11.8, 11.2, 10.8, 10.2, 9.6, 9.1, 8.4];
    var slowestLocationsAvg = slowestLocationsData.reduce(function(a, b) { return a + b; }, 0) / slowestLocationsData.length;
    $scope.slowestResolvingLocationsChartConfig = {
        chart: { 
            type: 'bar', 
            backgroundColor: '#fff',
            spacingBottom: 60
        },
        title: { text: null },
        xAxis: { categories: ['Badulla', 'Ratnapura', 'Anuradhapura', 'Jaffna', 'Matara', 'Kurunegala', 'Galle', 'Kandy', 'Gampaha', 'Colombo'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: getBarChartPlotOptions(),
        series: [{ 
            name: 'Avg Hours', 
            data: slowestLocationsData.map(function(value, idx) {
                var color;
                if (value >= slowestLocationsAvg * 1.1) {
                    color = '#dc3545'; // Red for worst (above 110% of average)
                } else if (value <= slowestLocationsAvg * 0.9) {
                    color = '#28a745'; // Green for best (below 90% of average)
                } else {
                    color = '#ffc107'; // Yellow for average (90-110% of average)
                }
                return { y: value, color: color };
            })
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Slowest-Resolving Locations
    $scope.slowestResolvingLocationsChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.chartHeight - 20;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Worst (≥110% of avg) - Red
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
                .add();
            var text1 = chart.renderer.text('Worst (≥110% of avg)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (90-110% of avg) - Yellow
            var rect2 = chart.renderer.rect(legendX + 160, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (90-110%)', legendX + 180, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Best (≤90% of avg) - Green
            var rect3 = chart.renderer.rect(legendX + 320, legendY - 8, 15, 10, 0)
                .attr({ fill: '#28a745' })
                .add();
            var text3 = chart.renderer.text('Best (≤90% of avg)', legendX + 340, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
    };

    // Slowest-Resolving Categories (Bar - All Categories)
    var slowestCategoriesData = [28, 24, 22, 21, 20, 18, 16, 14];
    var slowestCategoriesAvg = slowestCategoriesData.reduce(function(a, b) { return a + b; }, 0) / slowestCategoriesData.length;
    $scope.slowestResolvingCategoriesChartConfig = {
        chart: { 
            type: 'bar', 
            backgroundColor: '#fff',
            spacingBottom: 60
        },
        title: { text: null },
        xAxis: { categories: ['Product Quality', 'Billing', 'Service', 'Technical', 'Shipping', 'Order', 'Account', 'Other'] },
        yAxis: { title: { text: 'Avg Resolution Time (h)' } },
        plotOptions: getBarChartPlotOptions(),
        series: [{ 
            name: 'Avg Hours', 
            data: slowestCategoriesData.map(function(value, idx) {
                var color;
                if (value >= slowestCategoriesAvg * 1.1) {
                    color = '#dc3545'; // Red for worst (above 110% of average)
                } else if (value <= slowestCategoriesAvg * 0.9) {
                    color = '#28a745'; // Green for best (below 90% of average)
                } else {
                    color = '#ffc107'; // Yellow for average (90-110% of average)
                }
                return { y: value, color: color };
            })
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };
    
    // Add custom legend for Slowest-Resolving Categories
    $scope.slowestResolvingCategoriesChartConfig.chart.events = {
        load: function() {
            var chart = this;
            var legendY = chart.chartHeight - 20;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Worst (≥110% of avg) - Red
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
                .add();
            var text1 = chart.renderer.text('Worst (≥110% of avg)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (90-110% of avg) - Yellow
            var rect2 = chart.renderer.rect(legendX + 160, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (90-110%)', legendX + 180, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Best (≤90% of avg) - Green
            var rect3 = chart.renderer.rect(legendX + 320, legendY - 8, 15, 10, 0)
                .attr({ fill: '#28a745' })
                .add();
            var text3 = chart.renderer.text('Best (≤90% of avg)', legendX + 340, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
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
        colors: ['#007abf'],
        series: [{ name: 'Closure %', data: [68, 70, 72, 71, 73, 75, 76, 77, 78, 79, 80, 82] }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    // SLA Breach Rate Over Time (Line Chart)
    // Shows the percentage of complaints that exceeded their SLA resolution timelines over time
    var slaBreachRateData = [18, 15, 22, 12, 10, 8, 9, 7, 11, 10, 9, 6];
    var slaTargetValue = 10;
    
    $scope.performanceMeterChartConfig = {
        chart: {
            type: 'line',
            backgroundColor: '#fff',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: '#1F2937'
                }
            },
            gridLineColor: '#E5E7EB',
            lineColor: '#E5E7EB'
        },
        yAxis: {
            title: {
                text: 'SLA Breach Rate (%)',
                style: {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: '#1F2937'
                }
            },
            min: 0,
            max: 30,
            labels: {
                format: '{value}%',
                    style: {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: '#1F2937'
                }
            },
            gridLineColor: '#E5E7EB',
            plotLines: [{
                value: slaTargetValue,
                color: '#9CA3AF',
                dashStyle: 'Dash',
                width: 2,
                zIndex: 5,
                label: {
                    text: 'SLA Target',
                    align: 'right',
                    x: -5,
                    style: {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        color: '#6B7280',
                        fontWeight: '500'
                    }
                }
            }]
        },
            tooltip: {
            formatter: function() {
                var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                 'July', 'August', 'September', 'October', 'November', 'December'];
                var monthName = monthNames[this.x];
                return '<b>' + monthName + '</b> – ' + this.y + '%';
            },
                style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px'
            }
        },
        plotOptions: {
            line: {
                lineWidth: 3,
                marker: {
                    enabled: true,
                    radius: 5,
                    lineWidth: 2
                },
                states: {
                    hover: {
                        lineWidth: 4,
                        marker: {
                            radius: 7
                        }
                    }
                }
            }
        },
        series: [{ 
            name: 'SLA Breach Rate',
            data: slaBreachRateData.map(function(value) {
                return {
                    y: value,
                    color: value > slaTargetValue ? '#dc3545' : '#28a745',
                    marker: {
                        fillColor: value > slaTargetValue ? '#dc3545' : '#28a745',
                        lineColor: value > slaTargetValue ? '#dc3545' : '#28a745'
                    }
                };
            }),
            zoneAxis: 'y',
            zones: [
                { value: slaTargetValue, color: '#28a745' },  // Below target - green
                { color: '#dc3545' }                          // Above target - red
            ],
            marker: {
                enabled: true,
                radius: 5,
                lineWidth: 2
            }
        }],
        credits: { enabled: false },
        legend: {
            enabled: false
        }
    };

    // First-Contact Resolution Rate (FCR) Over Time - for Timeline & Insights (daily/monthly toggle)
    $scope.firstContactResolutionRateType = 'daily';
    var fcrDailyData = {
        totals: [45, 48, 52, 50, 55, 58, 60, 57, 62, 59, 65, 68, 70, 72],
        rates: [62, 63, 64, 65, 66, 67, 68, 67, 69, 70, 71, 72, 73, 74]
    };
    var fcrMonthlyData = {
        totals: [1450, 1520, 1580, 1650, 1720, 1780, 1850, 1920, 1980, 2050, 2120, 2180],
        rates: [62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73]
    };
    function getFirstContactResolutionRateConfig(type) {
        var categories = type === 'daily' ? dailyDates : monthlyDates;
        var data = type === 'daily' ? fcrDailyData : fcrMonthlyData;
        return {
            chart: { 
                type: 'column', 
                backgroundColor: '#fff',
                spacingBottom: 60,
                events: {
        load: function() {
            var chart = this;
            var legendY = chart.chartHeight - 20;
            var legendX = chart.chartWidth / 2 - 140;
            
            if (chart.customLegend) {
                chart.customLegend.forEach(function(elem) { 
                    if (elem && elem.destroy) elem.destroy(); 
                });
            }
            chart.customLegend = [];
            
            // Poor (<60%) - Red
            var rect1 = chart.renderer.rect(legendX, legendY - 8, 15, 10, 0)
                .attr({ fill: '#dc3545' })
                .add();
            var text1 = chart.renderer.text('Poor (<60%)', legendX + 20, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect1, text1);
            
            // Average (60-75%) - Yellow
            var rect2 = chart.renderer.rect(legendX + 120, legendY - 8, 15, 10, 0)
                .attr({ fill: '#ffc107' })
                .add();
            var text2 = chart.renderer.text('Average (60-75%)', legendX + 140, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect2, text2);
            
            // Good (≥75%) - Green
            var rect3 = chart.renderer.rect(legendX + 280, legendY - 8, 15, 10, 0)
                .attr({ fill: '#28a745' })
                .add();
            var text3 = chart.renderer.text('Good (≥75%)', legendX + 300, legendY)
                .css({ fontSize: '12px', color: '#1F2937' })
                .add();
            chart.customLegend.push(rect3, text3);
        }
                }
            },
            title: { text: null },
            xAxis: { categories: categories },
            yAxis: { title: { text: 'FCR %' }, max: 100, labels: { format: '{value}%' } },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        verticalAlign: 'top',
                        style: { fontWeight: 'bold', fontSize: '11px' },
                        formatter: function() {
                            var idx = this.x;
                            var total = data.totals[idx] || 0;
                            var count = Math.round(total * this.y / 100);
                            return this.y + '% (' + count + ')';
                        }
                    }
                }
            },
            series: [{ 
                name: 'FCR %', 
                data: data.rates,
                zoneAxis: 'y',
                zones: [
                    { value: 60, color: '#dc3545' },   // <60% red
                    { value: 75, color: '#ffc107' },   // 60-75% yellow
                    { color: '#28a745' }               // >=75% green
                ]
            }],
            credits: { enabled: false },
            legend: { enabled: false }
        };
    }
    $scope.firstContactResolutionRateChartConfig = getFirstContactResolutionRateConfig($scope.firstContactResolutionRateType);
    $scope.switchFirstContactResolutionRate = function(type) {
        $scope.firstContactResolutionRateType = type;
        $scope.firstContactResolutionRateChartConfig = getFirstContactResolutionRateConfig(type);
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
        colors: ['#F97316', '#dc3545'],
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
        colors: ['#F97316', '#dc3545'],
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
        series: [{ name: 'Avg Hours', data: [18, 14, 12], color: '#dc3545' }],
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
        series: [{ name: 'WoW %', data: [12, 9, 7], color: '#ffc107' }],
        credits: { enabled: false }
    };

    // AI Insights: Predicted Next-Month Volume (simple single-point column)
    $scope.aiForecastNextMonthChartConfig = {
        chart: { type: 'column', backgroundColor: '#fff' },
        title: { text: null },
        xAxis: { categories: ['Next Month'] },
        yAxis: { title: { text: 'Predicted Complaints' } },
        series: [{ name: 'Forecast', data: [1380], color: '#007abf' }],
        dataLabels: { enabled: false },
        credits: { enabled: false }
    };

    // AI Insights: Sentiment Summary (pie)
    $scope.aiSentimentSummaryChartConfig = {
        chart: { type: 'pie', backgroundColor: '#fff' },
        title: { text: null },
        plotOptions: { pie: { innerSize: '40%', showInLegend: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.percentage:.0f}% ({point.y})' } } },
        series: [{ name: 'Share', data: [
            { name: 'Negative', y: 52, color: '#dc3545' },
            { name: 'Neutral', y: 31, color: '#ffc107' },
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
