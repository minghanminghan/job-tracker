import { TableContainer, Table as MUI_Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

// pagination?
export default function Table({keys, values}: {keys: any[], values: Record<string, any>[]}): React.ReactNode {
    /*
    * keys   -> header
    * values -> table elements
    * e.g. keys = [id, name, email], values = [{id: 0, name: 'John', email: 'john@gmail.com'}, ...]
    * show MUI table
    */

    return (
        <TableContainer>
            <MUI_Table>
                <TableHead>
                    <TableRow>
                        {keys.map((key) => (
                            <TableCell sx={{ fontWeight: 'bold' }} key={key}>{key}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {values.map((row, index) => (
                        <TableRow key={index}>
                            {keys.map((key) => (
                                // this needs to change
                                <TableCell key={key}>{String(row[key])}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MUI_Table>
        </TableContainer>
    )
}