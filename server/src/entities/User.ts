import { Field, ObjectType } from "type-graphql";
import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column()
    firstName: string;

    @Field(() => Date)
    @Column()
    createdAt: Date = new Date();

    @Field(() => Date)
    @Column()
    updatedAt: Date = new Date();
}