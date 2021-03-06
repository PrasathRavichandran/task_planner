import { Injectable } from '@angular/core';
import { WebrequestService } from '../services/webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequest: WebrequestService) { }

  postList(payload) {
    return this.webRequest.POST('list', payload);
  }

  getList() {
    return this.webRequest.GET('lists');
  }

  deleteList(listId) {
    return this.webRequest.DELETE(`list/${listId}`);
  }

  getTask(listId) {
    if (listId)
      return this.webRequest.GET(`lists/${listId}/tasks`);
  }

  postTask(payload, listId) {
    return this.webRequest.POST(`lists/${listId}/task`, payload);
  }

  patchTask(payload, taskId, listId) {
    return this.webRequest.PATCH(`lists/${listId}/task/${taskId}`, payload);
  }

  deleteTask(listId, taskId) {
    return this.webRequest.DELETE(`lists/${listId}/task/${taskId}`);
  }


}

