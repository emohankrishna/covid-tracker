import React from 'react'
import "./Table.css"
function Table({ countries }) {
    return (
        <div className="table">
            <table>
                <tbody>
                    {
                        countries.map(({ country, cases }) => (
                            <tr key={country}>
                                <td>{country}</td>
                                <td>{cases}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
