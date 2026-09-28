import {RedirectCommand, ResolveFn, Router} from "@angular/router";
import {Course} from "../models/course.model";
import {CoursesService} from "../services/courses.service";
import { inject } from "@angular/core";
import {MessagesService} from "../messages/messages.service";

export const courseResolver: ResolveFn<Course | RedirectCommand> =
  async (route) => {
    const courseId = route.paramMap.get("courseId");
    const coursesService = inject(CoursesService);
    const router = inject(Router);
    const messages = inject(MessagesService);

    if (!courseId) {
      return new RedirectCommand(router.parseUrl('/'));
    }

    try {
      return await coursesService.getCourseById(courseId);
    } catch (err) {
      console.error(err);
      messages.showMessage('Course not found', 'error');
      return new RedirectCommand(router.parseUrl('/'));
    }
  }
