import React, { Suspense } from "react";
import GoefEvent from "../pages/GoefEvent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoefEvent />
    </Suspense>
  );
}
