import {
  Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity, BeforeUpdate,
} from 'typeorm';

import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  private id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  private username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  private email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  private passwordHash: string;

  private password: string;

  @Column({ type: 'timestamptz', nullable: false })
  private createdAt: Date;

  @Column({ type: 'timestamptz', nullable: false })
  private updatedAt: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.passwordHash = await bcrypt.hash(this.password, 5);
    this.id = uuid();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (this.password) this.passwordHash = await bcrypt.hash(this.password, 5);
    this.updatedAt = new Date();
  }

  constructor(username?: string, email?: string, password?: string) {
    super();

    this.username = username;
    this.email = email;
    this.password = password;
  }

  public get() {
    return {
      id: this.getId(),
      username: this.getUsername(),
      email: this.getEmail(),
    };
  }

  public getUsername() {
    return this.username;
  }

  public getId() {
    return this.id;
  }

  public getEmail() {
    return this.email;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public async comparePassword(pass: string) {
    return bcrypt.compare(pass, this.passwordHash);
  }

  public generateToken() {
    return jwt.sign(
      { id: this.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY },
    );
  }

  public generateRefreshToken() {
    return jwt.sign(
      { id: this.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY },
    );
  }
}
