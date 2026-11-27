import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  private readonly url = 'http://localhost:52703/todos';

  constructor(
    private http: HttpClient,
  ) {
  }

  public index(archived = false): Observable<Task[]> {
    return this.http.get<Task[]>(this.url, {
      params: { archived }
    });
  }

  public post(task: Task): Observable<Task> {
    return this.http.post<Task>(this.url, task);
  }

  public put(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${task.id}`, task);
  }

  public delete(task: Task): Observable<any> {
    return this.http.delete(`${this.url}/${task.id}`);
  }
}
