import {Component, ElementRef, inject, input, output, viewChild} from '@angular/core';
import {Lesson} from "../../models/lesson.model";
import {ReactiveFormsModule} from "@angular/forms";
import {LessonsService} from "../../services/lessons.service";
import {MessagesService} from "../../messages/messages.service";

@Component({
    selector: 'lesson-detail',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './lesson-detail.component.html',
    styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent {

  lessonsService = inject(LessonsService);
  messagesService = inject(MessagesService);

  lesson = input.required<Lesson | null>();
  lessonUpdated = output<Lesson>();
  cancel = output();
  descriptionInput = viewChild.required<ElementRef>('description');

  protected onCancel() {
    this.cancel.emit();
  }

  protected async onSave() {
    try {
      const lesson = this.lesson();
      const description = this.descriptionInput().nativeElement.value;
      const updatedLesson =
        await this.lessonsService.saveLesson(lesson!.id, {description});
      this.lessonUpdated.emit(updatedLesson);
    } catch (err) {
      console.error(err);
      this.messagesService.showMessage(
        `Error saving lesson`,
        'error'
      );
    }
  }
}
