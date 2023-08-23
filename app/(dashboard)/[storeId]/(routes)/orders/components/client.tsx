"use client";

import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { columns, OrderColumn } from "./columns"

interface OrderClientProps {
	data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	const [filterDateByMonth, setFilterDateByMonth] = useState<Date | null>(null);
	const [filterDateByDate, setFilterDateByDate] = useState<Date | null>(null);

	const handleFilterChange = (date: Date | null) => {
		setFilterDateByMonth(date);
	};

	const generatePDF = () => {
		const doc = new jsPDF();
		// @ts-ignore
		doc.autoTable({
			head: [columns.map((column) => column.header)],
			body: data.map((item) => [
				item.products,
				item.name,
				item.phone,
				item.address,
				item.totalPrice,
				item.isPaid,
				item.createdAt,
			]),
		});

		doc.save("table.pdf");
	};

	return (
		<>
			<Heading
				title={`Orders (${data.length})`}
				description="Manage orders for your store"
			/>
			<div className="flex justify-between gap-2">
				<div className="grid grid-cols-2 gap-2">
					<div className="flex gap-2 items-center">
						<div>
							<label htmlFor="filterMonth">Filter by Month: </label>
							<input
								type="month"
								id="filterDateByMonth"
								value={
									filterDateByMonth
										? `${filterDateByMonth.getFullYear()}-${(
												filterDateByMonth.getMonth() + 1
										  )
												.toString()
												.padStart(2, "0")}`
										: ""
								}
								onChange={(e) => handleFilterChange(new Date(e.target.value))}
							/>
						</div>
						<Button
							variant="default"
							size="sm"
							onClick={() =>
								router.push(
									`/${params.storeId}/orders?month=${
										filterDateByMonth
											? `${filterDateByMonth.getFullYear()}-${(
													filterDateByMonth.getMonth() + 1
											  )
													.toString()
													.padStart(2, "0")}`
											: ""
									}`
								)
							}
						>
							Filter
						</Button>
					</div>
					<div className="flex gap-2 items-center">
						<div>
							<label htmlFor="filterDate">Filter by Date: </label>
							<input
								type="date"
								id="filterDateByDate"
								value={
									filterDateByDate
										? `${filterDateByDate.getFullYear()}-${(
												filterDateByDate.getMonth() + 1
										  )
												.toString()
												.padStart(2, "0")}-${filterDateByDate
												.getDate()
												.toString()
												.padStart(2, "0")}`
										: ""
								}
								onChange={(e) => setFilterDateByDate(new Date(e.target.value))}
							/>
						</div>
						<Button
							variant="default"
							size="sm"
							onClick={() =>
								router.push(
									`/${params.storeId}/orders?date=${
										filterDateByDate
											? `${filterDateByDate.getFullYear()}-${(
													filterDateByDate.getMonth() + 1
											  )
													.toString()
													.padStart(2, "0")}-${filterDateByDate
													.getDate()
													.toString()
													.padStart(2, "0")}`
											: ""
									}`
								)
							}
						>
							Filter
						</Button>
					</div>
				</div>

				<Button variant="default" size="sm" onClick={() => generatePDF()}>
					Export
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="products" columns={columns} data={data} />
		</>
	);
};
