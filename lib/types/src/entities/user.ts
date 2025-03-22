export interface UserEntity {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  fcmToken: string;
}