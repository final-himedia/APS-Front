"use client";
import {
  GanttComponent,
  Inject,
  Edit,
  Filter,
  Sort,
} from "@syncfusion/ej2-react-gantt";
import { projectResources, data } from "./datasource";
import { Box } from "@mui/material";

export default function Home() {
  const taskFields = {
    id: "id",
    name: "name",
    startDate: "startDate",
    endDate: "endDate",
    duration: "duration",
    progress: "progress",
    parentID: "parentID",
    dependency: "dependency",
    resourceInfo: "resourceInfo",
  };
  const labelSettings = {
    rightLabel: "Resources",
  };
  const editSettings = {
    allowEditing: true,
    editMode: "Auto",
    allowTaskbarEditing: true,
  };
  const resourceFields = {
    id: "ResourceId",
    name: "ResourceName",
  };
  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <GanttComponent
        dataSource={data}
        taskFields={taskFields}
        editSettings={editSettings}
        resourceFields={resourceFields}
        resources={projectResources}
        timelineSettings={{
          timelineUnitSize: 60,
          topTier: { unit: "Day", format: "MMM dd, yyyy" },
          bottomTier: { unit: "Hour", format: "HH:mm", count: 6 },
        }}
        dayWorkingTime={[{ from: 0, to: 24 }]}
        height="800px"
        width="1650px"
        durationUnit="Hour"
      >
        <Inject services={[Edit, Filter, Sort]} />
      </GanttComponent>
    </Box>
  );
}
