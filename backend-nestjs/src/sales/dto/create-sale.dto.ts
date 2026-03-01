export class CreateSaleDto {
  title: string;
  amount: number;
  user: string;
  department: string;
  date: string; // フロントからは "2026-03-01" のような文字列で届く想定
}
