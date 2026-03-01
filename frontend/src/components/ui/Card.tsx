type Props = {
  title: string;
  value: string | number;
};

export default function Card({ title, value }: Props) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
