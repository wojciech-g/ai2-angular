import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../task';
import { Tasks as TasksService } from '../tasks';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {};

  constructor(
    private tasksService: TasksService,
  ) {
  }

  ngOnInit(): void {
    this.tasksService.index().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  addTask(): void {
    if (this.newTask.title === undefined) {
      return;
    }

    this.newTask.completed = false;
    this.newTask.archived = false;

    this.tasks.unshift(this.newTask);

    this.tasksService.post(this.newTask).subscribe(() => {
      this.newTask = {};
      this.ngOnInit();
    });
  }

  handleChange(task: Task): void {
    this.tasksService.put(task).subscribe({
      error: (err) => {
        alert(err);
        this.ngOnInit();
      }
    });
  }

  archiveCompleted(): void {
    const requests = this.tasks
      .filter((task) => task.completed)
      .map((task) => {
        task.archived = true;
        return this.tasksService.put(task);
      });

    forkJoin(requests).subscribe(() => {
      this.ngOnInit();
    });
  }
}
