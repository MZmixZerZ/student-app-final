import { UserEntity } from '../entities/user.entity';

export interface UserRepositoryInterface {
  // บันทึกข้อมูลผู้ใช้ใหม่
  save(user: UserEntity): Promise<UserEntity>;

  // ค้นหาผู้ใช้โดยใช้ username หรือ email
  findByUsername(username: string): Promise<UserEntity | null>;

  // อัปเดตข้อมูลของผู้ใช้
  update(user: UserEntity): Promise<UserEntity>;

  // ลบผู้ใช้
  delete(id: string): Promise<void>;

  // นับจำนวนผู้ใช้ทั้งหมด
  count(): Promise<number>;

  // ค้นหาผู้ใช้โดย id
  findById(id: string): Promise<UserEntity | null>;

  // ค้นหาผู้ใช้แบบแบ่งหน้า
  findAllCountPaginated(
    page: number,
    limit: number,
    sortBy: string,
    sortType: string,
    keyword: string,
    isActive: boolean,
    roles: string,
    company: string,
  ): Promise<[UserEntity[], number]>;

  // ค้นหาผู้ใช้ทั้งหมด
  findAll(): Promise<UserEntity[]>;
}
