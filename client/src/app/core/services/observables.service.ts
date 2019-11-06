import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ObservableService {
    public refreshCompSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor() { }

    refreshComponent(value: boolean) {
        if (value) {
            this.refreshCompSubject.next(value);
        } else {
            this.refreshCompSubject.next(null);
        }
    }
}
