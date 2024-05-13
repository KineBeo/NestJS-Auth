/* eslint-disable prettier/prettier */

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
@Entity('photo')
class PhotoEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    filename: string

    @Column()
    views: number

    @Column()
    isPublished: boolean
}

export default PhotoEntity;