
const Table = ({ data }) => {

  return (
    <div className="overflow-y-auto rounded-[5px] h-[700px] ">
      <table className="border border-gray w-full">
        <thead>
          <tr>
            <th className="text-2xl p-4 border border-gray-300">Candidate</th>
            <th className="text-2xl p-4 border border-gray-300">
              Beauty of Figure (15%)
            </th>
            <th className="text-2xl p-4 border border-gray-300">
              Stage Presence (5%)
            </th>
            <th className="text-2xl p-4 border border-gray-300">
              Poise and Bearing (5%)
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map(({ id, stats }) => (
            <tr key={id}>
              {stats.map((props) => (
                <>
                  <td className="text-[20px] text-center p-4 border border-gray-300">
                    <span>
                      {props.name} #{id}
                    </span>
                  </td>

                  <td className="text-[20px] text-center p-4 border border-gray-300">
                    {props.BOF}
                  </td>

                  <td className="text-[20px] text-center p-4 border border-gray-300">
                    {props.SP}
                  </td>
                  <td className="text-[20px] text-center p-4 border border-gray-300">
                    {props.PNB}
                  </td>
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
