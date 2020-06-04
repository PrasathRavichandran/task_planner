import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from '../main-container/task.service';

@Component({
  selector: 'app-update-list-task',
  templateUrl: './update-list-task.component.html',
  styleUrls: ['./update-list-task.component.scss']
})
export class UpdateListTaskComponent implements OnInit {
  toggleText = '';
  listId = '';
  taskId = '';

  constructor(private route: ActivatedRoute, private router: Router, private taskService: TaskService) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.listId = params.listId;
      this.taskId = params.taskId;

      if (params.status === 'edit-task') {
        this.toggleText = 'task';
      } else if (params.status === 'edit-list') {
        this.toggleText = 'list';
      } else {
        this.toggleText = '';
      }
    })

  }

  updateCurrentTask(title) {
    this.taskService.patchTask({ title: title.value }, this.taskId, this.listId)
      .subscribe(response => {
        if (response === 'OK') {
          this.router.navigate([`/lists/${this.listId}`]);
        }
      })

  }

}
