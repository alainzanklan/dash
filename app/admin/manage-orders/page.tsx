import Container from "@/app/components/Container";
import ManageOrdersClients from "./ManageOrdersClients";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getOrders from "@/actions/getOrders";
import { Suspense } from "react";

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <Suspense fallback={<>Loading...</>}> 
        <ManageOrdersClients orders={orders} />
        </Suspense>
      </Container>
    </div>
  );
};

export default ManageOrders;
