import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AccessTokenMiddleware } from './common/presentation/middlewares/access-token.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './person/person.module';
dotenv.config(); // โหลดตัวแปรจากไฟล์ .env ก่อน

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI), // เชื่อมต่อฐานข้อมูล MongoDB,
    CommonModule, // โมดูลที่เกี่ยวข้องกับการใช้งานทั่วไป
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    // สามารถเพิ่มโมดูลอื่น ๆ ที่ต้องการได้ที่นี่
    AuthModule, // โมดูลสำหรับการจัดการการยืนยันตัวตน
    PersonModule, // โมดูลสำหรับการจัดการข้อมูลบุคคล
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenMiddleware)
      .exclude(
        { path: 'auth/signin', method: RequestMethod.POST }, // ยกเว้นเส้นทาง login
        { path: 'auth/register', method: RequestMethod.POST }, // ยกเว้นเส้นทาง register
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // ใช้กับทุกเส้นทางที่เหลือ
  }
}
