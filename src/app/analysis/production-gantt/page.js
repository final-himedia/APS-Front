"use client";

import React, { useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  GanttComponent,
  Toolbar,
  Edit,
  Selection,
  Sort,
  Reorder,
  ContextMenu,
  DayMarkers,
  Inject,
  ColumnDirective,
  ColumnsDirective,
} from "@syncfusion/ej2-react-gantt";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Search";

// Syncfusion 라이선스 등록
registerLicense(
  "Ngo9BigBOggjHTQxAR8/ V1NNaF1cWWhPYVB2WmFZfVtgdVVMYV hbRH9PIiBoS35Rc0VlW3xccnVRRmlUWEF/VEBU"
);

const operations = [
  {
    OperationID: 1,
    TaskName: "Product concept",
    StartDate: new Date(2025, 3, 2),
    EndDate: new Date(2025, 3, 8),
    Duration: "5 days",
  },
  {
    OperationID: 2,
    TaskName: "Defining the product usage",
    StartDate: new Date(2025, 3, 2),
    EndDate: new Date(2025, 3, 8),
    Duration: "3",
    Progress: 30,
    ParentTaskID: 1,
  },
  {
    OperationID: 3,
    TaskName: "Defining the target audience",
    StartDate: new Date(2025, 3, 2),
    EndDate: new Date(2025, 3, 4),
    Duration: "3",
    Progress: 40,
    ParentTaskID: 1,
  },
  {
    OperationID: 4,
    TaskName: "Prepare product sketch and notes",
    StartDate: new Date(2025, 3, 5),
    EndDate: new Date(2025, 3, 8),
    Duration: "2",
    Progress: 30,
    ParentTaskID: 1,
    Predecessor: "2",
  },
];

export default function ProductionGantt() {
  const [scenario, setScenario] = useState("S0100000");

  const taskFields = {
    id: "OperationID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    parentID: "ParentTaskID",
  };

  const editSettings = {
    allowEditing: true,
    editMode: "Auto",
    allowTaskbarEditing: true,
  };

  const labelSettings = {
    rightLabel: "Resources",
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      {/* 필터 바 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>시나리오</InputLabel>
            <Select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              label="시나리오"
            >
              <MenuItem value="S0100000">S0100000</MenuItem>
              <MenuItem value="S0200000">S0200000</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="시작일"
            size="small"
            defaultValue="2025-03-15"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="종료일"
            size="small"
            defaultValue="2025-06-31"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="model-select-label">기종/호기</InputLabel>
            <Select
              labelId="model-select-label"
              label="기종/호기"
              defaultValue="F404"
            >
              <MenuItem value="F404">F404 [10020250]</MenuItem>
              <MenuItem value="F100">F100 [12345678]</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="화살표"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="트리 열기/닫기"
          />
          <FormControlLabel control={<Switch />} label="정렬" />
          <Button variant="outlined" startIcon={<SearchIcon />} size="small">
            검색
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} size="small">
            초기화
          </Button>
          <Button variant="outlined" startIcon={<SaveIcon />} size="small">
            저장
          </Button>
        </Box>
      </Paper>

      {/* 간트 차트 */}
      <Box sx={{ width: "100%", position: "relative" }}>
        <GanttComponent
          dataSource={operations}
          allowFiltering={true}
          allowSorting={true}
          taskFields={taskFields}
          editSettings={editSettings}
          labelSettings={labelSettings}
          toolbar={["ExpandAll", "CollapseAll"]}
          highlightWeekends
          enableVirtualization={true}
          splitterSettings={{ columnIndex: 2 }}
          height="787px"
          width="1622px"
        >
          <ColumnsDirective>
            <ColumnDirective
              field="OperationID"
              headerText="작업공정ID"
              width={150}
            />
            <ColumnDirective field="TaskName" headerText="작업명" width={200} />
            <ColumnDirective
              field="StartDate"
              headerText="시작일"
              width={120}
              format="yyyy-MM-dd"
            />
            <ColumnDirective
              field="EndDate"
              headerText="종료일"
              width={120}
              format="yyyy-MM-dd"
            />
          </ColumnsDirective>
          <Inject services={[Selection, Toolbar, DayMarkers, Edit, Sort]} />
        </GanttComponent>
      </Box>
    </Box>
  );
}
