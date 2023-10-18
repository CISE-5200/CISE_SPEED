import React from "react";
interface SortableTableProps {
	headers: { key: string; label: string; display?: DisplayFunction | undefined }[];
	data: any[];
}

export type DisplayFunction = (object: any) => string;

type HeaderMap = {
	[key: string]: boolean;
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => 
{
	let headersVisible: HeaderMap = {};

	headers.forEach(header => {
		headersVisible[header.key] = data.filter(row => row[header.key] !== undefined).length > 0;
	});

	return (
	<table>
		<thead>
			<tr>
				{headers.map((header) => headersVisible[header.key] && ( // Hide any columns that don't have data.
					<th key={header.key}>{header.label}</th>
				))}
			</tr>
		</thead>
		<tbody>
			{data.map((row, i) => (
				<tr key={i}>
					{headers.map((header) => headersVisible[header.key] && ( // Hide any rows that don't have data.
						<td key={header.key}>{header.display !== undefined ? header.display(row[header.key]) : row[header.key]}</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
)
};
export default SortableTable;
