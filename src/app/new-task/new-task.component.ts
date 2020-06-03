import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TaskService } from '../main-container/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  listId = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(({ listId }: Params) => {
      this.listId = listId;
    })
  }

  createNewTask(title) {
    if (title.value != '') {
      this.taskService.postTask({ title: title.value }, this.listId)
        .subscribe((taskData: { _id: string, title: string, _listId: string }) => {
          this.router.navigate([`/lists/${taskData._listId}`]);
        })
    } else {
      return;
    }
  }

}
