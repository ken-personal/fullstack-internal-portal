// ユーザーロール（Prisma Roleに対応）
export type Role = "ADMIN" | "MANAGER" | "USER";

// 認証済みユーザー（自分のプロフィール）
export interface User {
  id: number;
  name: string;
  title: string;
  email: string;
  role: Role;
  createdAt: string;
}

// 社員一覧（DB社員 + ダミーデータの共通型）
export interface UserListItem {
  id: number | string;
  name: string;
  title?: string;
  email: string;
  role?: Role;
  createdAt?: string;
}

// 売上
export interface Sale {
  id: number;
  title: string;
  amount: number;
  user: string;
  department: string;
  date: string;
  createdAt: string;
}

export type CreateSaleInput = Omit<Sale, "id" | "createdAt">;

// 経費
export interface Expense {
  id: number;
  title: string;
  amount: number;
  user: string;
  department: string;
  date: string;
  createdAt: string;
}

export type CreateExpenseInput = Omit<Expense, "id" | "createdAt">;

// お知らせ
export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  updatedAt: string;
}

export type CreateAnnouncementInput = Omit<Announcement, "id" | "date" | "updatedAt">;

// ダッシュボード集計データ
export interface DashboardData {
  totalSales: number;
  totalExpenses: number;
  recentAnnouncements: Announcement[];
}
