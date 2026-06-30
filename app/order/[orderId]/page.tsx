import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/components/NullData";
import { Suspense } from "react";

interface Iparams {
  orderId?: string;
}

const Order = async ({ params }: { params: Iparams }) => {
  const order = await getOrderById(params);

  if (!order) return <NullData title="No order"></NullData>;

  return (
    <div className="">
      <Container>
      <Suspense fallback={<>Loading...</>}>     
        <OrderDetails order={order} />
     </Suspense>
      </Container>
    </div>
  );
};

export default Order;
