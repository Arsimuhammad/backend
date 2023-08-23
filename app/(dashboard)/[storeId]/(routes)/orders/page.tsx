import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { Prisma } from "@prisma/client"
import { OrderClient } from "./components/client"
import { OrderColumn } from "./components/columns"

const OrdersPage = async ({
	params,
	searchParams,
}: {
	params: { storeId: string };
	searchParams: { month: string; date: string };
}) => {
	const whereOrder: Prisma.OrderWhereInput = {
		storeId: params.storeId,
	};

	if (searchParams.month) {
		const [year, month] = searchParams.month.split("-");
		whereOrder["AND"] = [
			{
				createdAt: {
					gte: new Date(`${year}-${month}-1 00:00:00`),
					lte: new Date(`${year}-${month}-31 23:59:59`),
				},
			},
		];
	} else if (searchParams.date) {
		whereOrder["AND"] = [
			{
				createdAt: {
					gte: new Date(`${searchParams.date} 00:00:00`),
					lte: new Date(`${searchParams.date} 23:59:59`),
				},
			},
		];
	}

	const orders = await prismadb.order.findMany({
		where: whereOrder,
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedOrders: OrderColumn[] = orders.map((item) => ({
		id: item.id,
		phone: item.phone,
		address: item.address,
		products: item.orderItems
			.map((orderItem) => orderItem.product.name)
			.join(", "),
		totalPrice: formatter.format(
			item.orderItems.reduce((total, item) => {
				return total + Number(item.product.price);
			}, 0)
		),
		isPaid: item.isPaid,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<OrderClient data={formattedOrders} />
			</div>
		</div>
	);
};

export default OrdersPage;
