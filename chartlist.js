//Chat Toggle Link
angular.module('app')
    .directive('chartList', ['CommonQuery', function (CommonQuery) {
        return {
            restrict: 'ACE',
            template: '<div id="analysisChart"></div>',
            replace: true,
            link: function (scope, el, attr) {

                scope.$watch(attr['ngModel'], function (newValue, oldValue) {

                    if (newValue) {

                        console.log(newValue);
                        var chartsOpts = newValue;
                        var chartsData = newValue.data;
                        var lineOptions = [];
                        var barOptions = [];
                        var ws = document.getElementById('analysisChart');
                        console.log(chartsData);
                        var insertText = '';
                        var btntext = '';
                        angular.forEach(chartsData, function (value) {
                            var xdataLine = [];
                            var xdataBar = [];
                            var ydataLine = [];
                            var ydataBar = [];

                            if (value.charttype === 'LINE') {
                                if (value.columnname) {
                                    if (value.isfoucs) {
                                        btntext = '<div class="col-sm-6"><button class="btn btn-danger btn-focus" id="' + value.columnname + '" data-type="LINE" title="' + value.title + '" data-focus="true" data-logy="' + value.logycolumn + '" data-table="' + value.tablename + '">取消监控</button></div>'
                                    } else {
                                        btntext = '<div class="col-sm-6"><button class="btn btn-primary btn-focus" id="' + value.columnname + '" data-type="LINE" title="' + value.title + '" data-focus="false" data-logy="' + value.logycolumn + '" data-table="' + value.tablename + '">添加监控</button></div>'
                                    }
                                }
                                angular.forEach(value.list, function (e) {
                                    xdataLine.push(e.logx);
                                    ydataLine.push(e.logy);
                                });
                                var optionLine = CommonQuery.chartsOptions({
                                    type: 'line',//图表类别
                                    title: {
                                        text: '',//标题
                                        subtext: ''//副标题
                                    },
                                    data: ydataLine,//数据
                                    xAxis: xdataLine//x轴坐标
                                });
                                lineOptions.push({
                                    id: value.columnname + 'l',
                                    data: optionLine
                                });
                                insertText += '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">' +
                                    '<div id=' + '\"' + value.columnname + 'l\"' + ' style="width: 200px; height: 320px;" class="linecharts"></div>' +
                                    '<div class="row">' +
                                    '<p class="col-sm-6">' + value.msg + '</p>' +
                                    btntext +
                                    '</div>' +
                                    '</div>';
                            } else if (value.charttype === 'BAR') {
                                if (value.columnname) {
                                    if (value.isfoucs) {
                                        btntext = '<div class="col-sm-6"><button class="btn btn-danger btn-focus" id="' + value.columnname + '" data-type="BAR" title="' + value.title + '" data-focus="true" data-logy="' + value.logycolumn + '" data-table="' + value.tablename + '">取消监控</button></div>'
                                    } else {
                                        btntext = '<div class="col-sm-6"><button class="btn btn-primary btn-focus" id="' + value.columnname + '" data-type="BAR" title="' + value.title + '" data-focus="false" data-logy="' + value.logycolumn + '" data-table="' + value.tablename + '">添加监控</button></div>'
                                    }
                                }
                                angular.forEach(value.list, function (e) {
                                    xdataBar.push(e.logx);
                                    ydataBar.push(e.logy);
                                });
                                var optionBar = CommonQuery.chartsOptions({
                                    type: 'bar',//图表类别
                                    title: {
                                        text: value.title,//标题
                                        subtext: ''//副标题
                                    },
                                    data: ydataBar,//数据
                                    xAxis: xdataBar//x轴坐标
                                });
                                barOptions.push({
                                    id: value.chartid,
                                    data: optionBar
                                });
                                insertText += '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">' +
                                    '<div id=' + '"' + value.chartid + '"' + ' style="width: 300px; height: 320px;" class="barcharts"></div>' +
                                    '<div class="row">' +
                                    '<p class="col-sm-6">' + value.msg + '</p>' +
                                    btntext +
                                    '</div>' +
                                    '</div>';
                            }
                        });
                        //console.log(insertText);
                        $(ws).html(insertText);
                        angular.forEach($(ws).find('.linecharts'), function (value) {
                            var myChartLine = echarts.init(value);
                            //console.log(lineOptions);
                            angular.forEach(lineOptions, function (e) {
                                if (e.id === value.id) {

                                    myChartLine.setOption(e.data);
                                }
                            });
                        });
                        angular.forEach($(ws).find('.barcharts'), function (value) {
                            var myChartBar = echarts.init(value);
                            console.log(barOptions);
                            angular.forEach(barOptions, function (e) {
                                if (e.id === value.id) {

                                    myChartBar.setOption(e.data);
                                }
                            });
                        });
                        $('.btn-focus').click(function () {
                            //console.log($(this).attr('data-focus'));
                            var _this = $(this);
                            var url = '';
                            var param = {
                                columnname: $(this).attr('id'),
                                echarttype: $(this).attr('data-type'),
                                echartname: $(this).attr('title'),
                                logycolumn: chartsOpts.logycolumn ? chartsOpts.logycolumn : $(this).attr('data-logy'),//数据分析列 列名
                                tablename: chartsOpts.tablename ? chartsOpts.tablename : $(this).attr('data-table'),
                                workdatecolumname: chartsOpts.workdatecolumname
                            };
                            if ($(this).attr('data-focus') === 'false') {
                                url = './daechart/save'
                            } else {
                                url = './daechart/cancelfocus'
                            }
                            console.log(param);
                            $.ajax({
                                url: url,
                                contentType: 'application/json',
                                data: JSON.stringify(param),
                                dataType: 'json',
                                type: 'POST',
                                async: false,
                                success: function (data) {
                                    console.log(data);
                                    if (data.success) {
                                        console.log(_this);
                                        if (_this.attr('data-focus') === 'false') {
                                            _this.attr('data-focus', 'true');
                                            _this.removeClass('btn-primary');
                                            _this.addClass('btn-danger');
                                            _this.text('取消监控')
                                        } else if (_this.attr('data-focus') === 'true') {
                                            _this.attr('data-focus', 'false');
                                            _this.removeClass('btn-danger');
                                            _this.addClass('btn-primary');
                                            _this.text('添加监控')
                                        }
                                    }
                                }
                            });
                            //console.log(param)
                        })
                    }
                }, true);
            }
        };
    }]);
