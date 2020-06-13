import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TaskService } from './task.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {

  lists = [];
  tasks = [];

  listId = '';
  isListIdFound: boolean = false;

  constructor(private taskService: TaskService, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(({ listId }: Params) => {
      this.listId = listId;
      if (this.listId) {
        this.isListIdFound = true;
        this.getTask(this.listId);
      }
    })

    this.getList();
  }

  getList() {
    this.taskService.getList().subscribe((ListData: []) => {
      this.lists = ListData
    })
  }

  getTask(listId) {
    this.taskService.getTask(listId).subscribe((TaskData: []) => {
      this.tasks = TaskData;
    })
  }

  updateTaskCompletion(task) {
    if (this.listId)
      this.taskService.patchTask({ isComplete: !task.isComplete }, task._id, this.listId)
        .subscribe(response => {
          if (response === 'OK') {
            task.isComplete = !task.isComplete;
          }
        })
  }


  handleLogout() {
    this.authService.onLogout();
    this.router.navigate(['/login']);
  }

  onDeleteTask(taskId) {
    this.taskService.deleteTask(this.listId, taskId)
      .subscribe(deletedTask => {
        if (deletedTask)
          this.getTask(this.listId);
      });
  }


  onDeleteList() {
    this.taskService.deleteList(this.listId)
      .subscribe((deletedList: any) => {
        if (deletedList) {
          let deletedListIndex = this.lists.findIndex((list) => list._id == deletedList._id);
          if (deletedListIndex) {
            this.router.navigate([`lists/${this.lists[deletedListIndex - 1]._id}`]);
          } else if (deletedListIndex === 0 && !this.lists.length) {
            this.router.navigate([`lists/${this.lists[deletedListIndex + 1]._id}`]);
          }
          else {
            this.router.navigate(['lists']);
          }
          this.getList();
        }
      })
  }

}
