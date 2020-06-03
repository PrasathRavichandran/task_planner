import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TaskService } from './task.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {

  lists = [];
  tasks = [];

  listId = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(({ listId }: Params) => {
      this.listId = listId;
      this.taskService.getTask(this.listId).subscribe((TaskData: []) => {
        this.tasks = TaskData;
      })
    })

    this.taskService.getList().subscribe((ListData: []) => {
      this.lists = ListData
    })
  }
}
