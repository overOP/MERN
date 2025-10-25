import {
    Table,
    Column,
    Model,
    DataType,
 } from 'sequelize-typescript'

 @Table({
    tableName: 'users', // specify the table name
    modelName: 'User', // specify the model name
    timestamps: true, // enable timestamps
 })

 //extends is used to inherit properties and methods from the Model class
 class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID, //UUID type for unique identifier
        defaultValue: DataType.UUIDV4, //automatically generate UUID v4
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
    })
    declare password: string;

    @Column({
        type: DataType.ENUM('customer', 'admin'),
        defaultValue: 'customer',
    })
    declare role: string;
 }

 export default User;