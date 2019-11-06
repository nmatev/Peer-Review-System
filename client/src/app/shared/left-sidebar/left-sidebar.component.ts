import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {

  public isAdmin: boolean;

  constructor( private readonly storage: StorageService) { }

  ngOnInit() {
    this.isAdmin = this.storage.get('role').includes('Admin');
  }

}
