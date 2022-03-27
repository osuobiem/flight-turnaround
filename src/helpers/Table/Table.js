import './Table.css';

const Table = ({ header, rows }) => {
    
    const rowsMarkup = rows.map((row, i) =>
        <tr className="table-row" key={i}>
            {
                row.items.map((data, j) =>
                    <td key={j}>{data}</td>
                )
            }
        </tr>
    );

    const headerMarkup = header.map((h, i) => <th key={i}>{h}</th>);

    return (
        <table>
            <thead>
                <tr>{ headerMarkup }</tr>
            </thead>

            <tbody>{ rowsMarkup }</tbody>
        </table>
    );
};

export default Table;