import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Person } from './person.type';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable({ providedIn: 'root' })
export class PersonService {
    private _basePersonUrl = '/api/persons';

    readonly apiUrl = {
        personUrl: this._basePersonUrl,
        personWithIdUrl: (id: string): string => `${this._basePersonUrl}/${id}`
    };

    private _httpClient = inject(HttpClient);
    private _personLists: BehaviorSubject<PageResponse<Person[]>> = new BehaviorSubject<PageResponse<Person[]>>(null);
    private _person: BehaviorSubject<Person> = new BehaviorSubject<Person>(null);

    set personLists(value: PageResponse<Person[]>) {
        this._personLists.next(value);
    }

    set person(value: Person) {
        this._person.next(value);
    }

    get personLists$(): Observable<PageResponse<Person[]>> {
        return this._personLists.asObservable();
    }

    get person$(): Observable<Person> {
        return this._person.asObservable();
    }

    getPersonLists(param: SearchParameter): Observable<PageResponse<Person[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Person[]>>(this.apiUrl.personUrl, options).pipe(
            tap((personResp) => {
                // ตรวจสอบและ map ให้แต่ละ person มี id (ถ้า backend ส่ง _id หรือ n_id)
                if (personResp?.items) {
                    personResp.items = personResp.items.map((p: any) => ({
                        ...p,
                        id: p.id || p._id || p.n_id // รองรับทั้ง id, _id, n_id
                    }));
                }
                this._personLists.next(personResp);
            })
        );
    }

    getPersonById(id: string): Observable<Person> {
        return this._httpClient.get<Response<Person>>(this.apiUrl.personWithIdUrl(id)).pipe(
            map((m: Response<Person>) => {
                // map _id หรือ n_id เป็น id ถ้าจำเป็น
                if (m?.item) {
                    return { ...m.item, id: m.item.id || m.item.n_id || m.item.n_id };
                }
                return m?.item;
            }),
            tap((person) => {
                this._person.next(person);
            })
        );
    }

    create(body: CreatePersonDto): Observable<any> {
        // ไม่ต้องส่ง companyId ถ้าไม่ได้ใช้
        return this._httpClient.post(this.apiUrl.personUrl, body);
    }

    update(id: string, body: UpdatePersonDto): Observable<any> {
        // ไม่ต้องส่ง companyId ถ้าไม่ได้ใช้
        return this._httpClient.put(this.apiUrl.personWithIdUrl(id), body);
    }

    delete(id: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.personWithIdUrl(id));
    }
}
