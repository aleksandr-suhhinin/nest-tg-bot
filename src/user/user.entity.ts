import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IUser } from '../types/IUser';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  lastName: string;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', name: 'username', nullable: true })
  username: string;
}
