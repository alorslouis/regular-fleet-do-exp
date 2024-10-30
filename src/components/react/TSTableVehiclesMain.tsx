import { createColumnHelper, flexRender, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { type FilterFn, type Row } from '@tanstack/react-table'
import { useEffect, useState } from "react"

import { actions } from "astro:actions"

async function GetTableData() {
	return await actions.getVehicles.getAll({ full: false })
}

type TableData = Awaited<ReturnType<typeof GetTableData>>["data"]

export default function TSTableVehiclesMain() {

	const [tableData, setTableData] = useState<TableData | null>(null)


	useEffect(() => {
		const fetchData = async () => {
			const r = await GetTableData()
			if (r) {
				setTableData(r.data)
			}
		}

		fetchData()
	}, [])

	const columnHelper = createColumnHelper<TableData>();

	const columns = [
		columnHelper.display({
			id: "select",
			header: ({ table }) => (
				<input
					type="checkbox"
					checked={table.getIsAllRowsSelected()}
					onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
					className="cursor-pointer rounded-sm bg-transparent text-center"
				/>
			),
			cell: ({ row }) => (
				<input
					type="checkbox"
					checked={row.getIsSelected()}
					onChange={(e) => row.toggleSelected(e.target.checked)}
					className="cursor-pointer rounded-sm bg-transparent text-center"
				/>
			),
		}),
		columnHelper.accessor("vin", {
			cell: info => info.getValue(),
			header: () => "vin",
		}),
		columnHelper.accessor("vInfo.year", {
			cell: info => info.getValue(),
			header: () => "year",
		}),
		columnHelper.accessor("vInfo.condition", {
			cell: info => info.getValue(),
			header: () => "condition",
		}),
		columnHelper.accessor("vInfo.make", {
			cell: info => info.getValue(),
			header: () => "make",
		}),
		columnHelper.accessor("vInfo.model", {
			cell: info => info.getValue(),
			header: () => "model",
		}),
		columnHelper.accessor("vInfo.mpgHwy", {
			cell: info => info.getValue(),
			header: () => "hwy",
		}),
		columnHelper.accessor("vInfo.mpgCity", {
			cell: info => info.getValue(),
			header: () => "city",
		}),
		columnHelper.accessor("vInfo.miles", {
			cell: info => info.getValue()?.toLocaleString(),
			header: () => "mileage",
		}),
		columnHelper.accessor((row) => {
			const prices = row.vPrices;
			return prices?.length ? prices[0]?.vehiclePrice : undefined;
		}, {
			id: "vehiclePrice",
			cell: info => info.getValue()?.toLocaleString(undefined, {
				style: "currency",
				currency: "USD",
				maximumFractionDigits: 0
			}),
			header: () => "price",
		}),
		columnHelper.accessor("inventoryDate", {
			cell: info => info.getValue()?.toLocaleDateString(),
			header: () => "inv.date",
			sortingFn: "datetime",
			filterFn: "weakEquals"
		}),
	];

	const customGlobalFilter: FilterFn<TableData> = (
		row: Row<TableData>,
		_columnId: string,
		filterValue: string
	): boolean => {
		const searchValues = filterValue.toLowerCase().split(' ').filter(term => term.length > 0);

		if (searchValues.length === 0) return true;

		const searchObject = (obj: any): string[] => {
			let matches: string[] = [];
			for (const key in obj) {
				const value = obj[key];
				if (value == null) continue;

				if (typeof value === 'object') {
					if (Array.isArray(value)) {
						matches = matches.concat(value.flatMap(item => searchObject(item)));
					} else {
						matches = matches.concat(searchObject(value));
					}
				} else if (typeof value === 'number') {
					const numberValue = value.toString();
					matches.push(numberValue);
				} else {
					matches.push(String(value).toLowerCase());
				}
			}
			return matches;
		};

		const allValues = searchObject(row.original);

		return searchValues.every(term => {
			if (term.startsWith('>=') || term.startsWith('<=') || term.startsWith('>') || term.startsWith('<')) {
				const numericValue = Number(term.slice(term.startsWith('>=') || term.startsWith('<=') ? 2 : 1));
				return allValues.some(value => {
					const numValue = Number(value);
					if (isNaN(numValue)) return false;
					if (term.startsWith('>=')) return numValue >= numericValue;
					if (term.startsWith('<=')) return numValue <= numericValue;
					if (term.startsWith('>')) return numValue > numericValue;
					if (term.startsWith('<')) return numValue < numericValue;
					return false;
				});
			} else if (!isNaN(Number(term))) {
				return allValues.some(value => value.includes(term) || Number(value) === Number(term));
			} else {
				return allValues.some(value => value.includes(term));
			}
		});
	};

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: customGlobalFilter,
		onGlobalFilterChange: setGlobalFilter,
		onRowSelectionChange: setRowSelection,
		state: {
			globalFilter,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: 20,
			},
		},
		enableRowSelection: true,
		getRowId: (row) => row.id.toString(),
		enableMultiRowSelection: true,
	});

}
