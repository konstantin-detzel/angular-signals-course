import {Component, effect, inject, resource, signal} from "@angular/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {environment} from "../../environments/environment";
import {Lesson} from "../models/lesson.model";
import {HttpClient, HttpContext, httpResource} from "@angular/common/http";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {switchMap} from "rxjs";
import {searchLessons} from "../../../server/search-lessons.route";
import {SkipLoading} from "../loading/skip-loading.component";

@Component({
  selector: 'resource-demo',
  templateUrl: './resource-demo.component.html',
  styleUrls: ['./resource-demo.component.scss'],
  imports: [MatProgressSpinner]
})
export class ResourceDemoComponent {

  env = environment;

  search = signal<string>('');

  // lessons = resource<Lesson[], { search: string }>({
  //   params: () => ({
  //     search: this.search()
  //   }),
  //   loader: async ({params, abortSignal}) => {
  //     const response = await fetch(
  //       `${this.env.apiRoot}/search-lessons?query=${params.search}&courseId=18`,
  //       {
  //         signal: abortSignal
  //       }
  //     );
  //     const json = await response.json();
  //     return json.lessons;
  //   }
  // })

  lessons = httpResource<Lesson[]>(() =>
      ({
        url: `${this.env.apiRoot}/search-lessons?query=${this.search()}&courseId=18`,
        context: new HttpContext().set(SkipLoading, true)
      }), {
      parse: (raw) => (raw as {
        lessons: Lesson[]
      }).lessons,
    }
  );

  constructor() {
    effect(() => {
      console.log('searching lessons:', this.search());
    })
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reset() {

  }

  reload() {

  }
}
