import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PersonService } from 'app/core/person/person.service';
import { Person } from 'app/core/person/person.type';
import { GetPersonParameter } from 'app/core/person/parameters/get-person.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { Observable, Subject, debounceTime, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'person-list',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatSelectModule,
        RouterModule,
        MatTabsModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatTableModule,
        MatPaginatorModule
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class PersonListComponent {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    isShowReset: boolean = false;
    showLoading = {
        search: false,
    };

    drawerMode: 'side' | 'over' = 'over';
    currPage: Page = {
        page: 1,
        limit: DEF_LIMIT,
        sortBy: 'updatedAt',
        sortType: SortType.desc,
    };

    searchName: string = '';
    searchSurname: string = '';

    persons$: Observable<PageResponse<Person[]>>;
    displayedColumns: string[] = ['n_id', 'name', 'surname', 'phone'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _personService: PersonService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.persons$ = this._personService.personLists$.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300)
        );
    }

    ngOnInit(): void {
        this.fetchData();
        this.persons$.subscribe();
    }

    onOpenCreate(): void {
        this._router.navigate(['./', 'create'], {
            relativeTo: this._activatedRoute,
        });
    }

    onOpenEdit(id: string): void {
        this._router.navigate(['./', 'edit', id], {
            relativeTo: this._activatedRoute,
        });
    }

    onEdit(person: Person): void {
        if (person.id) {
            this.onOpenEdit(person.id);
        }
    }

    onDelete(person: Person): void {
        if (person.id) {
            this._fuseConfirmationService
                .alertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้ หรือไม่')
                .afterClosed()
                .subscribe((result: boolean) => {
                    if (result) {
                        this.deletePerson(person.id);
                    }
                });
        }
    }

    deletePerson(id: string): void {
        this._personService
            .delete(id)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe(() => {
                this.fetchData();
                this._fuseConfirmationService.alertSuccess();
            });
    }

    onChangePage(event: PageEvent): void {
        this.currPage.limit = event.pageSize;
        this.currPage.page = event.pageIndex + 1; // pageIndex เริ่มที่ 0
        this.fetchData();
    }

    onSearch(): void {
        this.currPage.page = 1;
        this.fetchData();
    }

    onReset(): void {
        this.searchName = '';
        this.searchSurname = '';
        this.currPage.page = 1;
        this.fetchData();
        this.isShowReset = false;
    }

    getParameter(): GetPersonParameter {
        const param = new GetPersonParameter();
        param.limit = this.currPage.limit;
        param.page = this.currPage.page;
        param.sortBy = this.currPage.sortBy;
        param.sortType = this.currPage.sortType;
        param.name = this.searchName;
        param.surname = this.searchSurname;
        return param;
    }

    fetchData(): void {
        this._personService
            .getPersonLists(this.getParameter())
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
