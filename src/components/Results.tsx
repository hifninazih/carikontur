const Results = ({ hasil }: any) => {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="overflow-x-auto h-fit grow-0">
        <table className="table table-md">
          {hasil.length > 0 && (
            <thead>
              <tr>
                <th></th>
                <th>Kontur(m)</th>
                <th>Akumulasi Jarak</th>
              </tr>
            </thead>
          )}
        </table>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        <table className="table table-md">
          <tbody>
            {hasil.map((item: any, index: number) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.intervalKe}</td>
                  <td>{item.akumulasi} cm</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
