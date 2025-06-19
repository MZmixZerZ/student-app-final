import { Routes } from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';

export default [
    {
        path: '',
        component: AuthSignInComponent,
        // สามารถเพิ่ม data หรือ guard เพิ่มเติมได้ที่นี่ถ้าต้องการ
    },
] as Routes;
