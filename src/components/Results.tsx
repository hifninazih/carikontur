const Results = ({ hasil }: any) => {
  return (
    <>
      <div>
        <div className="overflow-x-auto">
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

            <tbody>
              {hasil.map((item: any, index: number) => {
                return (
                  <>
                    <tr>
                      <th>{index + 1}</th>
                      <td>{item.intervalKe}</td>
                      <td>{item.akumulasi} cm</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Results;
