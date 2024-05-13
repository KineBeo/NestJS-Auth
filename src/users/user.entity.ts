/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Role from '../enum/role.enum';
@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({unique: true})
    public email: string;

    @Column()
    public name: string;

    @Column()
    public password: string;

    @Column({
        type: 'enum', 
        enum: Role, 
        array: true, 
        default: [Role.User]    
    })              
    public roles: Role[];

    @Column({
        nullable: true
    })
    @Exclude()
    public currentHashedRefreshToken?: string;
}

export default User;