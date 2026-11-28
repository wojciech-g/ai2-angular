import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../task';
import { Tasks as TasksService } from '../tasks';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatCardModule, DatePipe],
  providers: [provideNativeDateAdapter()],
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

  canAddTask(): boolean {
    return !!this.newTask.title?.trim();
  }

  canArchiveCompleted(): boolean {
    return this.tasks.some((task) => task.completed);
  }
}
