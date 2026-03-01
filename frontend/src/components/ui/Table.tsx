type Props = {
  headers: string[];
  data: any[];
};

export default function Table({ headers, data }: Props) {
  return (
    <table className="w-full bg-white shadow rounded">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h) => (
            <th key={h} className="p-3 text-left text-sm">
              {h}
            </th>
          ))}
          <th className="p-3"></th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            {headers.map((h) => (
              <td key={h} className="p-3 text-sm">
                {row[h]}
              </td>
            ))}

            <td className="p-3 flex gap-2">
              <button className="text-blue-500">Edit</button>
              <button className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
