import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import {CoursesServiceWithFetch} from "../services/courses-fetch.service";
import {openEditCourseDialog} from "../edit-course-dialog/edit-course-dialog.component";
import {LoadingService} from "../loading/loading.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'home',
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent,
    MatTooltip
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService);
  messageService = inject(MessagesService);
  dialog = inject(MatDialog);
  beginnersList = viewChild('beginnersList', {
    read: MatTooltip
  });

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course =>
      course.category === 'BEGINNER');
  });

  intermediateCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course =>
      course.category === 'INTERMEDIATE');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course =>
      course.category === 'ADVANCED');
  });

  constructor() {
    effect(() => {
      console.log(`beginnersList: `, this.beginnersList());
    });
    effect(() => {
      console.log(`Beginner Courses: `,
        this.beginnerCourses());
      console.log(`Advanced Courses: `,
        this.advancedCourses());
    });

    this.loadCourses()
      .then(() => console.log(`All courses loaded:`, this.#courses()));
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      this.messageService.showMessage(
        `Error loading courses!`,
        "error"
      );
      console.error(err);
    }
  }

  protected onCourseUpdated(updatedCourse: Course) {
    if (!updatedCourse) return;
    const courses = this.#courses();
    const newCourses = courses.map(course => (
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    this.#courses.set(newCourses);
  }

  protected async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter(
        course => course.id !== courseId)
      this.#courses.set(newCourses);
    } catch (err) {
      this.messageService.showMessage(
        `Error deleting course!`,
        "error"
      );
      console.error(err);
    }
  }

  protected async onCourseAdded() {
    const newCourse = await openEditCourseDialog(
      this.dialog,
      {
        mode: "create",
        title: "Create new course"
      }
    )
    if (!newCourse) {
      return;
    }
    const newCourses = [
      ...this.#courses(),
      newCourse
    ]
    this.#courses.set(newCourses);
  }
}
