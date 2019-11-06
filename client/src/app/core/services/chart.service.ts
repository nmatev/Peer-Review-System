import { Injectable } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import { TeamService } from './team.service';
import { UserService } from './user.service';

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

@Injectable({
    providedIn: 'root'
})

export class ChartService {

    constructor(
        private readonly teamService: TeamService,
        private readonly userService: UserService,
    ) { }

    getTeamWorkItemsChartData(order?: string) {
        return this.teamService.getAllTeamWorkItems().subscribe(data => {

            const chart = am4core.create('topteamchartdiv', am4charts.XYChart);

            const transformedData =
                data.map(x => {
                    const obj = {
                        name: x.name,
                        workItems: x.__workItems__.length,
                    };
                    return obj;
                }).sort((a, b) => {
                    // sorting by DESC order
                    if (order === 'DESC') {
                        const x = +b.workItems;
                        const y = +a.workItems;
                        if (x > y) {
                            return -1;
                        } else {
                            return 1;
                        }
                    } else {
                        const x = +b.workItems;
                        const y = +a.workItems;
                        if (x < y) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                });

            chart.data = transformedData;
            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = 'name';
            categoryAxis.renderer.minGridDistance = 40;
            categoryAxis.fontSize = 20;

            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 40;
            valueAxis.strictMinMax = true;
            valueAxis.renderer.minGridDistance = 30;
            valueAxis.fontSize = 20;

            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = 'name';
            series.dataFields.valueY = 'workItems';
            series.columns.template.tooltipText = '{valueY.value}';
            series.columns.template.tooltipY = 0;
            series.columns.template.strokeOpacity = 0;

            series.columns.template.adapter.add('fill', function (fill, target) {
                return chart.colors.getIndex(target.dataItem.index);
            });

        });
    }

    getUserWorkItemsChartData(order?: string) {
        return this.userService.getUserWorkItemsChartData().subscribe(
            (data: any) => {

                const chart = am4core.create('topuserchartdiv', am4charts.XYChart);

                const transformedData =
                    data.map(user => {
                        if (user.__workItems__.length < 1) {
                            return false;
                        }
                        const obj = {
                            name: user.name,
                            workItems: user.__workItems__.length,
                            color: chart.colors.next(),
                            bullet: 'https://www.amcharts.com/lib/images/faces/D02.png',
                        };
                        return obj;
                    }).filter(x => !!x)
                        .sort((a, b) => {
                            // sorting by DESC order
                            if (order === 'DESC') {
                                const x = +b.workItems;
                                const y = +a.workItems;
                                if (x < y) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            } else {
                                const x = +b.workItems;
                                const y = +a.workItems;
                                if (x < y) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            }
                        });
                chart.data = transformedData;

                const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = 'name';
                categoryAxis.renderer.grid.template.disabled = true;
                categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.renderer.inside = true;
                categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
                categoryAxis.renderer.labels.template.fontSize = 20;

                const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.max = 40;
                valueAxis.strictMinMax = true;
                valueAxis.renderer.minGridDistance = 30;
                valueAxis.fontSize = 20;

                // Do not crop bullets
                chart.maskBullets = false;

                // Remove padding
                chart.paddingBottom = 0;

                // Create series
                const series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = 'workItems';
                series.dataFields.categoryX = 'name';
                series.columns.template.propertyFields.fill = 'color';
                series.columns.template.propertyFields.stroke = 'color';
                series.columns.template.column.cornerRadiusTopLeft = 15;
                series.columns.template.column.cornerRadiusTopRight = 15;
                series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/b]';

                // Add bullets
                const bullet = series.bullets.push(new am4charts.Bullet());
                const image = bullet.createChild(am4core.Image);
                image.horizontalCenter = 'middle';
                image.verticalCenter = 'bottom';
                image.dy = 20;
                image.y = am4core.percent(100);
                image.propertyFields.href = 'bullet';
                image.tooltipText = series.columns.template.tooltipText;
                image.propertyFields.fill = 'color';
                image.filters.push(new am4core.DropShadowFilter());

            });
    }

    getTeamMembersChartData(order?: string) {
        return this.teamService.getAllTeamsMembers().subscribe((data: any) => {

            const chart = am4core.create('teamchartdiv', am4charts.XYChart);

            const transformedData =
                data.map(x => {
                    const obj = {
                        name: x.name,
                        workItems: x.__members__.length,
                    };
                    return obj;
                }).sort((a, b) => {
                    // sorting by DESC order
                    if (order === 'DESC') {
                        const x = +b.workItems;
                        const y = +a.workItems;
                        if (x > y) {
                            return -1;
                        } else {
                            return 1;
                        }
                    } else {
                        const x = +b.workItems;
                        const y = +a.workItems;
                        if (x < y) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                });

            chart.data = transformedData;
            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = 'name';
            categoryAxis.renderer.minGridDistance = 40;
            categoryAxis.fontSize = 20;

            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.max = 8;
            valueAxis.strictMinMax = true;
            valueAxis.renderer.minGridDistance = 30;
            valueAxis.fontSize = 20;

            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = 'name';
            series.dataFields.valueY = 'workItems';
            series.columns.template.tooltipText = '{valueY.value}';
            series.columns.template.tooltipY = 0;
            series.columns.template.strokeOpacity = 0;

            series.columns.template.adapter.add('fill', function (fill, target) {
                return chart.colors.getIndex(target.dataItem.index);
            });

        });
    }

    getTimeDataRegisterdChartData() {
        const chart = am4core.create('registeredchartdiv', am4charts.XYChart);

        // Fake registered users data
        chart.data = [{
            'date': '2012-07-27',
            'value': 13
        }, {
            'date': '2012-08-3',
            'value': 11
        }, {
            'date': '2012-08-10',
            'value': 15
        }, {
            'date': '2012-08-17',
            'value': 16
        }, {
            'date': '2012-08-24',
            'value': 18
        }, {
            'date': '2012-09-1',
            'value': 13
        }];

        // Set input format for the dates
        chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

        // Create axes
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = 'value';
        series.dataFields.dateX = 'date';
        series.tooltipText = '{value}';
        series.strokeWidth = 2;
        series.minBulletDistance = 15;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = 'vertical';
        series.tooltip.label.minWidth = 0;
        series.tooltip.label.minHeight = 0;
        series.tooltip.label.textAlign = 'middle';

        // Make bullets grow on hover
        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color('#fff');

        const bullethover = bullet.states.create('hover');
        bullethover.properties.scale = 1.3;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = 'panXY';
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;

        chart.events.on('ready', function () {
            dateAxis.zoom({ start: 0, end: 1 });
        });
    }

    getCountryWorkItemsValues() {
        const chart = am4core.create('countrychartdiv', am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.data = [
            {
                country: 'Lithuania',
                litres: 501.9
            },
            {
                country: 'Czech Republic',
                litres: 301.9
            },
            {
                country: 'Ireland',
                litres: 201.1
            },
            {
                country: 'Germany',
                litres: 165.8
            },
            {
                country: 'Australia',
                litres: 139.9
            },
            {
                country: 'Austria',
                litres: 128.3
            }
        ];

        chart.innerRadius = am4core.percent(40);
        chart.depth = 120;

        chart.legend = new am4charts.Legend();

        const series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = 'litres';
        series.dataFields.depthValue = 'litres';
        series.dataFields.category = 'country';
        series.slices.template.cornerRadius = 5;
        series.colors.step = 3;
    }

}
