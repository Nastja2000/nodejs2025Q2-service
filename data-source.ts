import { DataSource } from "typeorm";
import { User } from "src/user/entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "nest_db",
  entities: [User],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true
});