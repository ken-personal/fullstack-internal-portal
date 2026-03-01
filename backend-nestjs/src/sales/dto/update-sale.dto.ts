export class UpdateSaleDto {
  title?: string;
  amount?: number;
  user?: string;
  department?: string;
  date?: string; // 更新時も "2026-03-01" 形式の文字列を想定
}
