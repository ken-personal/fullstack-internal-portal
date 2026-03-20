import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

describe('KPIカード', () => {
  it('タイトルと値が正しく表示される', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p>$12,000</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$12,000')).toBeInTheDocument();
  });

  it('複数のKPIカードが表示される', () => {
    const kpis = ['Total Sales', 'Expenses', 'Profit', 'Employees'];

    render(
      <div>
        {kpis.map((title) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );

    kpis.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
