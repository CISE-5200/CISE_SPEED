import React from "react";
interface SortableTableProps {
	headers: { key: string; label: string; display?: DisplayFunction | undefined }[];
	data: any[];
	actions?: { label?: string; action: (data: any) => any }[];
}

export type DisplayFunction = (object: any) => string;

type HeaderMap = {
	[key: string]: boolean;
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data, actions }) => 
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

				{actions?.map((action) => (
					<th key={'action' + actions?.indexOf(action)} style={!action.label ? { border: "none" } : {}}>{action.label}</th>
				))}
			</tr>
		</thead>
		<tbody>
			{data.map((row, i) => (
				<tr key={i}>
					{headers.map((header) => headersVisible[header.key] && ( // Hide any rows that don't have data.
						<td key={header.key}>{header.display !== undefined ? header.display(row[header.key]) : row[header.key]}</td>
					))}

					{actions?.map((action, i) => (
							<td key={'action' + i} style={!action.label ? { border: "none" } : {}}>{action.action(row)}</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
)
};
export default SortableTable;
