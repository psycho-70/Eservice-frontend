"use client";

import React from "react";
import Verify from "./verify/page";
import { useRouter } from "next/navigation";
import Signin from "./(auth)/signin/page";
export default function Home(): React.ReactElement {

const router = useRouter();
    React.useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
    if (token) router.replace("/admin");
    else router.replace("/signin");
  }, [router]);


  return (
    <div>
   <Signin />
    </div>
  );
}
