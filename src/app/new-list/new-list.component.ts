import { Component, OnInit } from '@angular/core';
import { TaskService } from '../main-container/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit() {
  }

  createNewList(title) {
    if (title.value != '') {
      this.taskService.postList({ title: title.value })
        .subscribe((newlistData: { _id: string, title: string }) => {
          this.router.navigate([`/lists/${newlistData._id}`]);
        });
    } else {
      return;
    }

  }

}
