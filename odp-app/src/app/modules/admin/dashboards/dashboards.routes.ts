import { Routes } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';

export default [
    {
        path: '',
        component: DashboardsComponent,
        // สามารถเพิ่ม guard หรือ data เพิ่มเติมได้ที่นี่ถ้าต้องการ
    },
] as Routes;
