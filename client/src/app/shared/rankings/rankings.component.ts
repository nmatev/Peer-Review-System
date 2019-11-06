import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { ChartService } from '../../core';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private readonly chartService: ChartService,
    private readonly zone: NgZone
  ) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(
      () => {
        this.chartService.getTeamWorkItemsChartData('ASC');
        this.chartService.getUserWorkItemsChartData('DESC');
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }
}
