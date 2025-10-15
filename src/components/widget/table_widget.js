const  TableWidget = ( { data }) => {
    return (
        <div>
            <h1>Table Widget</h1>
            <table>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.label }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableWidget;