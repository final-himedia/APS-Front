"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login"); // 로그인 안 되어 있으면 로그인 페이지로
    } else {
      router.replace("/scenario"); // 로그인 되어 있으면 대시보드로 이동 (대시보드 경로 예시)
    }
  }, [router]);

  return null;
}
