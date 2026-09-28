import {Component, effect, input} from '@angular/core';
import {Course} from "../models/course.model";
import {Lesson} from "../models/lesson.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'course',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {
  // bound from the :courseId route param by withComponentInputBinding()
  courseId = input<string>();
  // bound from the `course`/`lessons` resolve keys in app.routes.ts
  course = input<Course | null>(null);
  lessons = input<Lesson[]>([]);

  constructor() {
    effect(() => {
      console.log(this.course())
      console.log(this.lessons())
    })
  }
}
