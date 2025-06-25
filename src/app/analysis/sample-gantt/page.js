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
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    duration: "Duration",
    progress: "Progress",
    parentID: "ParentId",
    dependency: "Predecessor",
    resourceInfo: "Resources",
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
        allowFiltering={true}
        allowSorting={true}
        taskFields={taskFields}
        editSettings={editSettings}
        labelSettings={labelSettings}
        resourceFields={resourceFields}
        resources={projectResources}
        height="800px"
        width="1650px"
      >
        <Inject services={[Edit, Filter, Sort]} />
      </GanttComponent>
    </Box>
  );
}
