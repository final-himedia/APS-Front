"use client";

import { useParams } from "next/navigation";

export default function ScenarioDetailPage() {
  const params = useParams();
  const scenarioId = params?.scenarioId;

  // 예: fetch(`/api/scenario/${scenarioId}`) 로 백엔드 요청 가능
}
