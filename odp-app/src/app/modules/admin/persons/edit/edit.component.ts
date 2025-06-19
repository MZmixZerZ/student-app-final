import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // เพิ่ม CommonModule
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PersonService } from 'app/core/person/person.service';
import { Person } from 'app/core/person/person.type';
import { CreatePersonDto } from 'app/core/person/dto/create-person.dto';
import { UpdatePersonDto } from 'app/core/person/dto/update-person.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PersonListComponent } from '../list/list.component';

@Component({
    selector: 'app-edit-person',
    standalone: true,
    imports: [
        CommonModule, // <-- เพิ่มตรงนี้
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
})
export class EditPersonComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup = null;
    personId: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    get name() {
        return this.initForm.get('name');
    }

    constructor(
        private _formBuilder: FormBuilder,
        private _listPersonComponent: PersonListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _personService: PersonService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.personId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.personId;
    }

    ngOnInit(): void {
        this._listPersonComponent.matDrawer.open();

        this._personService.person$
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((resp: Person) => {
                this.initForm = this.initialForm(resp);
            });
    }

    initialForm(person?: Person): FormGroup {
        return this._formBuilder.group({
            n_id: [person?.n_id || '', [Validators.required]],
            name: [person?.name || '', [Validators.required]],
            surname: [person?.surname || '', [Validators.required]],
            dob: [person?.dob ? new Date(person.dob) : '', [Validators.required]],
            gender: [person?.gender || '', [Validators.required]],
            citizen: [person?.citizen || '', [Validators.required]],
            nationality: [person?.nationality || '', [Validators.required]],
            religion: [person?.religion || '', [Validators.required]],
            phone: [person?.phone || '', [Validators.required]],
            address: [person?.address || '', [Validators.required]],
        });
    }

    onSave(): void {
        if (this.initForm.invalid) {
            this.initForm.markAllAsTouched();
            return;
        }
        this.disableSave = true;
        const payload = this.preparePayload(this.initForm.getRawValue());
        if (this.isEdit) {
            this.update(this.personId, payload);
        } else {
            this.create(payload);
        }
    }

    // แปลง dob ให้เป็น string (ISO) เพื่อเลี่ยง 500 Internal Server Error
    preparePayload(formValue: any): CreatePersonDto {
        return {
            ...formValue,
            dob: formValue.dob instanceof Date
                ? formValue.dob.toISOString().split('T')[0]
                : formValue.dob,
        };
    }

    create(body: CreatePersonDto): void {
        this._personService
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listPersonComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    update(id: string, body: UpdatePersonDto): void {
        this._personService
            .update(id, body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listPersonComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._listPersonComponent.matDrawer.close();
    }

    onClose(): void {
        if (this.isEdit) {
            this.backFromUpdate();
        } else {
            this.backFromCreate();
        }
    }

    backFromCreate(): void {
        this._router.navigate(['../'], { relativeTo: this._route });
    }

    backFromUpdate(): void {
        this._router.navigate(['../../'], { relativeTo: this._route });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
